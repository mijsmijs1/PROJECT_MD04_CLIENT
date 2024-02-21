import React from 'react'
import { Outlet } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Dropdown } from 'react-bootstrap';
import { member, memberAction } from '@/store/slices/member.slice';
import { Modal } from 'antd';
import { Socket } from 'socket.io-client';
import './container.scss'
import { userAction } from '@/store/slices/user.slice';
import { productAction } from '@/store/slices/product.slice';
export default function Container({ menuState, setMenuState, data, socket, setSocket }: {
    menuState: boolean,
    setMenuState: any,
    data: member,
    socket: Socket | null,
    setSocket: any
}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const menus = [
        {
            title: 'User',
            child: [
                {
                    title: "Add",
                    link: null,
                    fn: () => {
                        dispatch(userAction.loadModal())
                    }
                },
                {
                    title: "List",
                    link: "user/list",
                    fn: null
                },
                {
                    title: "Recycle",
                    link: "user/recycle",
                    fn: null
                }
            ]
        },
        {
            title: 'Product',
            child: [
                // {
                //     title: "Add",
                //     link: null,
                //     fn: () => {
                //         dispatch(productAction.loadModal())
                //     }
                // },
                {
                    title: "List",
                    link: "product/list",
                    fn: null
                },
                {
                    title: "Recycle",
                    link: "product/recycle",
                    fn: null
                }
            ]
        },
        {
            title: 'Categories',
            child: [
                {
                    title: "Add",
                    link: null,
                    fn: () => {
                        // dispatch(categoryAction.loadModal())
                    }
                },
                {
                    title: "List",
                    link: "category/list",
                    fn: null
                },
                {
                    title: "Recycle",
                    link: "category/recycle",
                    fn: null
                }
            ]
        },
        ,
        {
            title: 'Brands',
            child: [
                {
                    title: "Add",
                    link: null,
                    fn: () => {
                        // dispatch(brandAction.loadModal())
                    }
                },
                {
                    title: "List",
                    link: "brand/list",
                    fn: null
                },
                {
                    title: "Recycle",
                    link: "brand/recycle",
                    fn: null
                }
            ]
        }
    ]
    return (
        <div className='admin_container'>
            <div className={`${menuState && "hidden"} menu_bar`}>
                <div className='user'>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">

                            <img src={data.avatar} />
                            <span>hi {data.firstName} {data.lastName} <i className="fa-solid fa-chevron-down"></i></span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => {
                                window.location.href = "/"
                            }}>Home Page</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                Modal.confirm({
                                    title: "Logout",
                                    content: "Ok?",
                                    onOk: () => {
                                        window.localStorage.removeItem("token")
                                        dispatch(memberAction.setData(null))
                                        socket?.close();
                                        setSocket(null);
                                        window.location.href = "/"
                                    }
                                })
                            }}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {
                    menus.map(item => (
                        <div key={Date.now() * Math.random()} className='menu_item'>
                            <button onClick={(e) => {
                                let targetEl = (e.target as any).parentNode.querySelector('.menu_item_sub');
                                if (targetEl.classList.length > 1) {
                                    targetEl.classList.remove("hidden")
                                } else {
                                    targetEl.classList.add("hidden")
                                }
                            }} className='my-button'>
                                <ion-icon name="grid-outline"></ion-icon> {item.title}
                            </button>
                            <ul className='menu_item_sub'>
                                {
                                    item.child?.map(supItem => (<li onClick={() => {
                                        if (supItem.fn) {
                                            supItem.fn()
                                        } else {
                                            navigate(supItem.link)
                                        }
                                    }} key={Date.now() * Math.random()}><i className="fa-regular fa-star"></i> {supItem.title}</li>))
                                }
                            </ul>
                        </div>
                    ))
                }
            </div>
            <div className='content'>
                <div className='history'>
                    <span>Home</span>
                    <span>Admin</span>
                    <span>Product</span>
                </div>
                <div className='content_body'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
