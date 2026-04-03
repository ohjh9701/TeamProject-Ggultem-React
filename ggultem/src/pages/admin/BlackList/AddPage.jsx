import React from "react";
import AddComponent from "../../../components/admin//BlackList/AddComponent";
import Menu from "../../../include/admin/Menu";
import "./IndexPage.css";

const AddPage = () => {
  return (
    <div className="blacklist-page-wrapper">
      <Menu />
      <main className="blacklist-main-content">
        <div className="blacklist-hero-section">
          <AddComponent />
        </div>
      </main>
    </div>
  );
};

export default AddPage;
