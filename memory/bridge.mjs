#!/usr/bin/env node
/**
 * Transport CRM — Memory MCP Bridge
 *
 * Долгосрочная память разработчика, хранится в Integram (база kval).
 * Таблица "Transport_Память" создаётся автоматически при первом запуске.
 *
 * Инструменты:
 *   memory_save         — сохранить факт (type/name/content)
 *   memory_search       — семантический + текстовый поиск
 *   memory_remember     — вспомнить контекст по теме
 *   memory_list         — список всех записей
 *   memory_shared_state — кросс-сессионный KV-стейт
 *   memory_stats        — статистика
 *
 * Env:
 *   INTEGRAM_SERVER   — URL сервера (default: https://ai2o.ru)
 *   INTEGRAM_DB       — имя базы  (default: kval)
 *   INTEGRAM_LOGIN    — логин
 *   INTEGRAM_PASSWORD — пароль
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import https from 'https';
import http from 'http';
import crypto from 'crypto';

// ── Конфигурация ────────────────────────────────────────────────────────────

const SERVER_URL   = process.env.INTEGRAM_SERVER   || 'https://ai2o.ru';
const DB           = process.env.INTEGRAM_DB       || 'kval';
const LOGIN        = process.env.INTEGRAM_LOGIN    || '';
const PASSWORD     = process.env.INTEGRAM_PASSWORD || '';

const MEMORY_TABLE = 'Transport_Память';

// ── Состояние ───────────────────────────────────────────────────────────────

const _auth  = {};                            // db → { token, xsrf }
let   _memTypeId = null;                      // typeId для Transport_Память
const _cache = { data: null, ts: 0, TTL: 60_000 }; // кэш записей (60 сек)

// ── HTTP ────────────────────────────────────────────────────────────────────

function httpReq(url, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const u   = new URL(url);
    const mod = u.protocol === 'https:' ? https : http;
    const opts = {
      hostname: u.hostname,
      port:     u.port || (u.protocol === 'https:' ? 443 : 80),
      path:     u.pathname + u.search,
      method,
      headers:  { ...headers },
      timeout:  30_000,
    };
    if (body) opts.headers['Content-Length'] = Buffer.byteLength(body);
    const req = mod.request(opts, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => resolve(buf));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    if (body) req.write(body);
    req.end();
  });
}

async function ensureAuth() {
  if (_auth[DB]) return _auth[DB];
  const url  = `${SERVER_URL}/${DB}/auth?JSON`;
  const body = `login=${encodeURIComponent(LOGIN)}&pwd=${encodeURIComponent(PASSWORD)}`;
  const raw  = await httpReq(url, 'POST', body, {
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  const parsed = JSON.parse(raw);
  if (!parsed.token) throw new Error(`Auth failed: ${raw.substring(0, 200)}`);
  _auth[DB] = { token: parsed.token, xsrf: parsed._xsrf || '' };
  return _auth[DB];
}

async function iGet(endpoint) {
  const { token } = await ensureAuth();
  const raw = await httpReq(`${SERVER_URL}/${DB}/${endpoint}`, 'GET', null, {
    'X-Authorization': token,
  });
  try { return JSON.parse(raw); }
  catch { throw new Error(`Non-JSON from GET /${endpoint}: ${raw.substring(0, 200)}`); }
}

async function iPost(endpoint, params = {}) {
  const { token, xsrf } = await ensureAuth();
  const body = new URLSearchParams({ ...params, _xsrf: xsrf }).toString();
  const sep  = endpoint.includes('?') ? '&' : '?';
  const raw  = await httpReq(`${SERVER_URL}/${DB}/${endpoint}${sep}JSON_KV`, 'POST', body, {
    'Content-Type':  'application/x-www-form-urlencoded',
    'X-Authorization': token,
  });
  try { return JSON.parse(raw); }
  catch { return { raw }; }
}

async function iGetAll(typeId) {
  const all  = [];
  const seen = new Set();
  for (let pg = 1; pg <= 100; pg++) {
    const data = await iGet(`object/${typeId}?JSON_KV&limit=500&pg=${pg}`);
    const objs = data.object || [];
    if (objs.length === 0) break;
    let added = 0;
    for (const o of objs) {
      if (!seen.has(o.id)) {
        seen.add(o.id);
        all.push({ id: o.id, val: o.val || '' });
        added++;
      }
    }
    if (added === 0 || objs.length < 20) break;
  }
  return all;
}

// ── Таблица памяти — найти или создать ──────────────────────────────────────

async function getMemoryTypeId() {
  if (_memTypeId) return _memTypeId;

  const { token } = await ensureAuth();
  const raw = await httpReq(`${SERVER_URL}/${DB}/dict?JSON`, 'GET', null, {
    'X-Authorization': token,
  });

  let dict;
  try { dict = JSON.parse(raw); } catch { dict = {}; }

  // Ищем существующую таблицу
  for (const [id, name] of Object.entries(dict)) {
    if (name === MEMORY_TABLE && parseInt(id) > 200) {
      _memTypeId = parseInt(id);
      console.error(`[Memory] Найдена таблица ${MEMORY_TABLE} → typeId=${_memTypeId}`);
      return _memTypeId;
    }
  }

  // Создаём новый тип (дочерний от типа 3 — корень пользовательских типов)
  console.error(`[Memory] Создаём таблицу "${MEMORY_TABLE}"...`);
  const result = await iPost(`_m_new/3`, { t3: MEMORY_TABLE, up: 1 });
  const typeId = result.obj || result.id;
  if (!typeId) throw new Error(`Не удалось создать тип "${MEMORY_TABLE}": ${JSON.stringify(result)}`);

  _memTypeId = parseInt(typeId);
  console.error(`[Memory] Таблица создана → typeId=${_memTypeId}`);
  return _memTypeId;
}

// ── Встроенный эмбеддинг (64-dim, детерминированный) ───────────────────────

function embed(text, dims = 64) {
  const vec  = new Float32Array(dims);
  const norm = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim();

  for (let i = 0; i < norm.length - 2; i++) {
    const h = parseInt(crypto.createHash('md5').update(norm.substring(i, i + 3)).digest('hex').slice(0, 8), 16);
    vec[h % dims] += 1;
  }
  for (const word of norm.split(/\s+/)) {
    if (word.length < 2) continue;
    const h = parseInt(crypto.createHash('md5').update(word).digest('hex').slice(0, 8), 16);
    vec[h % dims] += 3;
  }

  let mag = Math.sqrt(Array.from(vec).reduce((s, v) => s + v * v, 0)) || 1;
  for (let i = 0; i < dims; i++) vec[i] /= mag;
  return Array.from(vec);
}

function cosine(a, b) {
  let dot = 0, nA = 0, nB = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; nA += a[i] * a[i]; nB += b[i] * b[i]; }
  return dot / (Math.sqrt(nA) * Math.sqrt(nB) || 1);
}

// ── Обработка инструментов ───────────────────────────────────────────────────

async function handle(name, args) {
  switch (name) {

    // ─────────────────────────────────
    case 'memory_save': {
      const typeId = await getMemoryTypeId();
      const val = `[${args.type || 'project'}] ${args.name}: ${args.content || ''}`;
      const result = await iPost(`_m_new/${typeId}`, { [`t${typeId}`]: val, up: '1' });
      _cache.ts = 0;
      return {
        saved:  true,
        id:     result.obj || result.id,
        type:   args.type || 'project',
        name:   args.name,
        table:  MEMORY_TABLE,
      };
    }

    // ─────────────────────────────────
    case 'memory_search': {
      const query = (args.query || '').toLowerCase().trim();
      if (!query) return { error: 'query is required' };
      const limit = args.limit || 10;

      const now = Date.now();
      if (!_cache.data || (now - _cache.ts) > _cache.TTL) {
        const typeId  = await getMemoryTypeId();
        _cache.data = await iGetAll(typeId);
        _cache.ts   = Date.now();
      }

      const words    = query.split(/\s+/).filter(w => w.length >= 2);
      const queryEmb = embed(query);

      const results = _cache.data
        .map(obj => {
          const low  = obj.val.toLowerCase();
          let   tScore = 0;
          for (const w of words) if (low.includes(w)) tScore += 2;
          const cScore = cosine(queryEmb, embed(obj.val));
          const score  = tScore + cScore * 5;
          return { id: obj.id, value: obj.val, score: Math.round(score * 100) / 100 };
        })
        .filter(r => r.score > 1.0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return { query, results, total: results.length };
    }

    // ─────────────────────────────────
    case 'memory_remember': {
      const question = (args.question || '').trim();
      if (!question) return { error: 'question is required' };

      const { results = [] } = await handle('memory_search', { query: question, limit: 15 });
      if (results.length === 0) return { narrative: 'Память пуста — нет записей по этому вопросу.', entries: 0 };

      // Группируем по типу
      const groups = {};
      for (const r of results) {
        const match = r.value.match(/^\[(\w+)\]/);
        const type  = match ? match[1] : 'other';
        (groups[type] = groups[type] || []).push(r.value);
      }

      let narrative = `По запросу "${question}" найдено ${results.length} записей:\n\n`;
      for (const [type, vals] of Object.entries(groups)) {
        narrative += `### ${type}\n`;
        for (const v of vals) {
          narrative += `- ${v.length > 200 ? v.slice(0, 200) + '…' : v}\n`;
        }
        narrative += '\n';
      }

      return { narrative, entries: results.length };
    }

    // ─────────────────────────────────
    case 'memory_list': {
      const typeId  = await getMemoryTypeId();
      const limit   = args.limit || 50;
      const data    = await iGet(`object/${typeId}?JSON_KV&limit=${limit}`);
      const records = (data.object || []).map(o => ({ id: o.id, value: o.val || '' }));
      return { table: MEMORY_TABLE, total: data.cnt || records.length, records };
    }

    // ─────────────────────────────────
    case 'memory_shared_state': {
      const { action, key, value } = args;
      const typeId = await getMemoryTypeId();

      if (action === 'get') {
        const all    = await iGetAll(typeId);
        const states = all
          .filter(o => o.val?.startsWith('state:'))
          .map(o => {
            const m = o.val.match(/^state:(\S+)\s+([\s\S]*)$/);
            return m ? { id: o.id, key: m[1], value: m[2] } : null;
          })
          .filter(Boolean);
        if (key) return states.find(s => s.key === key) || { key, value: null };
        return { states };
      }

      if (action === 'set') {
        if (!key) return { error: 'key required' };
        const all      = await iGetAll(typeId);
        const existing = all.find(o => o.val?.startsWith(`state:${key} `));
        const stateVal = `state:${key} ${typeof value === 'string' ? value : JSON.stringify(value)}`;
        if (existing) {
          await iPost(`_m_save/${existing.id}`, { [`t${typeId}`]: stateVal });
        } else {
          await iPost(`_m_new/${typeId}`, { [`t${typeId}`]: stateVal, up: '1' });
        }
        _cache.ts = 0;
        return { key, value, updated: !!existing, created: !existing };
      }

      if (action === 'delete') {
        if (!key) return { error: 'key required' };
        const all      = await iGetAll(typeId);
        const existing = all.find(o => o.val?.startsWith(`state:${key} `));
        if (existing) {
          await iPost(`_m_del/${existing.id}`, {});
          _cache.ts = 0;
          return { key, deleted: true };
        }
        return { key, deleted: false, reason: 'not found' };
      }

      return { error: `Unknown action: ${action}. Use: get, set, delete` };
    }

    // ─────────────────────────────────
    case 'memory_stats': {
      const typeId = await getMemoryTypeId();
      const data   = await iGet(`object/${typeId}?JSON_KV&limit=1`);
      return {
        project:  'Transport CRM',
        database: DB,
        server:   SERVER_URL,
        table:    MEMORY_TABLE,
        typeId,
        records:  data.cnt || 0,
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// ── Описания инструментов ────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'memory_save',
    description: 'Сохранить запись в долгосрочную память Transport CRM. ' +
      'Используй для: решений по архитектуре, предпочтений пользователя, ' +
      'технических находок, важных фактов о проекте. ' +
      'Память переживает сессии — другие сессии Claude увидят эти записи.',
    inputSchema: {
      type: 'object',
      properties: {
        type:    { type: 'string', enum: ['user', 'feedback', 'project', 'reference'],
                   description: 'user=о пользователе, feedback=обратная связь, project=факт о проекте, reference=ссылка/путь' },
        name:    { type: 'string', description: 'Короткое название (3–10 слов)' },
        content: { type: 'string', description: 'Полное содержание записи' },
      },
      required: ['type', 'name', 'content'],
    },
  },
  {
    name: 'memory_search',
    description: 'Поиск по памяти проекта (семантический + текстовый). ' +
      'Используй ПЕРЕД началом работы — вспомни контекст, решения, обратную связь.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Что ищем' },
        limit: { type: 'number', description: 'Макс. результатов (по умолчанию 10)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'memory_remember',
    description: 'Вспомнить контекст по теме — возвращает сгруппированный нарратив. ' +
      'Используй когда нужен КОНТЕКСТ, а не просто список фактов.',
    inputSchema: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'Вопрос или тема' },
      },
      required: ['question'],
    },
  },
  {
    name: 'memory_list',
    description: 'Показать все записи памяти (последние N). Для обзора что сохранено.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Макс. записей (по умолчанию 50)' },
      },
    },
  },
  {
    name: 'memory_shared_state',
    description: 'Кросс-сессионный KV-стейт — виден ВСЕМ сессиям Claude одновременно. ' +
      'Для: текущий статус задачи, кто над чем работает, блокеры, ссылки на PR.',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['get', 'set', 'delete'], description: 'Действие' },
        key:    { type: 'string', description: 'Ключ (обязателен для set/delete)' },
        value:  { description: 'Значение (для set)' },
      },
      required: ['action'],
    },
  },
  {
    name: 'memory_stats',
    description: 'Статистика памяти: количество записей, ID таблицы, сервер.',
    inputSchema: { type: 'object', properties: {} },
  },
];

// ── MCP Server ───────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'transport-memory', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await handle(name, args || {});
    return {
      content: [{
        type: 'text',
        text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
      }],
    };
  } catch (e) {
    console.error(`[Memory] ${name} error:`, e.message);
    if (e.message.includes('Auth') || e.message.includes('401')) {
      delete _auth[DB];
    }
    return {
      content: [{ type: 'text', text: `Error: ${e.message}` }],
      isError: true,
    };
  }
});

// ── Start ────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[Memory] Transport CRM memory bridge started | ${SERVER_URL}/${DB} | table=${MEMORY_TABLE}`);
}

main().catch(err => {
  console.error('[Memory] Fatal:', err);
  process.exit(1);
});
