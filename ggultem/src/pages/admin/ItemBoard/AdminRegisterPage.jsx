import AdminRegister from "../../../components/admin/ItemBoard/AdminRegisterComponent";
import Header from "../../../include/Header";
import Footer from "../../../include/Footer";
import "./AdminRegisterPage.css"; // CSS 파일 임포트

const AdminRegisterPage = () => {
  return (
    <div className="adminRegister-page-wrapper">
      <Header />
      <main className="adminRegister-main-content">
        <AdminRegister />
      </main>
      <Footer />
    </div>
  );
};

export default AdminRegisterPage;
