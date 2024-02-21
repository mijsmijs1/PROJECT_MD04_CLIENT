import React from 'react'
import { InputGroup, Form } from 'react-bootstrap';
import { productAction } from '../../../../../store/slices/product.slice';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'antd';
export default function DescribeShow({ showDes, setShowDes, updateData, setUpdateData }) {
    const dispatch = useDispatch();
    // const handleSaveDes = async (e) => {
    //     e.preventDefault();
    //     try {
    //         let description = e.target.des.value;
    //         if (description == '' || null) {
    //             description = "Đang cập nhật";
    //             e.target.des.value = "Đang cập nhật"
    //             setUpdateData({ ...updateData, des: "Đang cập nhật" })
    //         }
    //         console.log(description);
    //         let result = await api.product.updateDes(updateData.id, { des: description })
    //         console.log('result',result);
    //         if (result.status == 200) {
    //             Modal.success({
    //                 title: 'Success!',
    //                 content: "Cập nhật thành công!",
    //                 onOk: () => {
    //                     dispatch(productAction.update(result.data.data))
    //                     setShowDes(!showDes)
    //                 }
    //             })

    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    return (
        <div className='product_describe_form'>
            <form onSubmit={(e) => {
                // handleSaveDes(e)
            }}>
                <div className='btn_box'>
                    <span>Product Description</span>
                    <button onClick={() => {
                        setShowDes(!showDes)
                    }} type='button' className='btn btn-danger'>X</button>
                </div>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Description</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        placeholder="Describe"
                        name='des'
                        defaultValue={updateData.des}
                        readOnly
                    />
                </InputGroup>
                <button type='submit' className='btn btn-success' style={{display:"none"}}>Save</button>
            </form>
        </div>
    )
}
