import React, { useEffect, useState } from 'react'
import './product.scss'
import { api } from '@/service/apis'
import { useDispatch, useSelector } from 'react-redux'
import { categoryAction } from '@/store/slices/category.slice'
import { productAction } from '@/store/slices/product.slice'
import { convertToVND } from '@mieuteacher/meomeojs';
import { Store } from '@/store'
import { useNavigate } from 'react-router-dom'
export function Product() {
  const [productCount, setProductCount] = useState(0);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh' // Múi giờ Việt Nam (GMT+7)
  };
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const productStore = useSelector((store: Store) => store.productStore)
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
  const activeProducts = productStore?.product?.filter((item) => item?.status == "active" && item?.moderationStatus == "active");
  let renderedCount = 0;
  const priorityProducts = activeProducts?.filter((item) => item?.priorityStatus == "active");
  const normalProducts = activeProducts?.filter((item) => item?.priorityStatus == "inactive");
  console.log('activeProducts', activeProducts);
  console.log('priorityProducts', priorityProducts);
  console.log('normalProducts', normalProducts);
  return (
    <div className='product_box'>
      <h3>Tin đăng dành cho bạn</h3>

      <div className='content'>
        {priorityProducts &&
          priorityProducts
            .sort((a, b) => b.id - a.id)
            .map((item) => {
              if (renderedCount >= 18) {
                return null; // Dừng việc render nếu đã đạt đến giới hạn
              }
              renderedCount++;
              return <>
                <div className="container_item"
                  onClick={() => {
                    navigate(`product-info?productId=${item.id}`)
                  }}>
                  <div className='priority_logo'>
                    <img src="https://www.ganemo.co/web/image/product.template/513/image_1024?unique=eaa03e2" alt="" />
                    <span>ĐỐI TÁC</span>
                  </div>
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
        }
        {normalProducts &&
          normalProducts
            .sort((a, b) => b.id - a.id)
            .map((item) => {
              if (renderedCount >= 18) {
                return null; // Dừng việc render nếu đã đạt đến giới hạn
              }
              renderedCount++;
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
        }
      </div>

    </div>
  )
}
