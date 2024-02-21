import React, { useState } from 'react'
import { Table } from 'react-bootstrap';
import { Modal } from 'antd'
import api from '@services/apis'
import { randomId, convertToVND } from '@mieuteacher/meomeojs';
import { useSelector, useDispatch } from 'react-redux';
import CategoryCreateForm from './components/CategoryCreateForm';
import { categoryAction } from '@slices/category.slice';
export default function List() {
    const dispatch = useDispatch()
    const categoryStore = useSelector(store => store.categoryStore);
    return (
        <>
            {
                categoryStore.addModal && <CategoryCreateForm dispatch={dispatch} />
            }
            <h4>Category List</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categoryStore.data?.map((item, index) => {
                            if (item.status) {
                                return (
                                    <tr key={randomId()}>
                                        <td>{index + 1}</td>
                                        <td >{item.title}</td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    Modal.confirm({
                                                        title: "Warning",
                                                        content: `Are you sure you want to block this category?`,
                                                        onOk: async () => {
                                                            try {
                                                                let result = await api.category.update(item.id, { status: false })
                                                                if (result.status == 200) {
                                                                    dispatch(categoryAction.update(result.data.data))
                                                                }
                                                            } catch (err) {
                                                                console.log('err', err);
                                                            }
                                                        },
                                                        onCancel: () => { }

                                                    })
                                                }}
                                                className="btn btn-danger"
                                            >Block</button>
                                        </td>
                                    </tr>
                                )
                            }
                        })
                    }
                </tbody>
            </Table >
        </>
    )
}