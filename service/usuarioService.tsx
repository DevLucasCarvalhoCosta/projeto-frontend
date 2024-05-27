import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000"
})

export class UsuarioService{
    listarTodos(){
        return axiosInstance.get("api/usuarios");
    }
}

