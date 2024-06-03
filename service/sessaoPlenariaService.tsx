import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const sessaoPlenariaService = {
    listarTodos: () => api.get('/sessoesPlenarias'),
    inserir: (sessaoPlenaria: any) => api.post('/sessoesPlenarias', sessaoPlenaria),
    alterar: (sessaoPlenaria: any) => api.put(`/sessoesPlenarias/${sessaoPlenaria.id}`, sessaoPlenaria),
    excluir: (id: number) => api.delete(`/sessoesPlenarias/${id}`),
    listarProtocolos: () => api.get('/protocolos'),  // Novo método para listar protocolos
};
