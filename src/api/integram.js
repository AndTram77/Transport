import axios from 'axios'

const BASE_URL = import.meta.env.VITE_INTEGRAM_URL || 'http://localhost:8081'
const DB = import.meta.env.VITE_INTEGRAM_DB || 'kval'

const client = axios.create({
  baseURL: `${BASE_URL}/${DB}`,
  headers: { 'Content-Type': 'application/json' },
})

export const TABLES = {
  DRIVERS:     Number(import.meta.env.VITE_TABLE_DRIVERS)     || 1875997,
  VEHICLES:    Number(import.meta.env.VITE_TABLE_VEHICLES)    || 1876002,
  ORDERS:      Number(import.meta.env.VITE_TABLE_ORDERS)      || 1876007,
  SHIFTS:      Number(import.meta.env.VITE_TABLE_SHIFTS)      || 1876012,
  FINANCE:     Number(import.meta.env.VITE_TABLE_FINANCE)     || 1876017,
  MAINTENANCE: Number(import.meta.env.VITE_TABLE_MAINTENANCE) || 1876022,
}

export const integram = {
  list:   (tableId, params = {}) => client.get(`/${tableId}`, { params: { JSON: '', ...params } }),
  get:    (tableId, id)          => client.get(`/${tableId}/${id}`, { params: { JSON: '' } }),
  create: (tableId, data)        => client.post(`/${tableId}`, data, { params: { JSON: '' } }),
  update: (tableId, id, data)    => client.put(`/${tableId}/${id}`, data, { params: { JSON: '' } }),
  delete: (tableId, id)          => client.delete(`/${tableId}/${id}`, { params: { JSON: '' } }),
}

export default integram
