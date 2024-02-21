import React from 'react'
import './footer.scss'
export default function Footer() {
  return (
    <footer>
      <div className="footer">
      <div className='footer_content'>
        <div>
          <p>Hỗ trợ Khách hàng</p>
          <ul>
            {["Thẻ ưu đãi", "Hướng dẫn mua online", "Ưu đãi dành cho Doanh nghiệp", "Chính sách trả góp", "Dịch vụ sửa chữa"].map(item => (
              <li key={Date.now() * Math.random()}>
                <a>{item}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p>Chính sách mua hàng</p>
          <ul>
            {["Điều kiện giao dịch chung", "Chính sách bảo hành", "Chính sách đổi trả", "Chính sách thanh toán", "Giao hàng và Lắp đặt tại nhà", "Dịch vụ lắp đặt và nâng cấp PC/ Laptop tại cửa hàng & TTBH"].map(item => (
              <li key={Date.now() * Math.random()}>
                <a>{item}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p>Thông tin Phú Quý</p>
          <ul>
            {["Giới thiệu Phú Quý", "Hệ thống cửa hàng", "Trung tâm bảo hành", "Chính sách bảo mật", "Tin công nghệ"].map(item => (
              <li key={Date.now() * Math.random()}>
                <a>{item}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p>Cộng đồng Phú Quý</p>
          <ul>
            <li>Gọi mua hàng (miễn phí) <a href="tel:18006867">18006867</a></li>
            <li>Gọi chăm sóc   <a href="tel:18006867">18006867</a></li>
            <li><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png' /> Facebook Phú Quý</li>
            <li><img src='https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png?20220706172052' /> Phú Quý Media</li>
            <li><img src='https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Zalo-Arc.png' /> Zalo Phú Quý</li>
          </ul>
        </div>
        <div>
          <p>Email liên hệ</p>
          <ul>
            {["Hỗ trợ Khách hàng:", "Liên hệ báo giá:", "Hợp tác phát triển:"].map(item => (
              <li key={Date.now() * Math.random()}>
                <h6>{item}</h6><a href='fabook.com'>nguyphuquy1@gmail.com</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='footer_info'>
        <div>
          <p>Danh sách các ngân hàng thanh toán online:</p>
          <img src='https://shopfront-cdn.tekoapis.com/static/vnpay_banks.png' />
        </div>
      </div>
      </div>
    </footer>
  )
}