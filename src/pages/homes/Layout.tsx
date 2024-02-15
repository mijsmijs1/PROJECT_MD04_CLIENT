import Navbar from "@/components/navbars/Navbar";
import { Element, scroller } from 'react-scroll';
import { useSpring, animated } from "react-spring";
import "./layout.scss"
import { Outlet } from "react-router-dom";
import Footer from "@/components/footers/Footer";
import Login from "../login/Login";
import { useEffect, useState } from "react";




export default function Layout() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
