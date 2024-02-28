import { createSlice } from "@reduxjs/toolkit";
type AvailableStatus = "active" | "inactive"
type addModal = true | false
export type course_access = {
    id: number;
    userId: number;
    createAt: string;
    updateAt: string;
    courseId: number;
}

export type log = {
    id: number;
    memberId: number;
    note: string;
    createTime: string;
    userId: number;
}

export type user = {
    id: number;
    userName: string;
    password: string;
    avatar: string;
    email: string;
    emailConfirm: AvailableStatus;
    phoneNumber: string;
    phoneConfirm: AvailableStatus;
    wallet: number;
    status: boolean;
    createAt: string;
    updateAt: string;
    lastLogin: string;
    firstName: string;
    lastName: string;
    birthday: string;
    courses: course_access[];
    logs: log[];
}
interface InitState {
    data: user | null,
    userProduct: user | null,
    addModal: addModal,
    list :user[]

}
let initialState: InitState = {
    data: null,
    userProduct: null,
    addModal: false,
    list:[]
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
        setUserProduct: (state, action) => {
            state.userProduct = action.payload;
        },
        loadModal: (state) => {
            state.addModal = !state.addModal
        },
        addData: (state, action) => {
            state.list.unshift(action.payload)
        },
        update: (state, action) => {
            state.list = state.list.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        },setList: (state, action) => {
            state.list = action.payload
        }
    }
})
export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;