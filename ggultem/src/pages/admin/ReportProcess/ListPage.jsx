import { useParams } from "react-router-dom";
import ReportListComponent from "../../../components/admin/ReportProcess/ReportListComponent";
import "./ListPage.css";
import Menu from "../../../include/admin/Menu";

const ReadPage = () => {
  const { reportId } = useParams();

  // ⭐ 파라미터 뒤에 붙은 쿼리스트링(?page=...)을 제거하고 순수 숫자 ID만 추출
  const cleanReportId = reportId ? reportId.split("?")[0] : null;

  return (
    <div className="report-page-wrapper">
      <Menu />
      <main className="report-main-content">
        <div className="report-hero-section">
          <ReportListComponent />
        </div>
      </main>
    </div>
  );
};

export default ReadPage;
