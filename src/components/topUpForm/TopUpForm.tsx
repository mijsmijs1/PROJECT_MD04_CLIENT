import React, { createContext, useEffect, useState } from "react"
import "./topUpForm.scss"
import { Modal, QRCode, message } from "antd"
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "@/store";
import { Socket, io } from "socket.io-client";
import { userAction } from "@/store/slices/user.slice";
import { api } from "@/service/apis";

export default function TopUpForm({ setShowTopUpForm }: { setShowTopUpForm: any }) {
    const SocketContext = createContext<null | Socket>(null);
    const dispatch = useDispatch()
    const userStore = useSelector((store: Store) => store.userStore)
    const transferContent = userStore.data.userName;
    const BankAccountNumber = "103881110994";
    const account = "NGUY PHU QUY";
    const bankLocation = "VietinBank CN TAN BINH - PGD HOC MON"
    const [displayMethod, setDisplayMethod] = useState<string>("banking")
    const handleCopy = (content: string) => {
        message.open({
            type: "success",
            content: `Coppy thành công nội dung: ${content} !`,
            duration: 3,
        })
    }
    const [socket, setSocket] = useState<Socket | null>(null)
    const [displayAmount, setDisplayAmount] = useState(false)
    const [amount, setAmount] = useState(0)
    useEffect(() => {
        setSocket(io(`${import.meta.env.VITE_SOCKET_LOGIN_URL}`, {
            reconnectionDelayMax: 10000,
            auth: {
                token: String(localStorage.getItem("token"))
            }
        }))
    }, [])

    const [qrData, setQrData] = useState(null)

    async function zalo() {
        try {
            let result = await api.wallet.payZalo({
                receiptId: String(Math.floor(Date.now() * Math.random())),
                userName: userStore.data.userName,
                total: amount
            })
            console.log(result);
            
            setQrData(result.data)
            let zaloPayTimeout = null;
            let zaloPayInterVal = setInterval(async () => {
                let resultCheck = await api.wallet.zaloCheck(result.data.orderId,userStore.data.userName);
                console.log(resultCheck);
                if (resultCheck.data.status) {
                    clearInterval(zaloPayInterVal)
                    clearTimeout(zaloPayTimeout)
                    setQrData(null)
                    localStorage.setItem('token',resultCheck.data.token)
                    Modal.success({
                        title:"Nạp tiền thành công!",
                        content:`Bạn đã nạp ${resultCheck.data.amount} thành công vào tài khoản!`,
                        onOk:()=>{
                            window.location.href="/"
                        }
                    })
                }
            }, 500)

            zaloPayTimeout = setTimeout(() => {
                setQrData(null)
                clearInterval(zaloPayInterVal)
            }, 2 * 60 * 1000)
        } catch (err) {
            return false
        }
    }
    useEffect(() => {
        socket?.on("state", (res) => {
            if (!res.data) {
                if (res.invalidToken) {
                    localStorage.removeItem("token")
                    window.location.href = "/"
                }
                Modal.error({
                    title: "Thông báo",
                    content: res.message
                })
            } else {
                dispatch(userAction.setData(res.data))
            }

        })

        socket?.on("topUp", (res) => {
            Modal.success({
                title: "Thông báo!",
                content: res.message,
                onOk: () => {
                    window.location.href = "/"
                }
            })
            dispatch(userAction.setData(res.data))
            localStorage.setItem('token', res.tokenCode)
        })
    }, [socket])
    return (
        <>
            <div className="top_up_shadow"></div>
            {displayAmount && <div className="amount">
                <form className="subscribe" onSubmit={(e)=>{
                    e.preventDefault();
                    setAmount(Number((e.target as any).amount.value))
                    setDisplayAmount(!displayAmount)
                    zalo()
                }}>
                    <p>SỐ TIỀN NẠP!</p>
                    <input placeholder="Nhập số tiền muốn nạp" className="subscribe-input" name="amount" type="number" />
                    <br />
                    <button className="submit-btn" type="submit">LẤY QR</button>
                </form>
            </div>}
            <div className="top_up_box">
                <div className="exit" onClick={() => {
                    setShowTopUpForm(false)
                }
                }>×</div>
                <h2 style={{ color: "#49CC90" }}>Nạp tiền vào tài khoản</h2>
                <span style={{ fontSize: "20px" }}>Vui lòng chọn phương thức thanh toán   </span>
                <select id="cars" onChange={(e) => {
                    if (e.target.value == "banking") {
                        setDisplayMethod("banking")
                    } else {
                        setDisplayMethod("zaloPay")
                        setDisplayAmount(true)
                    }
                }}>
                    <option value="banking">Banking</option>
                    <option value="zalopay">Zalo Pay</option>
                </select>
                {displayMethod == "banking" && <div className="QR_bank">
                    <h4><ion-icon name="qr-code-outline"></ion-icon>Chuyển khoản bằng QR Banking</h4>
                    <div className="QR_content">
                        <div className="QR_code">
                            <img src={`${import.meta.env.VITE_SV_HOST}/QR_img/QR.jpg`}></img>
                            <QRCode
                                value={null}
                                icon="https://static.thenounproject.com/png/948565-200.png"
                            />
                        </div>
                        <div className="step">
                            <p>Bước 1: Mở app ngân hàng và quét mã QR.</p>
                            <p>Bước 2: Đảm bảo nội dung chuyển khoản là <span style={{ color: "rgb(255,99,47)" }}>"{transferContent}"</span>.</p>
                            Bước 3: Thực hiện thanh toán.
                        </div>
                    </div>
                    <div className="manual">
                        <h4>Chuyển khoản thủ công</h4>
                        <div className="manual_content">
                            <div className="right">
                                <div className="manual_info">
                                    <div className="top">
                                        <span>Số tài khoản</span>
                                    </div>
                                    <div className="bottom">
                                        <span>{BankAccountNumber}</span>
                                        <CopyToClipboard text={BankAccountNumber}>
                                            <img src="https://fullstack.edu.vn/static/media/clone.d2ecd3252b355d732cabb677ec33e5c6.svg" alt="Copy" onClick={() => { handleCopy(BankAccountNumber) }} />
                                        </CopyToClipboard>

                                    </div>
                                </div>
                                <div className="manual_info">
                                    <div className="top">
                                        <span>Tên tài khoản</span>
                                    </div>
                                    <div className="bottom">
                                        <span>{account}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="left">
                                <div className="manual_info">
                                    <div className="top">
                                        <span>Nội dung chuyển khoản</span>
                                    </div>
                                    <div className="bottom">
                                        <span style={{ color: "#FF7645", fontWeight: "600" }}>{transferContent}</span>
                                        <CopyToClipboard text={transferContent}>
                                            <img src="https://fullstack.edu.vn/static/media/clone.d2ecd3252b355d732cabb677ec33e5c6.svg" alt="Copy" onClick={() => { handleCopy(transferContent) }} />
                                        </CopyToClipboard>
                                    </div>
                                </div>
                                <div className="manual_info">
                                    <div className="top">
                                        <span>Chi nhánh</span>
                                    </div>
                                    <div className="bottom">
                                        <span>{bankLocation}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {displayMethod == "zaloPay" && <div className="QR_zaloPay">
                    <h4><img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"></img>Nạp tiền bằng<img className="zaloPay" src="https://seeklogo.com/images/Z/zalopay-logo-643ADC36A4-seeklogo.com.png"></img></h4>
                    <div className="QR_content">
                        <div className="QR_code">
                            {/* <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"></img> */}
                            {qrData ? <QRCode
                            style={{width:300, height: 300}}
                                value={qrData ? qrData?.qrCodeUrl : null}
                                icon="https://static.thenounproject.com/png/948565-200.png"
                            /> : <img src="https://www.drs.customs.gov.hk/img/qrexpired_en.png"/>}
                        </div>
                        <div className="step">
                            <p>Bước 1: Mở app Zalo Pay, chọn "Thanh toán" quét mã QR.</p>
                            <p>Bước 2: Đảm bảo nội dung chuyển khoản là <span>{transferContent}</span>.</p>
                            Bước 3: Xác nhận thanh toán trong ứng dụng Zalo Pay.
                        </div>
                    </div>
                    <div className="manual">
                        <h4>Chuyển khoản thủ công</h4>
                        <div className="manual_content">
                            <div className="right">
                                <div className="manual_info">
                                    <div className="top">
                                        <span>Số tài khoản</span>
                                    </div>
                                    <div className="bottom">
                                        <span>{BankAccountNumber}</span>
                                        <CopyToClipboard text={BankAccountNumber}>
                                            <img src="https://fullstack.edu.vn/static/media/clone.d2ecd3252b355d732cabb677ec33e5c6.svg" alt="Copy" onClick={() => { handleCopy(BankAccountNumber) }} />
                                        </CopyToClipboard>

                                    </div>
                                </div>
                                <div className="manual_info">
                                    <div className="top">
                                        <span>Tên tài khoản</span>
                                    </div>
                                    <div className="bottom">
                                        <span>{account}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="left">
                                <div className="manual_info">
                                    <div className="top">
                                        <span>Nội dung chuyển khoản</span>
                                    </div>
                                    <div className="bottom">
                                        <span style={{ color: "#FF7645", fontWeight: "600" }}>{transferContent}</span>
                                        <CopyToClipboard text={transferContent}>
                                            <img src="https://fullstack.edu.vn/static/media/clone.d2ecd3252b355d732cabb677ec33e5c6.svg" alt="Copy" onClick={() => { handleCopy(transferContent) }} />
                                        </CopyToClipboard>
                                    </div>
                                </div>
                                <div className="manual_info">
                                    <div className="top">
                                        <span>Chi nhánh</span>
                                    </div>
                                    <div className="bottom">
                                        <span>{bankLocation}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

                <div className="warning">
                    <h4>Lưu ý</h4>
                    <p>Tối đa 5 phút sau thời gian chuyển khoản, nếu hệ thống không phản hồi vui lòng liên hệ ngay bộ phận hỗ trợ của English Ringht Now.</p>
                    <div className="contact">
                        <div className="contact_info">
                            <ion-icon name="call-outline" />
                            <span>{import.meta.env.VITE_PHONE}</span>
                        </div>
                        <div className="contact_info">
                            <ion-icon name="mail-open-outline"></ion-icon>
                            <span>{import.meta.env.VITE_EMAIL}</span>
                        </div>
                        <div className="contact_info">
                            <ion-icon name="map-outline"></ion-icon>
                            <span>{import.meta.env.VITE_ADDRESS}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
