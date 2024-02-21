import { createSlice } from "@reduxjs/toolkit";
export type AvailableStatus = "active" | "inactive"
export type ProductStatus = "active" | "inactive" |"done" |"delete"
type addModal = true | false
export type Product ={
    id: number;
    name: string;
    price: number;
    moderationStatus: AvailableStatus;
    status: ProductStatus;
    createAt: string;
    updateAt: string;
    desc: string;
    detail: string;
    address: string;
    priorityStatus: AvailableStatus;
    avatar: string;
    videoUrl: string;
    branchId: number;
    userId:number;
    imgs:Img[];
}
export type Img = {
    id: number;
    imgUrl: string;
    createAt: string;
    updateAt: string;
    productId: number;
}
interface Initial {
    product: Product[] | null,
    addModal: addModal
}
const initialState :Initial ={
    product: null,
    addModal: false
}
const productSlice = createSlice({
    name:"productSlice",
    initialState,
    reducers:{
        setData: (state, action)=>{
            state.product = action.payload;
        },
        loadModal: (state) => {
            state.addModal = !state.addModal
        },
        update: (state, action) => {
            state.product = state.product.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        }
    }
})
export const productReducer=productSlice.reducer;
export const productAction = productSlice.actions