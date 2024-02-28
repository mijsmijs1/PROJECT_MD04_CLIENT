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
    const [displayPic, setDisplayPic] = useState(false);
    const [displayVideo, setDisplayVideo] = useState(false);
    const [detail, setDetail] = useState(null)
    const activeProducts = productStore.product?.filter((item) => item?.status == "inactive" && item?.moderationStatus == "inactive");
    const priorityProducts = activeProducts?.filter((item) => item?.priorityStatus == "active");
    const normalProducts = activeProducts?.filter((item) => item?.priorityStatus == "inactive");

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [timer, setTimer] = useState(null);
    const [images, setImages] = useState([])
    const [video, setVideo] = useState(null)
    // const images = [
    //     'https://cdn.chotot.com/admincentre/1TJBfw07vIEUSPGyd90uAoMZJypUK4dVG1AQLK3XIak/preset:raw/plain/429d11f453939a67bda41fc67bfdab94-2863323975732322441.jpg',
    //     'https://cdn.chotot.com/admincentre/io-GtFL8wLcKnU7X6yMrfXk00RLrLoBJYUlut8shtyQ/preset:raw/plain/96bcfe1cc4669461c77550934d16ec3b-2840707957964015892.jpg',
    //     'https://cdn.chotot.com/admincentre/n7qtGDKACkBUcIBngZ8k6UTViVhsvmUdNsUnxzxGZGU/preset:raw/plain/535ac1ee75274be158be148cdae80735-2862504091815441220.jpg'
    // ];

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const goToPrevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleHover = () => {
        setIsHovered((prevState) => !prevState);
    };

    useEffect(() => {
        if (!isHovered) {
            setTimer(
                setInterval(() => {
                    goToNextSlide();
                }, 3000)
            );
        } else {
            clearInterval(timer);
        }

        return () => {
            clearInterval(timer);
        };
    }, [isHovered]);
    return (
        <>
            {/* {
                productStore.addModal && <ProductCreateForm dispatch={dispatch} />
            } */}
            {
                showDes && <DescribeShow showDes={showDes} setShowDes={setShowDes} updateData={updateData} setupdateData={setupdateData} />
            }
            {
                displayPic && <div className='product_describe_form'>
                    <div className='carousel_box'>
                        <button onClick={() => {
                            setDisplayPic(!displayPic)
                        }} type='button' className='btn btn-danger'>X</button>
                        <div className='carousel_app'>
                            <div
                                className="carousel"
                                style={{ width: '80%', height: '640px' }}
                                onMouseEnter={handleHover}
                                onMouseLeave={handleHover}
                            >
                                <img src={`${import.meta.env.VITE_SV_HOST}/${images[currentIndex]}`} alt="carousel slide" />

                                {isHovered && (
                                    <div className="navigation">
                                        <button type="button" className="btn " onClick={goToPrevSlide}><ion-icon name="chevron-back-outline"></ion-icon></button>
                                        <button type="button" className="btn " onClick={goToNextSlide}><ion-icon name="chevron-forward-outline"></ion-icon></button>
                                    </div>
                                )}

                                <div className="mydots">
                                    {images.map((image, index) => (
                                        <span
                                            key={index}
                                            className={index === currentIndex ? 'active' : ''}
                                            onClick={() => setCurrentIndex(index)}
                                        ></span>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            }
            {
                displayVideo && <div className='product_describe_form'>
                    <div className='carousel_box'>
                        <button onClick={() => {
                            setDisplayVideo(!displayVideo)
                        }} type='button' className='btn btn-danger close'>X</button>
                        <div className='carousel_app'>
                            
                            <video
                                id="videoPlayer"
                                height="90%"
                                width="100%"
                                controls autoPlay={false}
                            >
                                <source
                                    src={`${import.meta.env.VITE_SV_API_URL}/product/video/streaming/?code=${video}`}
                                    type="video/mp4"
                                />
                            </video>

                        </div>

                    </div>
                </div>
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
                        <th>Status</th>
                        <th>Des</th>
                        <th>Detail</th>
                        <th>Pic</th>
                        <th>Video</th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        priorityProducts?.map((product, index) => {
                            if (product.status == "inactive" && product.moderationStatus == "inactive") {
                                return (
                                    <tr key={randomId()}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img src={`${import.meta.env.VITE_SV_HOST}/${product.avatar}`} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                                        </td>
                                        <td >{product.name}</td>
                                        <td>{convertToVND(product.price)}</td>
                                        <td>{product.priorityStatus == "active" ? <span className='priority_logo_vip'>
                                            <i className="fa-regular fa-circle-up"></i>
                                            <span>ƯU TIÊN</span>
                                        </span> : <span>TIN THƯỜNG</span>}</td>

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
                                                className='btn btn-primary'
                                                onClick={() => {
                                                    setDisplayPic(true)
                                                    setImages(product.imgs?.map(item => item.imgUrl))
                                                }}
                                            >
                                                More
                                            </button>
                                        </td>
                                        <td>
                                            {product.videoUrl ? <button
                                                className='btn btn-primary'
                                                onClick={() => {
                                                    setDisplayVideo(true)
                                                    setVideo(product.videoUrl)
                                                }}
                                            >
                                                More
                                            </button> : <span>None</span>}
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
                                                                let result = await api.product.update(product.id, { moderationStatus: 'active', status: "active" })
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
                                                                let result = await api.product.update(product.id, { moderationStatus: 'active', status: "active", priorityStatus: "active" })
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
                                                                    if (product.priorityStatus == "active") {
                                                                        let data = await api.authen.getUserById(product.userId)
                                                                        api.authen.update(product.userId, { wallet: data.data.data?.wallet + 15000 })
                                                                    }

                                                                    let result = await api.product.update(product.id, { status: 'delete', priorityStatus: "inactive" })
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
                    {
                        normalProducts?.map((product, index) => {
                            if (product.status == "inactive" && product.moderationStatus == "inactive") {
                                return (
                                    <tr key={randomId()}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img src={`${import.meta.env.VITE_SV_HOST}/${product.avatar}`} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                                        </td>
                                        <td >{product.name}</td>
                                        <td>{convertToVND(product.price)}</td>
                                        <td>{product.priorityStatus == "active" ? <span className='priority_logo_vip'>
                                            <i className="fa-regular fa-circle-up"></i>
                                            <span>ƯU TIÊN</span>
                                        </span> : <span>TIN THƯỜNG</span>}</td>

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
                                                className='btn btn-primary'
                                                onClick={() => {
                                                    setDisplayPic(true)
                                                    setImages(product.imgs?.map(item => item.imgUrl))
                                                }}
                                            >
                                                More
                                            </button>
                                        </td>
                                        <td>
                                            {product.videoUrl ? <button
                                                className='btn btn-primary'
                                                onClick={() => {
                                                    setDisplayVideo(true)
                                                    setVideo(product.videoUrl)
                                                }}
                                            >
                                                More
                                            </button> : <span>None</span>}
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
                                                                let result = await api.product.update(product.id, { moderationStatus: 'active', status: "active" })
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
                                                                let result = await api.product.update(product.id, { moderationStatus: 'active', status: "active", priorityStatus: "active" })
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
                                                                    if (product.priorityStatus == "active") {
                                                                        let data = await api.authen.getUserById(product.userId)
                                                                        api.authen.update(product.userId, { wallet: data.data.data?.wallet + 15000 })
                                                                    }

                                                                    let result = await api.product.update(product.id, { status: 'delete', priorityStatus: "inactive" })
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