import Navbar from "@/components/navbars/Navbar";
import { Element, scroller } from 'react-scroll';
import { useSpring, animated } from "react-spring";
import "./layout.scss"
import { Outlet } from "react-router-dom";
import Footer from "@/components/footers/Footer";
import Login from "../login/Login";
import { useEffect, useState } from "react";
import { api } from "@/service/apis";
import { productAction } from "@/store/slices/product.slice";
import { useDispatch } from "react-redux";
import { categoryAction } from "@/store/slices/category.slice";
import { receiptAction } from "@/store/slices/receipt.slice";




export default function Layout() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch()
  useEffect(() => {
    // if (!localStorage.getItem("token")) return
    const fetchData = async () => {
      try {
        const res = await api.product.getProduct();
        if (res.status == 200) {
          dispatch(productAction.setData(Object.values(res.data.data)));
          console.log('res.data.data', res.data.data);

        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [])
  useEffect(() => {
    // if (!localStorage.getItem("token")) return
    try {
      api.category.findCategory()
        .then(async (res) => {
          dispatch(categoryAction.setData(res.data.data))
          console.log("categories", res.data.data)
        })
        .catch(err => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }, [])
  useEffect(() => {
    // if (!localStorage.getItem("token")) return
    try {
      api.category.findCategory()
        .then(async (res) => {
          dispatch(categoryAction.setData(res.data.data))
          console.log("categories", res.data.data)
        })
        .catch(err => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }, [])
  useEffect(() => {
    if (!localStorage.getItem('token')) return
    try {
      api.receipt.findMany()
        .then(res => {
          console.log(res);
          
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
        .catch(err => { 
          console.log(err);
          
        })
    } catch (err) { }
  }, [])
  return (

    <div className="layout_comtainer" >
      <div className="box-navbar">
        <Navbar modalVisible={modalVisible} setModalVisible={setModalVisible} />
      </div>
      {modalVisible && <Login setModalVisible={setModalVisible} />}

      <div className="layout_body_container">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
