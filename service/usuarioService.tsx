import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000"
})

export class UsuarioService {
    listarTodos() {
        return axiosInstance.get("api/usuarios");
    }

    buscarPorId(id: number) {
        return axiosInstance.get("api/usuarios/" + id); // Corrigido para adicionar '/' antes do id
    }

    inserir(objeto: any) {
        return axiosInstance.post("api/usuarios", objeto); // Corrigido para enviar o objeto como corpo da requisição
    }

    alterar(objeto: any) {
        return axiosInstance.put("api/usuarios", objeto); // Corrigido para enviar o objeto como corpo da requisição
    }

    excluir(id: number) {
        return axiosInstance.delete("api/usuarios/" + id); // Corrigido para adicionar '/' antes do id
    }
}
