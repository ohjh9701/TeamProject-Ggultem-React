import { useParams } from "react-router-dom";
import ReadComponent from "../../../components/admin/Notice/ReadComponent";
import Menu from "../../../include/admin/Menu";
import "./ListPage.css";

const ReadPage = () => {
  const { noticeId } = useParams();
  return (
    <div className="noticeinfo-page-wrapper">
      <Menu />
      <main className="noticeinfo-main-content">
        <div className="noticeinfo-hero-section">
          <ReadComponent noticeId={noticeId} />
        </div>
      </main>
    </div>
  );
};
export default ReadPage;
