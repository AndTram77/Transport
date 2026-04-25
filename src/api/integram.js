import axios from 'axios'

const BASE_URL = import.meta.env.VITE_INTEGRAM_URL || 'http://localhost:8081'
const DB = import.meta.env.VITE_INTEGRAM_DB || 'kval'

const TOKEN = import.meta.env.VITE_INTEGRAM_TOKEN

const client = axios.create({
  baseURL: `${BASE_URL}/${DB}`,
  headers: {
    'Content-Type': 'application/json',
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  },
})

export const TABLES = {
  DRIVERS:     Number(import.meta.env.VITE_TABLE_DRIVERS)     || 20,
  VEHICLES:    Number(import.meta.env.VITE_TABLE_VEHICLES)    || 19,
  RIDES:       Number(import.meta.env.VITE_TABLE_RIDES)       || 26,
  SHIFTS:      Number(import.meta.env.VITE_TABLE_SHIFTS)      || 22,
  FINANCE:     Number(import.meta.env.VITE_TABLE_FINANCE)     || 29,
  MAINTENANCE: Number(import.meta.env.VITE_TABLE_MAINTENANCE) || 31,
  USERS:       Number(import.meta.env.VITE_TABLE_USERS)       || 33,
}

export const integram = {
  list:   (tableId, params = {}) => client.get(`/${tableId}`, { params: { JSON: '', ...params } }),
  get:    (tableId, id)          => client.get(`/${tableId}/${id}`, { params: { JSON: '' } }),
  create: (tableId, data)        => client.post(`/${tableId}`, data, { params: { JSON: '' } }),
  update: (tableId, id, data)    => client.put(`/${tableId}/${id}`, data, { params: { JSON: '' } }),
  delete: (tableId, id)          => client.delete(`/${tableId}/${id}`, { params: { JSON: '' } }),
}

export default integram
