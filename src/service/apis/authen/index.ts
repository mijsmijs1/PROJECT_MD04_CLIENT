import axios from "axios"
const prefix = "user"
export default {
    login: async (loginData: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}/login`, loginData)
    },
    create: async (user: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}/register`, user)
    },
    decodeToken: async (token: string) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/decodeToken/${token}`)
    },
    loginWithGoogle: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}/loginWithGoogle`, data)
    },
    getUserById: async (id: number) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${id}`)
    },
    findMany: async function () {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}`);
    }

}