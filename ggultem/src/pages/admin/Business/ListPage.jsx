import Menu from "../../../include/admin/Menu";
import ListBusinessMember from "../../../components/admin/Business/ListComponent";
import "./ListPage.css";
import useCustomLogin from "../../../hooks/useCustomLogin";

const MainPage = () => {
  const { isLogin, moveToAdminLoginReturn } = useCustomLogin();

  if (!isLogin) {
    return moveToAdminLoginReturn();
  }

  return (
    <div className="businessmemberinfo-page-wrapper">
      <Menu />
      <main className="businessmemberinfo-main-content">
        <div className="businessmemberinfo-hero-section">
          <ListBusinessMember />
        </div>
      </main>
    </div>
  );
};

export default MainPage;
