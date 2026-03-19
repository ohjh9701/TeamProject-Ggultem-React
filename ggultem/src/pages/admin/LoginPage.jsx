import LoginComponent from "../../components/admin/LoginComponent";
import "./LoginPage.css"; // CSS 파일 임포트

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">
        <LoginComponent />
      </div>
    </div>
  );
};

export default LoginPage;
