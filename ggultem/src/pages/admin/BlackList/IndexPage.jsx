import BlackListDashboard from "../../../components/admin/BlackList/BlackListDashboard";
import Menu from "../../../include/admin/Menu";
import "./IndexPage.css";

const IndexPage = () => {
  return (
    <div className="blacklist-page-wrapper">
      <Menu />
      <main className="blacklist-main-content">
        <div className="blacklist-hero-section">
          <BlackListDashboard />
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
