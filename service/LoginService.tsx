import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000"
})

export class LoginService{

    login(email: String, senha: String){
        return axiosInstance.post("/api/login", 
            { email: email, senha: senha});
    }

}
