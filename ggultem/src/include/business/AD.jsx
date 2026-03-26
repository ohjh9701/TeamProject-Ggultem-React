import ADSection from "../../components/Business/AD/ADSection";
import ADPLSection from "../../components/Business/AD/ADPLSection";
import "./AD.css"; // CSS 파일 임포트

const AD = () => {
  return (
    <div className="AD-section-all-container">
      <div className="AD-section-all-PowerShoping">
        <ADSection />
      </div>

      <div className="AD-section-all-PowerLink">
        <ADPLSection />
      </div>
    </div>
  );
};

export default AD;
