import authenApi from './authen'
import categoryApi from './category'
import productApi from "./product"
import memberApi from "./member"
import receiptApi from './receipt'
import walletApi from './wallet'
import './axios.instance'
export const api = {
    authen: authenApi,
    category: categoryApi,
    product: productApi,
    member: memberApi,
    receipt: receiptApi,
    wallet: walletApi
}