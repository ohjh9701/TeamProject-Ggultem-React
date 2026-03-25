import ReadComponent from "../../../components/admin/ItemBoard/AdminReadComponent";
import Menu from "../../../include/admin/Menu";
import useCustomLogin from "../../../hooks/useCustomLogin";
import "./AdminReadPage.css";

const AdminListPage = () => {
  const { isLogin, moveToAdminLoginReturn } = useCustomLogin();

  if (!isLogin) {
    return moveToAdminLoginReturn();
  }
  return (
    <div className="itemBoardinfo-page-wrapper">
      <Menu />
      <main className="itemBoardinfo-main-content">
        <div className="itemBoardinfo-hero-section">
          <ReadComponent />
        </div>
      </main>
    </div>
  );
};

export default AdminListPage;
