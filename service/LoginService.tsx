import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
})

export class LoginService{

    login(login: String, senha: String){
        return axiosInstance.post("/api/login", 
            { username: login, password: senha});
    }

}