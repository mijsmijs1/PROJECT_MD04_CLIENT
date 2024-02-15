import React, { useEffect, useRef, useState } from 'react'
import './post.scss'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/store';
import { categoryAction } from '@/store/slices/category.slice';
import { api } from '@/service/apis';
import { message } from 'antd';
export default function Post() {
  const MAX_IMAGES = 6;
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 megabytes
  const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 megabytes
  const MAX_IMAGE_WIDTH = 240;
  const MAX_IMAGE_HEIGHT = 240;
  const inputRef = useRef(null)
  const videoRef = useRef(null)
  const [displayForm, setDisplayForm] = useState(false);
  const [displayAddress, setDisplayAddress] = useState(false);
  const dispatch = useDispatch();
  const categoryStore = useSelector((store: Store) => store.categoryStore)
  const [displayCategory, setDisplayCategory] = useState(true);
  const [displayBranch, setDisplayBranch] = useState(false);
  const [category, setCategory] = useState(null);
  const [branch, setBranch] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  useEffect(() => {
    // if (!localStorage.getItem("token")) return
    try {
      api.category.findCategory()
        .then(async (res) => {
          dispatch(categoryAction.setData(res.data.data))
          console.log("categories", res.data.data)
        })
        .catch(err => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }, [])
  useEffect(() => {
    axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
      .then(response => {
        setCities(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  const handleCityChange = (e) => {
    const selectedCityName = e.target.value;
    const selectedCity = cities.find(city => city.Name === selectedCityName);

    if (selectedCity) {
      setSelectedCity(selectedCityName);
      setDistricts(selectedCity.Districts);
      setSelectedDistrict('');
      setWards([]);
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistrictName = e.target.value;
    const selectedDistrict = districts.find(district => district.Name === selectedDistrictName);

    if (selectedDistrict) {
      setSelectedDistrict(selectedDistrictName);
      setWards(selectedDistrict.Wards);
    }
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!(e.target as any).ward.value || !(e.target as any).street.value || !(e.target as any).houseId.value) {
      message.warning("Vui lòng nhập đầy đủ thông tin!")
      return
    }
    setAddress(`${(e.target as any).houseId.value}&&${(e.target as any).street.value}&&${(e.target as any).ward.value}&&${selectedDistrict}&&${selectedCity}`)
    console.log(address);
    setDisplayAddress(false)
  }

  const handlePic = () => {
    inputRef.current.click();
  }
  const handleVideo = () => {
    videoRef.current.click();
  }

  const handleFileChange = (event: React.FormEvent) => {
    const files = Array.from((event.target as any).files);
    let err = 0;
    if (files.length > MAX_IMAGES) {
      message.warning("Chỉ được chọn tối đa 6 ảnh!")
      err += 1;
      return
    }
    files.forEach((file: any) => {
      const { type, size } = file;
      if (!type.includes("image")) {
        message.warning(`${file.name} có định dạng không thích hợp.`);
        err += 1;
        return
      }
      const image = new Image();
      image.src = URL.createObjectURL(file);

      if (size > MAX_IMAGE_SIZE) {
        message.warning(`${file.name} có dung lượng quá lớn.`);
        message.warning("Đã tải ảnh lên thất bại!");
        setSelectedFile(null)
        return
      }

      image.onload = () => {
        if (image.width < MAX_IMAGE_WIDTH || image.height < MAX_IMAGE_HEIGHT) {
          message.warning(`${file.name} có kích thước quá nhỏ.`);
          message.warning("Đã tải ảnh lên thất bại!");
          setSelectedFile(null)
          return
        }

        URL.revokeObjectURL(image.src);
      };
    });
    if (err > 0) {
      message.warning("Đã tải ảnh lên thất bại!");
      setSelectedFile(null)
      return
    }
    setSelectedFile(files);
    message.success("Đã tải ảnh lên thành công!");
    (event.target as any).files = null;
    // Xử lý tập tin đã chọn ở đây
  };

  const handleVideoChange = (event: React.FormEvent) => {
    const file = (event.target as any).files[0];
    console.log(file);
    
    if (!file.type.includes("video")) {
      message.warning(`${file.name} có định dạng không thích hợp.`);
      message.warning("Đã tải video lên thất bại!");
      setSelectedVideo(null)
      return
    }

    if (file.size > MAX_VIDEO_SIZE) {
      message.warning(`Video ${file.name} có dung lượng vượt quá 200MB.`);
      message.warning("Đã tải video lên thất bại!");
      setSelectedVideo(null)
      return
    }

    setSelectedVideo(file);
    message.success("Đã tải video lên thành công!");
    (event.target as any).files = null;
    // Xử lý tập tin đã chọn ở đây
  };
  return (
    <div className='post_box'>
      <h1>Đăng tin - đưa sản phẩm của bạn đến với mọi người</h1>
      <div className='post_app'>

        <div className='img_video'>
          <h4>Hình ảnh và video sản phẩm: </h4>
          <div className='img_box' style={branch ? { cursor: "pointer", ...(selectedFile ? { border: "2px dashed #49CC90" } : { border: "2px dashed rgb(255,99,47)" }) } : { cursor: "not-allowed", ...(selectedFile ? { border: "2px dashed #49CC90" } : { border: "2px dashed rgb(255,99,47)" }) }} onClick={() => { handlePic() }}>
            {branch && <input type='file' ref={inputRef} className='img_input' style={{ display: "none" }} multiple onChange={(e) => { handleFileChange(e) }} />}
            <i className={selectedFile ? `fa-solid fa-check` : "fa-solid fa-image"} style={selectedFile ? { color: "#49CC90" } : { color: "black" }}></i>
            <p style={selectedFile ? { color: "#49CC90" } : { color: "black" }}>Hình ảnh phải có kích thước tối thiểu 240 x 240 pixel! (Tối đa 6 ảnh)</p>
            {
              selectedFile && selectedFile.map(img => {
                return <img src={URL.createObjectURL(img)}></img>
              })
            }

          </div>
          <div className='img_box' style={branch ? { cursor: "pointer", ...(selectedVideo ? { border: "2px dashed #49CC90" } : { border: "2px dashed rgb(255,99,47)" }) } : { cursor: "not-allowed", ...(selectedVideo ? { border: "2px dashed #49CC90" } : { border: "2px dashed rgb(255,99,47)" }) }} onClick={() => { handleVideo() }}>
            {branch && <input type='file' ref={videoRef} className='video_input' style={{ display: "none" }} onChange={(e) => { handleVideoChange(e) }} />}
            <i className={selectedVideo ? `fa-solid fa-check` : "fa-solid fa-clapperboard"} style={selectedVideo ? { color: "#49CC90" } : { color: "black" }}></i>
            <p style={selectedVideo ? { color: "#49CC90" } : { color: "black" }}>Đăng tối đa 1 video</p>
            {
              selectedVideo && <video src={URL.createObjectURL(selectedVideo)}></video>
            }

          </div>
        </div>
        <div className='content'>
          <h4>Thông tin sản phẩm: </h4>


          <button className='category_btn' style={branch ? { backgroundColor: "#49CC90", color: "rgb(255,99,47)", border: "none" } : { backgroundColor: "white" }} onClick={() => {
            setDisplayForm(!displayForm)
          }}><span>{branch ? `${category.name} - ${branch.name} ` : `Danh mục -  sản phẩm `}</span><span style={{ color: "red" }}>(*)</span> <i className="fa-solid fa-plus"></i></button>
          {!branch && <>
            <img src='https://static.chotot.com/storage/chotot-icons/svg/empty-category.svg'></img>
            <p>Đăng nhanh - bán gọn - giao dịch nhanh chóng an toàn và tiện lợi tại RaoVat!</p>
          </>
          }
          {
            branch && <>
              <form className='form_info'>
                <p>Thông tin chi tiết</p>
                <p>Địa chỉ BĐS và hình ảnh</p>
                <input type='text' placeholder='Tên tòa nhà/ khu dân cư/ dự án'></input>
                <button className='address' onClick={() => {
                  setDisplayAddress(true)
                }}><span>{address ? `${address.replace(/&&/g, " ")} ` : `Chọn địa chỉ BĐS`}</span><span style={{ color: "red" }}>(*)</span> <i className="fa-solid fa-plus"></i></button>
                <p>Thông tin chi tiết:</p>
                <select id="type" defaultValue="">
                  <option value="" disabled>Loại hình nhà ở <span style={{ color: "red" }}>(*)</span></option>
                  <option value="Nhà mặt phố, mặt tiền">Nhà mặt phố, mặt tiền</option>
                  <option value="Nhà ngõ, hẻm">Nhà ngõ, hẻm</option>
                  <option value="Nhà biệt thự">Nhà biệt thự</option>
                </select>
                <select id="Tang" defaultValue="">
                  <option value="" disabled>Tổng số tầng<span style={{ color: "red" }}>(*)</span></option>
                  {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Nhiều hơn 10"].map(item => {
                      return <>
                        <option value={item}>{item}</option>
                      </>
                    })
                  }
                </select>
                <select id="Bedroom" defaultValue="">
                  <option value="" disabled>Số phòng ngủ<span style={{ color: "red" }}>(*)</span></option>
                  {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Nhiều hơn 10"].map(item => {
                      return <>
                        <option value={item}>{item}</option>
                      </>
                    })
                  }
                </select>
                <select id="Badroom" defaultValue="">
                  <option value="" disabled>Số phòng vệ sinh<span style={{ color: "red" }}>(*)</span></option>
                  {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Nhiều hơn 10"].map(item => {
                      return <>
                        <option value={item}>{item}</option>
                      </>
                    })
                  }
                </select>
                <p>Thông tin khác:</p>
                <select id="per" defaultValue="">
                  <option value="" disabled>Giấy tờ pháp lý<span style={{ color: "red" }}>(*)</span></option>
                  <option value="Đã có sổ">Đã có sổ</option>
                  <option value="Đang chờ sổ">Đang chờ sổ</option>
                  <option value="Giấy tờ khác">Giấy tờ khác</option>
                </select>
                <select id="deco" defaultValue="">
                  <option value="" disabled>Tình trạng nội thất<span style={{ color: "red" }}>(*)</span></option>
                  <option value="Nội thất đầy đủ">Nội thất đầy đủ</option>
                  <option value="Hoàn thiện cơ bản">Hoàn thiện cơ bản</option>
                  <option value="Bàn giao th">Bàn giao thô</option>
                </select>
                <p>Đặc điểm nhà đất:</p>
                <select id="more" defaultValue="">
                  <option value="" disabled>Thông tin thêm:<span style={{ color: "red" }}>(*)</span></option>
                  <option value="Hẻm xe hơi">Hẻm xe hơi</option>
                  <option value="Nở hậu">Nở hậu</option>
                </select>
                <p>Diện tích và giá:</p>
                <input type='text' placeholder={`Diện tích đất (m2)`} id="area" required></input>
                <input type='text' placeholder={`Diện tích sử dụng (m2)`} id="useArea" required></input>
                <input type='text' placeholder={`Chiều dài (m)`} id="x" required></input>
                <input type='text' placeholder={`Chiều ngang (m)`} id="y" required></input>
                <input type='text' placeholder={`Giá bán (đồng)`} id="y" required></input>
                <p>Tiêu đề tin đăng và Mô tả chi tiết</p>
                <input type='text' placeholder={`Tiêu đề tin đăng (Tối đa 70 kí tự)`} id="title" required></input>
                <p>Mô tả chi tiết: (Tối đa 1000 kí tự)</p>
                <textarea id="des" style={{ width: "90%", height: 150 }} inputMode='text' placeholder='Nên có: Loại nhà ở, vị trí, tiện ích, diện tích, số phòng, thông tin pháp lý, nội thất, v.v.

Ví dụ: Nhà mặt tiền số 58 Phan Chu Trinh, Q.Bình Thạnh, 120m2. Khu dân cư an ninh. Giấy tờ chính chủ.'></textarea>
                <button type='submit'>Đăng tin</button>
              </form>
            </>

          }

        </div>
      </div>
      {displayForm && <div className='form_box'>
        <div className='content'>
          <h2>Đăng tin - thông tin sản phẩm</h2>
          {isReturning && <span className='return' onClick={() => {
            setDisplayBranch(false)
            setDisplayCategory(true)
          }
          }><i className="fa-solid fa-arrow-left"></i></span>}
          <span onClick={() => {
            setDisplayForm(!displayForm)
            setCategory(null)
            setBranch(null)
          }
          }>X</span>
          <p>CHỌN DANH MỤC:</p>
          {displayCategory &&
            categoryStore.category?.map(item => {
              return <button
                onClick={() => {
                  setCategory(item)
                  setDisplayCategory(false)
                  setDisplayBranch(true)
                  setIsReturning(true)
                }}
                key={Date.now() * Math.random()}><img src={String(item.avatar)}></img>{item.name} <i className="fa-solid fa-plus"></i></button>
            })
          }
          {
            displayBranch && categoryStore.category.map(item => {
              if (item.codeName == category.codeName) {
                return item.branches.map(branch => {
                  return <button
                    onClick={() => {
                      setBranch(branch)
                      setDisplayForm(!displayForm)
                    }}
                    key={Date.now() * Math.random()}>{branch.name} <i className="fa-solid fa-plus"></i></button>
                })

              }
            })
          }
        </div>

      </div>}
      {displayAddress && <>
        <div className='form_box'>
          <div className='content'>
            <h2>Địa chỉ</h2>
            <span onClick={() => {
              setDisplayAddress(false)
            }
            }>X</span>
            <div>
              <select className="form-select form-select-sm mb-3" onChange={handleCityChange} value={selectedCity}>
                <option value="" disabled>Chọn tỉnh thành</option>
                {cities.map(city => (
                  <option key={city.Id} value={city.Name}>{city.Name}</option>
                ))}
              </select>

              <select className="form-select form-select-sm mb-3" onChange={handleDistrictChange} value={selectedDistrict}>
                <option value="" disabled>Chọn quận huyện</option>
                {districts.map(district => (
                  <option key={district.Id} value={district.Name}>{district.Name}</option>
                ))}
              </select>
              <form onSubmit={(e) => {
                handleSubmitAddress(e)
              }} className='address_form'>
                <select className="form-select form-select-sm" id="ward" defaultValue="">
                  <option value="" disabled>Chọn phường xã</option>
                  {wards.map(ward => (
                    <option key={ward.Id} value={ward.Name}>{ward.Name}</option>
                  ))}
                </select>
                <p>Tên đường, khu phố, tổ, ấp:</p>
                <input type='text' placeholder='Nhập thông tin...' id="street"></input>
                <p>Số nhà:</p>
                <input type='text' placeholder='Nhập thông tin...' id="houseId"></input>
                <button type='submit'>Xác nhận</button>
              </form>
            </div>

          </div>

        </div>
      </>}
    </div>
  )
}
