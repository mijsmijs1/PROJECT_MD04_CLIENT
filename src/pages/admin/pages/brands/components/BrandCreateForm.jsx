import { randomId } from '@mieuteacher/meomeojs';
import React, { useState } from 'react'
import { InputGroup, Form } from 'react-bootstrap';
import { brandAction } from '@slices/brand.slice';
import { uploadToFirebase } from '@services/firebase'
import api from '@services/apis'
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
export default function BrandCreateForm({ dispatch }) {
  const brandStore = useSelector(store => store.brandStore)
  async function handleAddBrand(e) {
    e.preventDefault();
    try {
      let newCate = {
        title: e.target.name.value,
        codeName: e.target.codeName.value,
        status: Boolean(e.target.status.value)
      }
      console.log(newCate);
      let result = await api.brand.create({
        ...newCate
      })
      console.log('result', result);
      Modal.success({
        title: "Notication",
        content: "Bạn đã thêm brand thành công!",
        onOk: () => {
          dispatch(brandAction.addData(result.data.data))
          e.target.name.value = ""
          e.target.status.value = null
          dispatch(brandAction.loadModal())
        }
      })
    } catch (err) {
      console.log("err", err)
      alert("1")
    }
  }
  return (
    <div className='category_create_form'>
      <form onSubmit={(e) => {
        handleAddBrand(e)
      }}>
        <div className='btn_box'>
          <span>Create Brand</span>
          <button onClick={() => {
            dispatch(brandAction.loadModal())
          }} type='button' className='btn btn-danger'>X</button>
        </div>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Name</InputGroup.Text>
          <Form.Control
            placeholder="Brand Name"
            name='name'
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Code Name</InputGroup.Text>
          <Form.Control
            placeholder="Brand Code Name"
            name='codeName'
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Status</InputGroup.Text>
          <Form.Select name='status' aria-label="Default select example">
            <option value={null}>Please choose</option>
            <option key={randomId()} value={true}>Active</option>
            <option key={randomId()} value={false}>Block</option>
          </Form.Select>
        </InputGroup>
        <button type='submit' className='btn btn-success'>Add</button>
      </form>
    </div>
  )
}