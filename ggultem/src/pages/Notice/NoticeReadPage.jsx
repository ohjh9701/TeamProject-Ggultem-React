import { useParams } from "react-router-dom";
import "./NoticeReadPage.css"; // CSS 파일 연결 확인!
import Header from "../../include/Header";
import Footer from "../../include/Footer";
import NoticeRead from "../../components/Notice/NoticeRead";

const NoticeReadPage = () => {
  const { noticeId } = useParams();

  return (
    <div className="notice-page-read-wrapper">
      <Header />
      <main className="notice-page-read-content">
        <NoticeRead noticeId={noticeId} />
      </main>
      <Footer />
    </div>
  );
};

export default NoticeReadPage;
