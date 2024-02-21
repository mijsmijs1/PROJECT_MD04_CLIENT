import React, { useEffect, useState } from 'react'
import './search.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { convertToVND } from '@mieuteacher/meomeojs';
import { Store } from '@/store';
import SortByPrice from './components/SortByPrice';
import Priority from './components/Priority';
import { api } from '@/service/apis';
import SearchByWord from './components/SearchByWord';
export default function Search() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const productStore = useSelector((store: Store) => store.productStore)
    const categoryStore = useSelector((store: Store) => store.categoryStore)
    const [selectedValue, setSelectedValue] = useState(null)
    const [renderCount, setRenderCount] = useState(0)
    const [priority, setPriority] = useState(null)
    const [prioProducts, setPrioProducts] = useState(null)
    const [searchContent, setSearchContent] = useState([])
    function formatTimeAgo(dateString) {
        const date: any = new Date(dateString);
        const now: any = new Date();
        const diff = Math.floor((now - date) / 1000); // Độ chênh lệch thời gian tính bằng giây

        if (diff < 60) {
            return `${diff} giây trước`;
        } else if (diff < 60 * 60) {
            const minutes = Math.floor(diff / 60);
            return `${minutes} phút trước`;
        } else if (diff < 60 * 60 * 24) {
            const hours = Math.floor(diff / (60 * 60));
            return `${hours} giờ trước`;
        } else if (diff < 60 * 60 * 24 * 7) {
            const days = Math.floor(diff / (60 * 60 * 24));
            return `${days} ngày trước`;
        } else if (diff < 60 * 60 * 24 * 30) {
            const weeks = Math.floor(diff / (60 * 60 * 24 * 7));
            return `${weeks} tuần trước`;
        } else {
            const months = Math.floor(diff / (60 * 60 * 24 * 30));
            return `${months} tháng trước`;
        }
    }
    let activeProducts = [];

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    const branch = searchParams.get('branch');
    const keyword = searchParams.get('keyword');
    if (category && !branch && !keyword) {
        let categoryData = categoryStore.category.find(item => item.codeName == category)
        let branches = categoryData.branches;
        for (const i of branches) {
            const filteredProducts = productStore?.product.filter(item => item.branchId == i.id);
            activeProducts.push(...filteredProducts); // Thêm các sản phẩm tương ứng vào mảng activeProducts
        }
    }
    if (category && branch && !keyword) {
        let categoryData = categoryStore.category.find(item => item.codeName == category)
        let branches = categoryData.branches;
        for (const i of branches) {
            if (i.codeName == branch) {
                const filteredProducts = productStore?.product.filter(item => item.branchId == i.id);
                activeProducts.push(...filteredProducts); // Thêm các sản phẩm tương ứng vào mảng activeProducts
            }
        }
    }
    
    const priorityProducts = activeProducts?.filter((item) => item?.priorityStatus == "active");
    const normalProducts = activeProducts?.filter((item) => item?.priorityStatus == "inactive");
    console.log('priorityProducts', priorityProducts);
    console.log('normalProducts', normalProducts);

    const handleSortChange = (event: React.FormEvent) => {
        setSelectedValue((event.target as any).value);
    };
    return (
        <div className='search_box'>
            <div className='search_app'>
                <div className='search_top'>
                    {keyword && <span><i className="fa-solid fa-magnifying-glass"></i> Kết quả tìm kiếm của '{keyword}'</span>}
                    {(category && !branch) && <span><i className="fa-solid fa-filter"></i> Danh mục sản phẩm '{category}'</span>}
                    {branch && <span><i className="fa-solid fa-filter"></i> Danh mục sản phẩm '{branch}'</span>}
                </div>
                <div className='sort'>
                    <span>Sắp xếp theo </span>
                    <button>Liên quan</button>
                    <button>Mới nhất</button>
                    <button onClick={() => {
                        setPriority(!priority);
                        setPrioProducts(priorityProducts)
                    }}
                        style={{ backgroundColor: priority ? "#49CC90" : "white", border: priority ? "none" : "1px solid black", color: priority ? "white" : "black" }}
                    >Tin ưu tiên</button>
                    <select className="form-select form-select-sm mb-3" defaultValue="" onChange={(e) => { handleSortChange(e) }}>
                        <option value="" disabled>Sort theo giá</option>
                        <option value='highToLow'>Giá: thấp đến cao</option>
                        <option value='lowToHigh'>Giá: cao đến thấp</option>
                    </select>

                </div>

                <div className='content'>
                    {!keyword && !priority && !selectedValue && priorityProducts &&
                        priorityProducts
                            .map((item) => {
                                // if (renderCount >= 18) {
                                //     return null; // Dừng việc render nếu đã đạt đến giới hạn
                                // }
                                // setRenderCount(renderCount + 1)
                                return <>
                                    <div className="container_item"
                                        onClick={() => {
                                            window.location.href = `product-info?productId=${item.id}`
                                        }}>
                                        {item.priorityStatus == "active" && <div className='priority_logo'>
                                            <img src="https://www.ganemo.co/web/image/product.template/513/image_1024?unique=eaa03e2" alt="" />
                                            <span>ĐỐI TÁC</span>
                                        </div>}

                                        <div className="img_container">
                                            <img src={`${import.meta.env.VITE_SV_HOST}/${item.avatar}`} />
                                        </div>
                                        <div className="content_container">
                                            {item.priorityStatus == "active" && <span className='priority_logo_vip'>
                                                <i className="fa-regular fa-circle-up"></i>
                                                <span>UY TÍN</span>
                                            </span>}
                                            <h6>{JSON.parse(item.detail).title}</h6>
                                            <p>{item.branchId == 1 && `${JSON.parse(item.detail).area} m²`}</p>
                                            <h5>{convertToVND(item.price)}</h5>
                                            <div className='info'>
                                                <img src='https://static.chotot.com/storage/chotot-icons/svg/user.svg'></img>
                                                <span>{formatTimeAgo(Number(item.createAt))}</span><span> - </span><span>{item.address.split("&&")[4].replace(/Thành phố|Tỉnh/g, "")}</span>
                                            </div>

                                        </div>
                                    </div>
                                </>
                            })
                    }
                    {!keyword && !priority && !selectedValue && normalProducts &&
                        normalProducts
                            .map((item) => {
                                // if (renderCount >= 18) {
                                //     return null; // Dừng việc render nếu đã đạt đến giới hạn
                                // }
                                // setRenderCount(renderCount + 1)
                                return <>
                                    <div className="container_item"
                                        onClick={() => {
                                            navigate(`product-info?productId=${item.id}`)
                                        }}>
                                        <div className="img_container">
                                            <img src={`${import.meta.env.VITE_SV_HOST}/${item.avatar}`} />
                                        </div>
                                        <div className="content_container">
                                            <h6>{JSON.parse(item.detail).title}</h6>
                                            <p>{item.branchId == 1 && `${JSON.parse(item.detail).area} m²`}</p>
                                            <h5>{convertToVND(item.price)}</h5>
                                            <div className='info'>
                                                <img src='https://static.chotot.com/storage/chotot-icons/svg/user.svg'></img>
                                                <span>{formatTimeAgo(Number(item.createAt))}</span><span> - </span><span>{item.address.split("&&")[4].replace(/Thành phố|Tỉnh/g, "")}</span>
                                            </div>

                                        </div>
                                    </div>
                                </>
                            })
                    }.
                    {!priority && selectedValue && <SortByPrice setSelectedValue={setSelectedValue} selectedValue={selectedValue} activeProducts={activeProducts} />

                    }
                    {priority && <Priority priority={priority} priorityProducts={priorityProducts} />

                    }
                    {
                        keyword && <SearchByWord activeProducts={activeProducts} keyword={keyword}/>
                    }
                </div>
            </div>

        </div>
    )
}
