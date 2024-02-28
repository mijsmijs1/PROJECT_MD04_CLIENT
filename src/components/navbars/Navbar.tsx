import { useNavigate } from "react-router-dom"
import "./navbar.scss"
import { useSpring, animated } from "react-spring";
import { useEffect, useState } from "react";

import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { Store } from "@/store";
import { Modal, message } from "antd";
import { userAction } from "@/store/slices/user.slice";
import { convertToVND } from '@mieuteacher/meomeojs';
import TopUpForm from "../topUpForm/TopUpForm";
import { useTranslation } from "react-i18next";
import MultiLanguage from "../multiLang/MultiLang";
import { logout } from "@/service/firebase";
import { api } from "@/service/apis";
import { receiptAction } from "@/store/slices/receipt.slice";
export default function Navbar({ modalVisible, setModalVisible }) {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const userStore = useSelector((store: Store) => store.userStore)
  const categoryStore = useSelector((store: Store) => store.categoryStore)
  const receiptStore = useSelector((store: Store) => store.receiptStore)
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchContent, setSearchContent] = useState([])
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [showTopUpForm, setShowTopUpForm] = useState(false);
  const [category, setCategory] = useState(null)
  async function handleShowSearch(searchKey: string) {


    if (searchKey.length > 0) {
      setKeyword(searchKey);
      setShowSearch(true);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        setSearchContent([]);
      }
      setTypingTimeout(setTimeout(async () => {
        let result = await api.product.getProductSearch(searchKey)
        if (result.status == 200) {
          if (Object.keys(result.data.data).length != 0) {
            setSearchContent(Object.values(result.data.data))
          }
        }
      }, 1000))
    } else if (searchKey == "") {
      setShowSearch(false)
    }
  }
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrollingDown(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const springProps = useSpring({
    paddingTop: isScrollingDown ? "20px" : "40px",
    paddingBottom: isScrollingDown ? "20px" : "40px",
    backgroundColor: isScrollingDown ? "#ffff" : "#ffff",
    borderRadius: isScrollingDown ? "10px" : "10px",
    // borderBottom: isScrollingDown ? "2px solid  " : "1px solid ",
  });
  const handleMouseEnter = (cate) => {
    setCategory(cate)
  }
  const handleMouseLeave = () => {
    setCategory(null)
  }
  return (
    <div className="nav_box">
      <div className="nav_top">
        <div className="left">
          <a>{t('navbar.categoryMall')}</a>
          <a>{t('navbar.GetApp')}</a>
          <a>{t('navbar.connect')} </a><i className="fa-brands fa-facebook"></i><i className="fa-brands fa-youtube"></i>
        </div>
        <div className="right">
          <div>
            <i className="fa-solid fa-comments-dollar"></i>
            <p>{t('navbar.help')}</p>
          </div>
          <div>
            <i className="fa-solid fa-language"></i>
            <MultiLanguage />
          </div>
        </div>
      </div>
      <div className="navbar_container">
        <animated.div className="navbar_container_child" style={springProps}>
          <div className="logo">
            <img src="../../../public/img/logoRaoVat.jpg" alt="" onClick={() => {
              window.location.href = "/"
            }} />
            <div className="category">
              <ion-icon name="apps-outline"></ion-icon>
              <p>{t('navbar.category')}</p>
              <ion-icon name="chevron-down-outline"></ion-icon>
              {
                categoryStore.category && (
                  <div className='sup_menu'
                    onMouseLeave={handleMouseLeave}>

                    {
                      categoryStore.category.map(supItem => {


                        return (
                          <div onClick={() => {
                            navigate(`/search?category=${supItem.codeName}`)
                          }}
                            key={Date.now() * Math.random()}
                            className='sup_menu_item'
                            onMouseEnter={() => { handleMouseEnter(supItem) }}

                          >
                            <img src={String(supItem.avatar)}></img>
                            <span>{supItem.name}</span>

                          </div>
                        )
                      })}
                    {category && <div className="child_box">
                      {
                        category && category.branches?.map(branch => {
                          return (
                            <div onClick={() => {
                              navigate(`/search?category=${category.codeName}&&branch=${branch.codeName}`)
                            }}
                              key={Date.now() * Math.random()}
                              className='sup_menu_item_child'>
                              <span>{branch.name}</span>
                            </div>
                          )
                        })
                      }
                    </div>}
                  </div>
                )
              }

            </div>
          </div>

          <div className="search">
            <i className="fa-solid fa-magnifying-glass" onClick={() => {
              if (keyword) {
                window.location.href = `/search?keyword=${keyword}`
              }
            }}></i>
            <input type="text" placeholder={t('navbar.placeHolderSearch')} onChange={(e) => handleShowSearch(e.target.value)} />
            {showSearch ?
              <div className="search_content_container">
                <p className="result-search-title">Kết quả tìm kiếm tương ứng </p>
                <div className="result-search-content">
                  <div className="result-search-item">
                    {
                      searchContent.length > 0 ? searchContent?.map(item => {
                        return (<span
                          onClick={() => {
                            window.location.href = `product-info?productId=${item.id}`
                          }}
                        >{item.name}</span>)
                      }) : (<span>{`Không tìm thấy kết quả nào! `} <i className="fa-regular fa-face-sad-tear"></i></span>)

                    }

                  </div>
                </div>
              </div> : <></>}
          </div>

          <div className="login_logo">
            <div className="wallet_box">
              <span>{convertToVND(userStore.data?.wallet ? userStore.data?.wallet : 0)} <ion-icon name="cash-outline"></ion-icon></span>
              <button
                onClick={() => {
                  if (!userStore.data) {
                    Modal.warning({
                      title: "Warning",
                      content: "Vui lòng đăng nhập!",
                      onOk: () => {
                        openModal()
                      }
                    })
                    return
                  }
                  setShowTopUpForm(!showTopUpForm)
                }}
                className="top_up">
                {t('navbar.topup')}
              </button>
            </div>
            {
              !userStore.data ?
                <button className="cta" onClick={() => openModal()}>
                  <span className="hover-underline-animation"> {t('navbar.login')} </span>
                  <svg
                    id="arrow-horizontal"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="10"
                    viewBox="0 0 46 16"
                  >
                    <path
                      id="Path_10"
                      data-name="Path 10"
                      d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                      transform="translate(30)"
                    ></path>
                  </svg>
                </button> : <>
                  <div className='cart_box'
                    >
                    <i onClick={() => {
                      navigate("/cart")
                    }} className="fa-brands fa-shopify"></i>
                    <span className="sum">
                      ({
                        receiptStore.cart?.detail?.length || 0
                      })
                    </span>
                    {
                      true && (
                        <div className='sup_menu'
                          onMouseLeave={handleMouseLeave}>

                          {
                           receiptStore.cart ? receiptStore.cart?.detail?.map(supItem => {


                              return (
                                <div 
                                  key={Date.now() * Math.random()}
                                  className='sup_menu_item'
                                  onMouseEnter={() => { handleMouseEnter(supItem) }}

                                >
                                  <img src={`${import.meta.env.VITE_SV_HOST}/${supItem.products.avatar}`}></img>
                                  <span
                                  onClick={() => {
                                    window.location.href=`/product-info?productId=${supItem.productId}`
                                  }}
                                  >{supItem.products.name}</span>
                                  <i 
                                    onClick={()=>{
                                      Modal.confirm({
                                        title: "Confirm",
                                        content: "Bạn có chắc muốn xóa tin này?",
                                        onOk: async () => {
                                            let result = await api.receipt.delete(supItem.id);
                                            dispatch(receiptAction.deleteItem(supItem.id));
                                        }
                                    })
                                    }}
                                  
                                  className="fa-solid fa-calendar-xmark"></i>
                                </div>
                              )
                            }) : <img style={{width:"100%",height:"150px"}} src="https://elements-cover-images-0.imgix.net/05a48f9e-c24f-40f2-bbf6-6dde8c2f77d0?auto=compress%2Cformat&w=900&fit=max&s=98115fe5c0ab12c459343cc3c758d5e5"></img>
                          }
                        </div>
                      )
                    }
                  </div>
                  <div className="user_box">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <div className='user_box'>
                          <span>{t('navbar.hi')} {isNaN(Number(userStore.data?.userName)) ? userStore.data?.userName : userStore.data?.email?.split('@')[0]}!</span>
                          <img src={userStore.data?.avatar.includes('/img/') ? `${import.meta.env.VITE_SV_HOST}/${userStore.data?.avatar}` : `${userStore.data?.avatar}`} />


                        </div>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {
                          window.location.href = "/wallet"
                        }}>{t('navbar.wallet')}</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                          window.location.href = `/user_page/${userStore.data?.id}`
                        }}>Tin của bạn</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                          Modal.confirm({
                            title: "Xác nhận",
                            content: "Bạn chắc chắn muốn đăng xuất!",
                            onOk: async () => {
                              await logout()
                              localStorage.removeItem("token")
                              dispatch(userAction.setData(null))
                            }
                          })
                        }}>{t('navbar.logout')}</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </>
            }
          </div>
          <button className="button_up" onClick={() => {
            if (userStore.data) { navigate("/post") } else {
              message.warning('Bạn chưa đăng nhập!');
              openModal()
            };
          }}><i className="fa-solid fa-pen-to-square" ></i> {t('navbar.post')}</button>
        </animated.div>
        <div className="navbar_mobile_child"></div>
        <div className="navbar_mobile">
          <div className="logo_mobile">
            <img src="https://vanphongxanh.vn/wp-content/uploads/2022/03/logo-social.png" alt="" />
          </div>
          <div className="icon_bar">
            <i onClick={() => setShowNavbar(!showNavbar)} className="fa-solid fa-bars"></i>
          </div>
        </div>
        {showNavbar ? <div className="navbar_mobile_content">
          <p onClick={() => { navigate("/"); setShowNavbar(!showNavbar); setShowNavbar(!showNavbar) }}>
            {t('sidebar.home')}</p>
          <ModalSearch />
          <p onClick={() => { navigate("/course/1"); setShowNavbar(!showNavbar); setShowNavbar(!showNavbar) }}>
            {t('sidebar.courses')}</p>
          <p onClick={() => { navigate("/login"); setShowNavbar(!showNavbar); setShowNavbar(!showNavbar) }}>
            {t('navbar.login')}</p>
        </div> : <></>}
        {showTopUpForm && <TopUpForm setShowTopUpForm={setShowTopUpForm} />}
      </div>
    </div>
  )
}
