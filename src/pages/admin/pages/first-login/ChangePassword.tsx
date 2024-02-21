
import { Modal } from 'antd';
import BtnLoading from '@/components/BtnLoading';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Store } from '@/store';
import './changePassword.scss'
import { api } from '@/service/apis';

export default function firstLogin() {
    const memberStore = useSelector((store: Store) => {
        return store.memberStore;
    });
    const [loadFirst, setLoadFirst] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div className="container">
            <div className="screen">
                <div className="screen__content">
                    <form onSubmit={async (e: React.FormEvent) => {
                        e.preventDefault();
                        try {
                            const newPassword = (e.target as any).newPassword.value;

                            if (newPassword != confirmPassword) {
                                Modal.warning({
                                    title: "Thông báo",
                                    content: "Mật khẩu không trùng khớp!"
                                });
                                return;
                            }
                            let res = await api.member.changePassword(memberStore.data?.id, {password:newPassword});
                            setLoadFirst(false);
                            localStorage.setItem("token", res.data.token);
                            Modal.success({
                                title: "Thông báo",
                                content: "Thay đổi mật khẩu thành công",
                                onOk: () => {
                                    window.location.reload();
                                },
                                onCancel: () => {
                                    window.location.reload();
                                }
                            });
                        } catch (err: any) {
                            setLoadFirst(false);
                            Modal.warning({
                                title: "Thông báo",
                                content: err?.response?.data?.message || "Lỗi không rõ!"
                            });
                        }
                    }} className="change_password">
                        <h2>Change Password</h2>
                        <div className='sub-content'>*Lần đầu tiên truy cập, vui lòng thay đổi mật khẩu.</div>
                        <div className="password">
                            <input
                                type="password"
                                className="password__input"
                                placeholder="New Password"
                                name='newPassword'
                            />
                        </div>
                        <div className="confirm_password">
                            <input
                                type="password"
                                className="password__input"
                                placeholder="Confirm New Password"
                                name='confirmPassword'
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button type='submit' className="submit">
                            <span className="button__text">CONTINUE</span>
                            {loadFirst && <BtnLoading></BtnLoading>}
                        </button>
                    </form>
                    <h3>ERM LMS</h3>
                </div>
                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4" />
                    <span className="screen__background__shape screen__background__shape3" />
                    <span className="screen__background__shape screen__background__shape2" />
                    <span className="screen__background__shape screen__background__shape1" />
                </div>
            </div>
        </div>
    )
}
