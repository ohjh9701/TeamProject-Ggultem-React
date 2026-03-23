import "./RegisterPage.css";
import RegisterComponent from "../../components/Business/RegisterComponent";
import Footer from "../../include/Footer";
import Header from "../../include/Header";

const RegisterPage = () => {
  return (
    <div className="business-page-wrapper">
      <Header />
      <main className="business-main-content">
        <div className="business-hero-section">
          <RegisterComponent />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
