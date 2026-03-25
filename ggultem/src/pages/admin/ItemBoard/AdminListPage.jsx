import ListComponent from "../../../components/admin/ItemBoard/AdminListComponent";
import Menu from "../../../include/admin/Menu";
import useCustomLogin from "../../../hooks/useCustomLogin";
import "./AdminListPage.css";

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
          <ListComponent />
        </div>
      </main>
    </div>
  );
};

export default AdminListPage;
