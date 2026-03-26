import Menu from "../../../include/admin/Menu";
import ListBusinessBoard from "../../../components/admin/BusinessBoard/ListComponent";
import "./ListPage.css";
import useCustomLogin from "../../../hooks/useCustomLogin";

const MainPage = () => {
  const { isLogin, moveToAdminLoginReturn } = useCustomLogin();

  if (!isLogin) {
    return moveToAdminLoginReturn();
  }

  return (
    <div className="businessboardinfo-page-wrapper">
      <Menu />
      <main className="businessboardinfo-main-content">
        <div className="businessboardinfo-hero-section">
          <ListBusinessBoard />
        </div>
      </main>
    </div>
  );
};

export default MainPage;
