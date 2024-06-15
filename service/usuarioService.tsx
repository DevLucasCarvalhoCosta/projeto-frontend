// axiosInstance.js
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000'
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('TOKEN_APLICACAO_FRONTEND'); // Verifique se o token está presente no localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export class UsuarioService {
  listarTodos() {
    return axiosInstance.get("/api/usuarios");
  }

  buscarPorId(id: number) {
    return axiosInstance.get(`/api/usuarios/${id}`);
  }

  inserir(objeto: any) {
    return axiosInstance.post("/api/usuarios", objeto);
  }

  alterar(objeto: any) {
    return axiosInstance.put(`/api/usuarios/${objeto.id}`, objeto);
  }

  excluir(id: number) {
    return axiosInstance.delete(`/api/usuarios/${id}`);
  }

  login(usuario: any) {
    return axiosInstance.post("/login", usuario);
  }
}
