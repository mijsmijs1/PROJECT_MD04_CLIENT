import { randomId } from '@mieuteacher/meomeojs';
import React, { useState } from 'react'
import { InputGroup, Form } from 'react-bootstrap';
import { userAction } from '@slices/user.slice';
import { uploadToFirebase } from '@services/firebase'
import api from '@services/apis'
import { Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
export default function UserEditForm({ showEdit, setShowEdit, updateData }) {
    const dispatch = useDispatch();
    console.log('updateData', updateData);
    const userStore = useSelector(store => store.userStore)
    async function handleEditUser(e) {
        e.preventDefault();
        try {
            let avatar = null;
            if (!e.target.avatar.files[0]) {
                avatar = updateData.avatar;
            } else {
                avatar = await uploadToFirebase(e.target.avatar.files[0])
            }
            let editUser = {}
            if (updateData.role == "admin" || updateData.role == "member") {
                editUser = {
                    userName: e.target.userName.value,
                    email: e.target.email.value,
                    avatar,
                    role: e.target.role.value,
                    status: Boolean(e.target.status.value),
                    emailConfirm: Boolean(e.target.emailConfirm.value)
                }
            } else {
                editUser = {
                    userName: e.target.userName.value,
                    email: e.target.email.value,
                    avatar,
                    role: "master"
                }
            }

            console.log(editUser);
            let result = await api.authen.update(updateData.id, {
                ...editUser
            })
            console.log('result', result);
            Modal.success({
                title: "Notication",
                content: "Bạn đã edit user thành công!",
                onOk: () => {
                    dispatch(userAction.update(result.data.data))
                    e.target.userName.value = ""
                    e.target.email.value = ""
                    e.target.status.value = null
                    e.target.role.value = null
                    e.target.avatar.value = null
                    e.target.emailConfirm.value = null
                    setShowEdit(!showEdit)
                }
            })
        } catch (err) {
            console.log("err", err)
            window.alert(`${err.response.data.message}`)
        }
    }
    return (
        <div className='user_edit_form'>
            <form onSubmit={(e) => {
                handleEditUser(e)
            }}>
                <div className='btn_box'>
                    <span>Edit User</span>
                    <button onClick={() => {
                        setShowEdit(!showEdit)
                    }} type='button' className='btn btn-danger'>X</button>
                </div>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">User Name</InputGroup.Text>
                    <Form.Control
                        placeholder="User Name"
                        name='userName'
                        defaultValue={updateData.userName}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Email</InputGroup.Text>
                    <Form.Control
                        placeholder="Email"
                        name='email'
                        defaultValue={updateData.email}
                    />
                </InputGroup>

                {
                    !(updateData.role == "master") && <InputGroup className="mb-3">
                        <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Role</InputGroup.Text>
                        <Form.Select name='role' aria-label="Default select example" >
                            <option value={updateData.role} defaultChecked>{updateData.role}  </option>
                            <option key={randomId()} value="admin">Admin</option>
                            <option key={randomId()} value="member">Member</option>
                        </Form.Select>
                    </InputGroup>
                }

                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Avatar</InputGroup.Text>
                    <div className='input_avatar'>
                        <img src={updateData.avatar} />
                        <input onChange={(e) => {
                            if (e.target.files.length > 0) {
                                let spanEl = e.target.parentNode.querySelector('span');
                                let imgEl = e.target.parentNode.querySelector('img');
                                spanEl.style.opacity = 0;
                                imgEl.src = URL.createObjectURL(e.target.files[0])
                            }
                        }} name='avatar' type="file" />
                        <span>+</span>
                    </div>
                </InputGroup>
                {
                    !(updateData.role == "master") && <InputGroup className="mb-3">
                        <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Status</InputGroup.Text>
                        <Form.Select name='status' aria-label="Default select example">
                            <option value={updateData.status}>{updateData.status ? "Active" : "Blocked"}</option>
                            <option key={randomId()} value={true}>Active</option>
                            <option key={randomId()} value={false}>Block</option>
                        </Form.Select>
                    </InputGroup>
                }
                {
                    !(updateData.role == "master") && <InputGroup className="mb-3">
                        <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Email Confirm</InputGroup.Text>
                        <Form.Select name='emailConfirm' aria-label="Default select example">
                            <option value={updateData.emailConfirm}>{updateData.emailConfirm ? "Active" : "Inactive"}</option>
                            <option key={randomId()} value={true}>Active</option>
                            <option key={randomId()} value={false}>Inactive</option>
                        </Form.Select>
                    </InputGroup>
                }
                <button type='submit' className='btn btn-success'>Save</button>
            </form>
        </div>
    )
}