import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/user.slice";
import { categoryReducer } from "./slices/category.slice";
const RootReducer = combineReducers({
    userStore: userReducer,
    categoryStore: categoryReducer
})
export type Store = ReturnType<typeof RootReducer>
export const store = configureStore({
    reducer: RootReducer
})