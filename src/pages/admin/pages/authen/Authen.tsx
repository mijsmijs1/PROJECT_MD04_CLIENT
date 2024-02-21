import React, { useState } from 'react'
import './authen.scss'
import { api } from '@/service/apis';
import { Modal } from 'antd';
import BtnLoading from '@/components/BtnLoading';

export default function Authen() {
    const [load, setLoad] = useState(false);
    return (
        <div className="container">
            <div className="screen">

                <form className="form" onSubmit={async (e: React.FormEvent) => {
                    e.preventDefault();
                    try {
                        let data = {
                            loginId: (e.target as any).loginId.value,
                            password: (e.target as any).password.value
                        }
                        setLoad(true)
                        let res = await api.member.login(data);
                        setLoad(false)
                        localStorage.setItem("tokenMember", res.data.token);
                        Modal.success({
                            title: "Thông báo",
                            content: "Thành công xác thực, di chuyển tới trang quản trị!",
                            onOk: () => {
                                window.location.href = "/admin"
                            }
                        })
                    } catch (err: any) {
                        setLoad(false)
                        Modal.warning({
                            title: "Thông báo",
                            content: err?.response?.data?.message || "Lỗi không rõ!"
                        })
                    }
                }}>
                    <p className="form-title">Log in to ADMIN page</p>
                    <div className="input-container">
                        <input type="text" placeholder="Enter email or login ID" id="loginId" />
                        <span>
                        </span>
                    </div>
                    <div className="input-container">
                        <input type="password" placeholder="Enter password" id="password" />
                    </div>
                    <button
                        type="submit"
                        className="submit"
                        style={{
                            position: 'relative'
                        }}>
                        Sign in
                        {load && <BtnLoading></BtnLoading>}
                    </button>
                </form>
            </div>
        </div>
    )
}
