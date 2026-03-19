import { useState } from "react";
import "./LoginComponent.css";
import useCustomLogin from "../../hooks/useCustomLogin";

const initState = {
  email: "",
  pw: "",
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const { doLogin, moveToPath } = useCustomLogin();
  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setLoginParam({ ...loginParam, [e.target.name]: e.target.value });
  };

  const handleClickLogin = (e) => {
    e.preventDefault();

    doLogin(loginParam)
      .then((data) => {
        if (data.error) {
          alert("이메일 또는 비밀번호를 확인해주세요.");
        } else {
          alert(`${data.nickname}님, 관리자 페이지에 오신 걸 환영해요! 🍯`);
          moveToPath("/admin");
        }
      })
      .catch((err) => {
        alert("로그인 중 오류가 발생했습니다. 서버 상태를 확인해 주세요.");
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">🍯 꿀템-관리자</div>
        <h2 className="login-title">로그인</h2>
        <p className="login-subtitle">관리자님 로그인을 해주세요.</p>

        <form className="login-form">
          <div className="input-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              placeholder="example@honey.com"
              value={loginParam.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="pw"
              placeholder="비밀번호를 입력하세요"
              value={loginParam.pw}
              onChange={handleChange}
            />
          </div>

          <button className="login-btn" onClick={handleClickLogin}>
            관리자 로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
