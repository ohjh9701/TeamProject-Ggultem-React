import { useParams } from "react-router-dom";
import ModifyComponent from "../../../components/admin/Notice/ModifyComponent";
import Menu from "../../../include/admin/Menu";
import "./ListPage.css";

const Modify = () => {
  // 1. URL 주소창에서 /admin/notice/modify/123 처럼 들어오는 ID를 추출.
  const { noticeId } = useParams();

  return (
    <div className="noticeinfo-page-wrapper">
      <Menu />
      <main className="noticeinfo-main-content">
        <div className="noticeinfo-hero-section">
          <ModifyComponent noticeId={noticeId} />
        </div>
      </main>
    </div>
  );
};

export default Modify;
