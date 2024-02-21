import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { Modal } from 'antd'
import { randomId, convertToVND } from '@mieuteacher/meomeojs';
import { useSelector, useDispatch } from 'react-redux';
import { Store } from '@/store';
import { productAction } from '@/store/slices/product.slice';
import { api } from '@/service/apis';
// import ProductCreateForm from './components/ProductCreateForm';
import DescribeShow from './components/DescribeShow';
import Detail from './components/Detail';
import './list.scss'
import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
// import DetailShow from './components/DetailShow';
// import ProductEdit from './components/ProductEdit';
// import { productAction } from '@slices/product.slice';
export default function List() {
    const dispatch = useDispatch()
    const productStore = useSelector((store: Store) => store.productStore)
    useEffect(() => {
        // if (!localStorage.getItem("token")) return
        const fetchData = async () => {
            try {
                const res = await api.product.getProductReviewing();
                if (res.status == 200) {
                    dispatch(productAction.setData(Object.values(res.data.data)));
                    console.log('res.data.data', res.data.data);

                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [])
    const [showDes, setShowDes] = useState(false);
    const [updateData, setupdateData] = useState({});
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [detail, setDetail] = useState(null)
    return (
        <>
            {/* {
                productStore.addModal && <ProductCreateForm dispatch={dispatch} />
            } */}
            {
                showDes && <DescribeShow showDes={showDes} setShowDes={setShowDes} updateData={updateData} setupdateData={setupdateData} />
            }
            {
                showInfo &&
                <div className='product_info_container' >
                    <div className='product_info_background' onClick={() => { setShowInfo(!showInfo) }}></div>
                    <div className='product_info_content'>
                        <h5>Thông tin chi tiết:</h5>
                        {
                            <MDBTable striped>
                                <MDBTableBody>
                                    {detail.name &&
                                        <tr>
                                            <th scope='row'>Name</th>
                                            <td>{detail.name}</td>
                                        </tr>}
                                    {detail.type &&
                                        <tr>
                                            <th scope='row'>Type</th>
                                            <td>{detail.type}</td>
                                        </tr>}
                                    {detail.used &&
                                        <tr>
                                            <th scope='row'>Status</th>
                                            <td>{detail.used}</td>
                                        </tr>}
                                    {detail.color &&
                                        <tr>
                                            <th scope='row'>Color</th>
                                            <td>{detail.color}</td>
                                        </tr>}
                                    {detail.ram &&
                                        <tr>
                                            <th scope='row'>RAM</th>
                                            <td>{detail.ram}</td>
                                        </tr>}
                                    {detail.guarantee &&
                                        <tr>
                                            <th scope='row'>Warranty</th>
                                            <td>{detail.guarantee}</td>
                                        </tr>}
                                    {detail.RegisteredAt &&
                                        <tr>
                                            <th scope='row'>Registered At</th>
                                            <td>{detail.RegisteredAt}</td>
                                        </tr>}

                                    {detail.branch &&
                                        <tr>
                                            <th scope='row'>Branch</th>
                                            <td>{detail.branch}</td>
                                        </tr>}
                                    {detail.cc &&
                                        <tr>
                                            <th scope='row'>Cylinder capacity</th>
                                            <td>{detail.cc}</td>
                                        </tr>}
                                    {detail.motoId &&
                                        <tr>
                                            <th scope='row'>License plates</th>
                                            <td>{detail.motoId}</td>
                                        </tr>}
                                    {detail.km &&
                                        <tr>
                                            <th scope='row'>Number of kilometers run</th>
                                            <td>{detail.km}</td>
                                        </tr>}
                                    {detail.from &&
                                        <tr>
                                            <th scope='row'>Comes from</th>
                                            <td>{detail.from}</td>
                                        </tr>}
                                    {detail.areaName &&
                                        <tr>
                                            <th scope='row'>Area Name</th>
                                            <td>{detail.areaName}</td>
                                        </tr>}
                                    {detail.landNum &&
                                        <tr>
                                            <th scope='row'>Land Number</th>
                                            <td>{detail.landNum}</td>
                                        </tr>}
                                    {detail.direction &&
                                        <tr>
                                            <th scope='row'>Direction</th>
                                            <td>{detail.direction}</td>
                                        </tr>}
                                    {detail.direction &&
                                        <tr>
                                            <th scope='row'>Direction</th>
                                            <td>{detail.direction}</td>
                                        </tr>}
                                    {detail.floor &&
                                        <tr>
                                            <th scope='row'>Floor</th>
                                            <td>{detail.floor}</td>
                                        </tr>}
                                    {detail.bedRoom &&
                                        <tr>
                                            <th scope='row'>BedRoom</th>
                                            <td>{detail.bedRoom}</td>
                                        </tr>}
                                    {detail.badRoom &&
                                        <tr>
                                            <th scope='row'>BadRoom</th>
                                            <td>{detail.badRoom}</td>
                                        </tr>}
                                    {detail.papers &&
                                        <tr>
                                            <th scope='row'>Legal documents</th>
                                            <td>{detail.papers}</td>
                                        </tr>}
                                    {detail.decoration &&
                                        <tr>
                                            <th scope='row'>Decoration Status</th>
                                            <td>{detail.decoration}</td>
                                        </tr>}
                                    {detail.moreInfo &&
                                        <tr>
                                            <th scope='row'>More Infomation</th>
                                            <td>{detail.moreInfo}</td>
                                        </tr>}
                                    {detail.area &&
                                        <tr>
                                            <th scope='row'>Acreage</th>
                                            <td>{detail.area} {detail.unit ? detail.unit : `(m²)`}</td>
                                        </tr>}
                                    {detail.useArea &&
                                        <tr>
                                            <th scope='row'>Used Acreage</th>
                                            <td>{detail.useArea} (m²)</td>
                                        </tr>}
                                    {detail.xSide &&
                                        <tr>
                                            <th scope='row'>Horizontal Length</th>
                                            <td>{detail.xSide} (m²)</td>
                                        </tr>}
                                    {detail.ySide &&
                                        <tr>
                                            <th scope='row'>Vertical Length</th>
                                            <td>{detail.ySide} (m²)</td>
                                        </tr>}


                                </MDBTableBody>
                            </MDBTable>
                        }

                    </div>
                </div>
            }
            {/* {
                showDetail && <DetailShow showDetail={showDetail} setShowDetail={setShowDetail} updateData={updateData} setupdateData={setupdateData} />
            }
            {
                showEdit && <ProductEdit showEdit={showEdit} setShowEdit={setShowEdit} updateData={updateData} setupdateData={setupdateData} />
            } */}
            <h4>Product List</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        {/* <th>Category</th>
                        <th>Brand</th> */}
                        <th>Price</th>
                        <th>Des</th>
                        <th>Detail</th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        productStore.product?.map((product, index) => {
                            if (product.status == "inactive" && product.moderationStatus == "inactive") {
                                return (
                                    <tr key={randomId()}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img src={`${import.meta.env.VITE_SV_HOST}/${product.avatar}`} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                                        </td>
                                        <td >{product.name}</td>
                                        <td>{convertToVND(product.price)}</td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    setShowDes(!showDes);
                                                    setupdateData({ id: product.id, des: JSON.parse(product.detail).desc })
                                                }}
                                                className='btn btn-primary'>More</button>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    // setShowDetail(!showDetail);
                                                    // setupdateData({ id: product.id, category: product.category.title, detail: JSON.parse(product.detail) })
                                                    setShowInfo(!showInfo);
                                                    setDetail(JSON.parse(product.detail))
                                                }}
                                                className='btn btn-primary'>More</button>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    // setShowEdit(!showEdit);
                                                    // setupdateData({ product })
                                                    Modal.confirm({
                                                        title: "Success",
                                                        content: `Are you sure you want to agree this product?`,
                                                        onOk: async () => {
                                                            try {
                                                                let result = await api.product.update(product.id, { moderationStatus: 'active', status:"active" })
                                                                if (result.status == 200) {
                                                                    dispatch(productAction.update(result.data.data))
                                                                }
                                                            } catch (err) {
                                                                console.log('err', err);
                                                            }
                                                        },
                                                        onCancel: () => { }

                                                    })
                                                }}
                                                className='btn btn-success' style={{ marginRight: 5 }}>
                                                Agree</button>
                                                <button
                                                onClick={() => {
                                                    // setShowEdit(!showEdit);
                                                    // setupdateData({ product })
                                                    Modal.confirm({
                                                        title: "Success",
                                                        content: `Are you sure you want to agree and push this product?`,
                                                        onOk: async () => {
                                                            try {
                                                                let result = await api.product.update(product.id, { moderationStatus: 'active', status:"active",priorityStatus:"active" })
                                                                if (result.status == 200) {
                                                                    dispatch(productAction.update(result.data.data))
                                                                }
                                                            } catch (err) {
                                                                console.log('err', err);
                                                            }
                                                        },
                                                        onCancel: () => { }

                                                    })
                                                }}
                                                className='btn btn-success' style={{ marginRight: 5 }}>
                                                Priority</button>
                                            {
                                                <button
                                                    onClick={() => {
                                                        Modal.confirm({
                                                            title: "Warning",
                                                            content: `Are you sure you want to block this product?`,
                                                            onOk: async () => {
                                                                try {
                                                                    let result = await api.product.update(product.id, { status: 'delete' })
                                                                    if (result.status == 200) {
                                                                        dispatch(productAction.update(result.data.data))
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
                                            }
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