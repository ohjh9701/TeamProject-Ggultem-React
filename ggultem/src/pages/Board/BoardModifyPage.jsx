import "./BoardListPage.css"; // 기존 스타일 재사용
import BoardModifyComponent from "../../components/Board/BoardModifyComponent";
import { useParams } from "react-router-dom";
import Header from "../../include/Header";
import Footer from "../../include/Footer";

const BoardModifyPage = () => {

  const { boardNo } = useParams();

  return (
    <div className="boardList-page-wrapper">
      <Header />

      <main className="boardList-main-content">
        <BoardModifyComponent boardNo={boardNo} />
      </main>

      <Footer />
    </div>
  );
};

export default BoardModifyPage;