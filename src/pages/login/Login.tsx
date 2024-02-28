// Import React and CSS file if needed
import React, { useState } from 'react';
import './login.scss';
import { Modal } from 'antd';
import { api } from '@/service/apis';
import BtnLoading from '@/components/BtnLoading'
import { loginWithGoogle, reauthenticate } from '@/service/firebase';

const Login = ({ setModalVisible }) => {
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [load, setLoad] = useState(false)
  const handleLoginClick = () => {
    setIsLogin(!isLogin);
    setIsSignup(!isSignup);
  };

  const handleSignupClick = () => {
    setIsSignup(!isSignup);
    setIsLogin(!isLogin);
  };
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    try {
      const userName = (e.target as any).userName.value;
      const email = (e.target as any).email.value;
      const password = (e.target as any).password.value;

      if (!userName || !email || !password) {
        alert("Vui lòng nhập đầy đủ các trường");
        return;
      }
      const newUser = {
        userName,
        email,
        password
      }
      setLoad(true)
      let res = await api.authen.create(newUser);
      setLoad(false)
      if (res.status == 200) {
        Modal.success({
          title: "Đăng kí thành công",
          content: "Vui lòng kiểm tra email của bạn để xác thực",
          onOk: () => {
            (e.target as any).userName.value = "";
            (e.target as any).email.value = "";
            (e.target as any).password.value = "";
            handleLoginClick()
          }
        })
      }
    } catch (err: any) {
      console.log(err);
      setLoad(false)
      Modal.error({
        title: "Lỗi",
        content: err.response?.data?.message.join(" ") || "Lỗi không rõ!"
      })
    }
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!(e.target as any).loginInfo.value || !(e.target as any).loginPassword.value) {
        Modal.warning({
          title: "Chú ý!",
          content: "Vui lòng nhập đầy đủ thông tin đăng nhập!",
          onOk: () => { }
        })
        return
      }


      let loginData = {
        loginInfo: (e.target as any).loginInfo.value,
        password: (e.target as any).loginPassword.value

      }
      setLoad(true)
      let result = await api.authen.login(loginData)
      if (result.status == 200) {
        (e.target as any).loginInfo.value = "";
        (e.target as any).loginPassword.value = "";
        setLoad(false)
        localStorage.setItem("token", result.data.data)
        Modal.success({
          title: result.data.message,
          onOk: () => {
            window.location.href = "/"
          }
        })
      }
    } catch (err) {
      setLoad(false)
      Modal.error({
        title: "Lỗi!",
        content: err.response.data.message,
        onOk: () => {

        }
      });

    }
  }
  const closeModal = () => {
    setModalVisible(false);
  };
  async function handleLoginWithSosial(result, name) {
    try {
      setLoad(true)
      let data = {
        googleToken: result?.user?.accessToken,
        user: {
          email: result.user.email,
          avatar: result.user.photoURL,
          userName: String(Math.ceil(Date.now() * Math.random())),
          password: String(Math.ceil(Date.now() * Math.random()))
        }
      }
      let resultApi = await api.authen.loginWithGoogle(data);
      if (resultApi.status == 200) {
        localStorage.setItem("token", resultApi.data.token)
        setLoad(false)
        Modal.success({
          title: "Notication",
          content: `Đăng nhập với ${name} thành công!`,
          onOk: () => {
            window.location.href = "/"
          }
        })
      }
    } catch (err) {
      console.log('err', err);
      setLoad(false)
      Modal.error({
        title: 'Error',
        content: err.response ? err.response.data.message : "Loi khong xac dinh"
      })
    }
  }
  return (
    <div>
      <div className='login_container'>
        {isSignup && <div className="form-container ">
          <p className="title">Create account</p>
          <button onClick={() => {
            closeModal()

          }} className='button-exit'>X</button>
          <p className="sub-title">Let's get statred with your 30 days free trial</p>
          <form className="form" onSubmit={(e) => { handleSignup(e) }}>
            <input type="text" id="userName" className="input" placeholder="User Name" />
            <input type="email" id="email" className="input" placeholder="Email" />
            <input type="password" id="password" className="input" placeholder="Password" />
            <button className="form-btn" type='submit'>Create account {load && <BtnLoading />}</button>
          </form>
          <p className="sign-up-label">
            Already have an account?<span className="sign-up-link" onClick={() => { handleLoginClick() }}> Log in</span>
          </p>
          <div className="buttons-container">
            <div className="apple-login-button">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                className="apple-icon"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z" />
              </svg>
              <span>Sign up with Apple</span>
            </div>
            <div className="google-login-button" onClick={async () => {
              setLoad(true)
              let result = await loginWithGoogle();
              reauthenticate();
              handleLoginWithSosial(result, "Google")
            }}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                version="1.1"
                x="0px"
                y="0px"
                className="google-icon"
                viewBox="0 0 48 48"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              <span>Sign up with Google</span>
              {load && <BtnLoading />}
            </div>
          </div>
        </div>}
        {isLogin && <div className="form-container">
          <p className="title">Log In</p>
          <button onClick={() => {
            closeModal()

          }} className='button-exit'>X</button>
          <p className="sub-title">Tham gia cộng đồng của chúng tôi để trao đổi mua bán an toàn, nhanh chóng và tiện lợi!</p>
          <form className="form" onSubmit={(e) => {
            handleLogin(e)
          }}>
            <input type="text" id="loginInfo" className="input" placeholder="Email" />
            <input type="password" id="loginPassword" className="input" placeholder="Password" />
            <button className="form-btn" type='submit'>Sign In {load && <BtnLoading />}</button>
          </form>
          <p className="sign-up-label">
            Don't have an account?<span className="sign-up-link" onClick={() => { handleSignupClick() }}> Create an account</span>
          </p>
          <div className="buttons-container">
            <div className="apple-login-button">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                className="apple-icon"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z" />
              </svg>
              <span>Sign up with Apple</span>
            </div>
            <button className="google-login-button" onClick={async () => {
              setLoad(true)
              let result = await loginWithGoogle();
              reauthenticate();
              handleLoginWithSosial(result, "Google")
            }}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                version="1.1"
                x="0px"
                y="0px"
                className="google-icon"
                viewBox="0 0 48 48"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              <span>Sign up with Google</span>
              {load && <BtnLoading />}
            </button>
          </div>
        </div>}

      </div >
    </div >

  );
};

export default Login;
