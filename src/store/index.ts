import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/user.slice";
import { categoryReducer } from "./slices/category.slice";
import { productReducer } from "./slices/product.slice";
import { memberReducer } from "./slices/member.slice";
import { logReducer } from "./slices/log.slice";
import { receiptReducer } from "./slices/receipt.slice";
const RootReducer = combineReducers({
    userStore: userReducer,
    categoryStore: categoryReducer,
    productStore: productReducer,
    memberStore: memberReducer,
    logStore: logReducer,
    receiptStore: receiptReducer
})
export type Store = ReturnType<typeof RootReducer>
export const store = configureStore({
    reducer: RootReducer
})