
import Layout from '@/pages/homes/Layout'
import Home from '@/pages/homes/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '@/pages/login/Login'
import Lazy from '@/utils/lazies/Lazy'

export default function RouteSetup() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>

          <Route index element={<Home/>}></Route>
      
          <Route path='user_page' element={Lazy(() => import("@/pages/user_page/UserPage"))()}></Route>
          <Route path='post' element={Lazy(() => import("@/pages/post/Post"))()}></Route>
        </Route>

      </Routes>

    </BrowserRouter>
  )

}