import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../../api/admin/BusinessApi";
import useCustomMove from "../../../hooks/useCustomMove";
import PageComponent from "../../common/PageComponent";
import { useNavigate } from "react-router-dom";
import "./ListComponent.css";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const host = API_SERVER_HOST;

const ListComponent = () => {
  const { page, size, keyword, searchType, refresh, moveToBoardList } =
    useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const navigate = useNavigate();

  useEffect(() => {
    getList({ page, size, keyword, searchType }).then((data) => {
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh]);

  return (
    <div className="member-list-wrapper">
      <div className="member-list-container">
        {/* 헤더 섹션 */}
        <div className="member-header">
          <div className="title-group">
            <h2 className="member-title">
              <span className="member-title-point">꿀템</span> 비즈니스 회원
              관리
            </h2>
            <p className="member-subtitle">
              국세청 인증을 통과한 비즈니스 파트너 목록입니다.
            </p>
          </div>

          <div className="member-actions">
            <button
              className="admin-btn biz-btn"
              onClick={() => navigate("/admin/member/list")}
            >
              일반 회원
            </button>
            <button
              className="admin-btn money-btn"
              onClick={() => navigate("/admin/bizmoney/list")}
            >
              비즈머니 내역
            </button>
            <button
              className="admin-btn add-btn"
              onClick={() => navigate("/admin/member/register")}
            >
              회원 추가
            </button>
          </div>
        </div>

        {/* 테이블 섹션 - 요청하신 항목들로 구성 */}
        <div className="member-table-wrapper">
          <table className="member-table">
            <thead>
              <tr>
                <th>회원 이메일</th>
                <th>닉네임</th>
                <th>상호명 (회사)</th>
                <th>사업자 번호</th>
                <th>등록일</th>
                <th>활성화 상태</th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList && serverData.dtoList.length > 0 ? (
                serverData.dtoList.map((member) => (
                  <tr key={member.email} className="member-tr">
                    <td className="member-td-email">{member.email}</td>
                    <td>{member.nickname}</td>
                    <td className="company-td-name">
                      <strong>{member.companyName}</strong>
                    </td>
                    <td className="business-td-number">
                      {member.businessNumber}
                    </td>
                    <td className="member-td-date">
                      {member.regDate ? member.regDate.split("T")[0] : "-"}
                    </td>
                    <td className="member-td-status">
                      {/* 활성화 여부에 따라 다른 스타일 적용 */}
                      <span
                        className={`status-dot ${member.enabled === 1 ? "active" : "inactive"}`}
                      >
                        {member.enabled === 1 ? "활성" : "비활성"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    등록된 비즈니스 회원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 */}
        <div className="member-pagination-wrapper">
          <PageComponent serverData={serverData} movePage={moveToBoardList} />
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
