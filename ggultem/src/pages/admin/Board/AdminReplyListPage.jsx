import Menu from "../../../include/admin/Menu";
import AdminReplyListComponent from "../../../components/admin/Board/AdminReplyListComponent";
import "./AdminBoardListPage.css"; // 👉 기존 css 재사용
import useCustomLogin from "../../../hooks/useCustomLogin";

const AdminReplyListPage = () => {
  // 로그인 체크
  const { isLogin, moveToAdminLoginReturn } = useCustomLogin();

  // 로그인 안되어있으면 관리자 로그인 페이지로 튕김
  if (!isLogin) {
    return moveToAdminLoginReturn();
  }

  return (
    <div className="board-page-wrapper">
      <Menu />
      <main className="board-main-content">
        <div className="board-hero-section">
          <AdminReplyListComponent />
        </div>
      </main>
    </div>
  );
};

export default AdminReplyListPage;
