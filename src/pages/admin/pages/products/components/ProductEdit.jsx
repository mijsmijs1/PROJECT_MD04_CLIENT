import { randomId } from '@mieuteacher/meomeojs';
import React, { useState, useRef, useEffect } from 'react'
import { InputGroup, Form } from 'react-bootstrap';
import { productAction } from '../../../../../store/slices/product.slice';
import { uploadToFirebase } from '@services/firebase'
import api from '@services/apis'
import { Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
export default function ProductEdit({ showEdit, setShowEdit, updateData, setupdateData }) {
    const dispatch = useDispatch();
    const [picturesPreview, setPicturesPreview] = useState([]);
    const categoryStore = useSelector(store => store.categoryStore)
    const brandStore = useSelector(store => store.brandStore)
    console.log('updateData.product', updateData.product);
    const fileInputRef = useRef(null);
    useEffect(() => {
        setPicturesPreview(updateData.product.pictures)
    }, []);
    console.log('picturesPreview', picturesPreview);
    async function handleEditProduct(e) {
        e.preventDefault();
        let avatar = null;
        if (!e.target.avatar.files[0]) {
            avatar = updateData.product.avatar;
        } else {
            avatar = await uploadToFirebase(e.target.avatar.files[0])
        }
        console.log('avatar', avatar);
        try {
            let updatedProduct = {
                name: e.target.name.value,
                price: Number(e.target.price.value),
                avatar,
                categoryId: Number(e.target.categoryId.value),
                des: e.target.des.value,
                brandId: Number(e.target.brandId.value),
            }
            let pictures = [];

            for (let i in picturesPreview) {
                if (picturesPreview[i].file) {
                    let url = await uploadToFirebase(picturesPreview[i].file)
                    pictures.push({
                        url
                    })
                } else {
                    pictures.push({
                        url: picturesPreview[i].url
                    })
                }
            }
            await api.product.deletePic(updateData.product.id)
            let result = await api.product.update(updateData.product.id, {
                ...updatedProduct,
                pictures
            })
            console.log(result);
            if (result.status == 200) {
                Modal.success({
                    title: "Notication",
                    content: "Bạn đã chỉnh sửa sản phẩm thành công!",
                    onOk: () => {
                        dispatch(productAction.update(result.data.data))
                        e.target.name.value = ""
                        e.target.price.value = ""
                        setPicturesPreview([])
                        e.target.avatar.value = null
                        e.target.categoryId.value = null
                        e.target.brandId.value = null
                        setShowEdit(!showEdit)
                    }
                })
            }
        } catch (err) {
            console.log("err", err)
            alert("1")
        }
    }
    return (
        <div className='product_create_form'>
            <form onSubmit={(e) => {
                handleEditProduct(e)
            }}>
                <div className='btn_box'>
                    <span>Edit Product</span>
                    <button onClick={() => {
                        setShowEdit(!showEdit)
                    }} type='button' className='btn btn-danger'>X</button>
                </div>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Name</InputGroup.Text>
                    <Form.Control
                        placeholder="Product Name"
                        name='name'
                        defaultValue={updateData.product.name}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Price</InputGroup.Text>
                    <Form.Control
                        placeholder="Product Price"
                        name='price'
                        defaultValue={updateData.product.price}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Avatar</InputGroup.Text>
                    <div className='input_avatar'>
                        <img src={updateData.product.avatar} />
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
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Describe</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        placeholder="Describe"
                        name='des'
                        defaultValue={updateData.product.des}
                    />
                </InputGroup>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Picture List</Form.Label>
                    <Form.Control onChange={(e) => {
                        console.log('da vao');
                        let tempArr = [];
                        if (e.target.files.length > 0) {
                            for (let i in e.target.files) {
                                if (i == "length") {
                                    break
                                }
                                tempArr.push({
                                    url: URL.createObjectURL(e.target.files[i]),
                                    file: e.target.files[i]
                                })
                            }
                        }
                        if (picturesPreview.length + tempArr.length > 10) {
                            alert("max size 10")
                            return
                        }
                        setPicturesPreview([...tempArr, ...picturesPreview])
                        console.log('picturesPreview2222', picturesPreview);
                    }} type="file" multiple max={10} ref={fileInputRef} />
                </Form.Group>
                <div className='pictures'>
                    {
                        picturesPreview.map((item, index) => (
                            <div key={randomId()} className='item'>
                                <img src={item.url} />
                                <button type='button' onClick={() => {
                                    setPicturesPreview(picturesPreview?.filter((itemFilter, indexFilter) => indexFilter != index))
                                }} className='btn btn-danger'>X</button>
                            </div>
                        ))
                    }
                </div>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Category</InputGroup.Text>
                    <Form.Select name='categoryId' aria-label="Default select example">
                        <option value={updateData.product.category.id}>{updateData.product.category.title}</option>
                        {
                            categoryStore?.data?.map(item => (
                                <option key={randomId()} value={item.id}>{item.title}</option>
                            ))
                        }
                    </Form.Select>
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Brand</InputGroup.Text>
                    <Form.Select name='brandId' aria-label="Default select example">
                        <option value={updateData.product.brand.id}>{updateData.product.brand.title}</option>
                        {
                            brandStore?.data?.map(item => (
                                <option key={randomId()} value={item.id}>{item.title}</option>
                            ))
                        }
                    </Form.Select>
                </InputGroup>
                <button type='submit' className='btn btn-success'>save</button>
            </form>
        </div>
    )
}