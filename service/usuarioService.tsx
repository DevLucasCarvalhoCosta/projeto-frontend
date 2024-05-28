import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000"
})

export class UsuarioService{
    listarTodos(){
        return axiosInstance.get("api/usuarios");
    }
    buscarPordId(id : number) {
        return axiosInstance.get("api/usuarios" + id);
    }

    inserir(objeto: any){
        return axiosInstance.post("api/usuarios");
    }

    alterar(objeto : any){
        return axiosInstance.put("api/usuarios");
    }

    excluir(id : number){
        return axiosInstance.delete("api/usuarios" + id);
    }
}

