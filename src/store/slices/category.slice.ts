import { createSlice } from "@reduxjs/toolkit";
export type AvailableStatus = "active" | "inactive"
export type Category = {
    id: number;
    name: string;
    codeName: string;
    avatar: String;
    createAt: string;
    updateAt: String;
    status: AvailableStatus
    branches: Branch[]
}
export type Branch = {
    id: number;
    name: string;
    codeName: string;
    createAt: string;
    updateAt: String;
    status: AvailableStatus
}
export type Course = {
    id: number;
    name: string;
    studyTime: string;
    studyLevel: string;
    lessonQuantity: number;
    des: string;
    categoryId: number;
    price: number;
    avatar: string;
    status: AvailableStatus;

}
interface InitState {
    category: Category[] | null;
    course: Course[] | null
}
const initialState: InitState = {
    category: null,
    course: null
}
const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.category = action.payload
        }
    }
})
export const categoryAction = categorySlice.actions
export const categoryReducer = categorySlice.reducer

