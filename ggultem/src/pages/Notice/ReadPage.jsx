// src/pages/Notice/ReadPage.jsx
import { useParams } from "react-router-dom";
import ReadComponent from "../../components/Notice/ReadComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";

const ReadPage = () => {
  const { nno } = useParams();

  return (
    <div className="bd-board-read-wrapper">
      <Header />
      <main className="bd-board-read-content">
        <ReadComponent nno={nno} />
      </main>
      <Footer />
    </div>
  );
};

export default ReadPage;
