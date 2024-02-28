
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

          <Route index element={<Home />}></Route>

          <Route path='user_page/:userId' element={Lazy(() => import("@/pages/user_page/UserPage"))()}></Route>
          <Route path='post' element={Lazy(() => import("@/pages/post/Post"))()}></Route>
          <Route path='product-info' element={Lazy(() => import("@/pages/product_info/ProductInfo"))()}></Route>
          <Route path='search' element={Lazy(() => import("@/pages/search/Search"))()}></Route>
        </Route>
        <Route path='admin' element={Lazy(() => import("@/pages/admin/Admin"))()}>
          <Route path='product/list' element={Lazy(() => import("@/pages/admin/pages/products/List"))()} />
          <Route path='product/recycle' element={Lazy(() => import("@/pages/admin/pages/products/Recycle"))()} />
          {/* <Route path='admin/category/list' element={Lazy(() => import("@/pages/admin/pages/categories/List"))()} />
          <Route path='admin/category/recycle' element={Lazy(() => import("@/pages/admin/pages/categories/Recycle"))()} />
          <Route path='admin/brand/list' element={Lazy(() => import("@/pages/admin/pages/brands/List"))()} />
          <Route path='admin/brand/recycle' element={Lazy(() => import("@/pages/admin/pages/brands/Recycle"))()} /> */}
          <Route path='user/list' element={Lazy(() => import("@/pages/admin/pages/users/List"))()} />
          <Route path='user/recycle' element={Lazy(() => import("@/pages/admin/pages/users/Recycle"))()} />
        </Route>
    </Routes>

    </BrowserRouter >
  )

}