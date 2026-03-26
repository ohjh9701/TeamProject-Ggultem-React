import ReplyComponent from "../../../components/admin/ItemBoard/AdminReplyComponent";
import Menu from "../../../include/admin/Menu";
import useCustomLogin from "../../../hooks/useCustomLogin";
import "./AdminReplyPage.css";

const AdminReplyPage = () => {
  const { isLogin, moveToAdminLoginReturn } = useCustomLogin();

  if (!isLogin) {
    return moveToAdminLoginReturn();
  }
  return (
    <div className="itemBoardinfo-page-wrapper">
      <Menu />
      <main className="itemBoardinfo-main-content">
        <div className="itemBoardinfo-hero-section">
          <ReplyComponent />
        </div>
      </main>
    </div>
  );
};

export default AdminReplyPage;
