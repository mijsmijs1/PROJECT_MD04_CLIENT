import RouteSetup from "./router/RouteSetup"
import { useEffect, useState } from 'react';
import { api } from "./service/apis";
import { useDispatch } from "react-redux";
import { userAction } from "./store/slices/user.slice";
import { receiptAction } from "./store/slices/receipt.slice";
function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    api.authen.decodeToken(localStorage.getItem('token'))
      .then(res => {
        if (res.status == 200) {
          dispatch(userAction.setData(res.data.data))
        } else {
          dispatch(userAction.setData(null))
        }
      })
      .catch(err => {
        console.log('err', err);
        dispatch(userAction.setData(null))
        localStorage.removeItem('token')
      })
  }, [])
  useEffect(() => {
    if (!localStorage.getItem('token')) return
    try {
      api.receipt.findMany()
        .then(res => {
          let cart = null;
          let receipt = [];
          for (let i in res.data.data) {
            if (res.data.data[i].status == "shopping") {
              cart = res.data.data[i]
            } else {
              receipt.push(res.data.data[i])
            }
          }
          dispatch(receiptAction.setCart(cart))
          dispatch(receiptAction.setReceipt(receipt))
        })
        .catch(err => { })
    } catch (err) { }
  }, [])
  return (
    <>
      <RouteSetup />
    </>
  )
}

export default App
