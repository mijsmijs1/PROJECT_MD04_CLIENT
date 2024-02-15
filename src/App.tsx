import RouteSetup from "./router/RouteSetup"
import { useEffect, useState } from 'react';
import { api } from "./service/apis";
import { useDispatch } from "react-redux";
import { userAction } from "./store/slices/user.slice";
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
  return (
    <>
      <RouteSetup />
    </>
  )
}

export default App
