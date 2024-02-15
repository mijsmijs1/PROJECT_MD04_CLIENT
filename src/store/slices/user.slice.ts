import { createSlice } from "@reduxjs/toolkit";
type AvailableStatus = "active" | "inactive"

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
    phoneNNumber: string;
    phoneConfirm: AvailableStatus;
    wallet: number;
    status: boolean;
    createAt: string;
    updateAt: string;
    lastLogin: string;
    firstName: string;
    lastName: string;
    birthday: string;
    courses:course_access[];
    logs: log[];
}
interface InitState {
    data: user | null,


}
let initialState: InitState = {
    data: null,

}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
    }
})
export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;