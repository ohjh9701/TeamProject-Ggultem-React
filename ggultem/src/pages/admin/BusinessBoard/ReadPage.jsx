import React from "react";
import "./ReadPage.css";
import ReadComponent from "../../../components/admin/BusinessBoard/ReadComponent";
import Menu from "../../../include/admin/Menu";
import { useParams } from "react-router-dom";

const ReadPage = () => {
  const { no } = useParams();

  return (
    <div className="businessboard-page-wrapper">
      <Menu />
      <main className="businessboard-main-content">
        <div className="businessboard-hero-section">
          <ReadComponent no={no} />
        </div>
      </main>
    </div>
  );
};

export default ReadPage;
