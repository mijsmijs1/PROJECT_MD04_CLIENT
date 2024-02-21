import axios from "axios";
const prefix = 'product';
export default {
    createProduct: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
    },
    updateVideo: async (data: any, productId: number) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/updateVideo/${productId}`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
    },
    getProduct: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}`)
    },
    getProductById: async (id: Number) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${id}`)
    },
    getProductByUserId: async (userId: Number) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/getByUserId/${userId}`)
    },
    getProductSearch: async (keyWord: String) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/search?keyword=${keyWord}&&more=false`)
    },
    getProductSearchFull: async (keyWord: String) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/search?keyword=${keyWord}&&more=true`)
    }, 
    getProductReviewing: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/reviewing`)
    },
    getProductDelete: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/delete`)
    },
    update: async (id, data) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${id}`, data)
    }


}