import Menu from "../../include/admin/Menu";
import "./MainPage.css";
import logoImg from "../../assets/logo.png";
import useCustomLogin from "../../hooks/useCustomLogin";

const MainPage = () => {
  const { isLogin, moveToAdminLoginReturn, loginState, doLogout } = useCustomLogin();

  if (!isLogin) {
    return moveToAdminLoginReturn();
  }

  if(loginState.email !== 'admin@honey.com') {
    doLogout();
    return moveToAdminLoginReturn();
  }

  return (
    <div className="main-container">
      <Menu />

      <main className="content-area">
        <div className="hero-section">
          <img src={logoImg} alt="꿀템 로고" className="header-logo-img" />
          <h2>달콤한 득템, 꿀템!</h2>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
