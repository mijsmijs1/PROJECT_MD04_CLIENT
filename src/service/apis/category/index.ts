import axios from "axios";
const prefix = "category";
export default {
    findCategory: async ()=>{
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}`)
    }
}