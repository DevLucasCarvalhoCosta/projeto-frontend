import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const sessaoPlenariaService = {
    listarTodos: (token: string) => api.get('/sessoesPlenarias', { headers: { Authorization: `Bearer ${token}` } }),
    inserir: (sessaoPlenaria: any, token: string) => api.post('/sessoes-plenarias', sessaoPlenaria, { headers: { Authorization: `Bearer ${token}` } }),
    alterar: (sessaoPlenaria: any, token: string) => api.put(`/sessoesPlenarias/${sessaoPlenaria.id}`, sessaoPlenaria, { headers: { Authorization: `Bearer ${token}` } }),
    excluir: (id: number, token: string) => api.delete(`/sessoesPlenarias/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
    listarProtocolos: (token: string) => api.get('/protocolos', { headers: { Authorization: `Bearer ${token}` } }),
};
