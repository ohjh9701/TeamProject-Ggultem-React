import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getOne, deleteOne, API_SERVER_HOST } from "../../../api/ItemBoardApi";
import "./AdminReadComponent.css";

const AdminReadComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    getOne(id).then((data) => setItem(data));
  }, [id]);

  if (!item) return <div className="admin-main-wrapper">로딩 중...</div>;

  return (
    <div className="admin-main-wrapper">
      <div className="admin-content-box">
        {/* 상단 헤더 */}
        <div className="admin-header">
          <h3 className="admin-title">
            상품 상세 관리 <span className="yellow-point">No.{item.id}</span>
          </h3>
          <div className="btn-group">
            <button
              className="white-btn"
              onClick={() => navigate("/admin/itemBoard/list")}
            >
              목록으로
            </button>
            <button
              className="red-btn"
              onClick={() => {
                if (window.confirm("삭제하시겠습니까?"))
                  deleteOne(id).then(() => navigate("/admin/itemBoard/list"));
              }}
            >
              강제 삭제
            </button>
          </div>
        </div>

        {/* 메인 상단: 이미지와 상품 핵심 정보 */}
        <div className="product-main-section">
          <div className="image-area">
            <div className="img-holder">
              {item.uploadFileNames?.[0] ? (
                <img
                  src={`${API_SERVER_HOST}/itemBoard/view/${item.uploadFileNames[0]}`}
                  alt="상품이미지"
                />
              ) : (
                <div className="no-img">이미지 없음</div>
              )}
            </div>
          </div>

          <div className="product-info-area">
            <div className="info-label-group">
              <span className="cat-badge">{item.category}</span>
              <span className="location-text">
                📍 {item.location || "지역 정보 없음"}
              </span>
            </div>
            <h2 className="item-title">{item.title}</h2>
            <div className="item-price">{item.price?.toLocaleString()}원</div>

            <div className="item-description-box">
              <label>상품 설명</label>
              <div className="item-content">{item.content}</div>
            </div>
            <div className="reg-date-info">등록일: {item.regDate}</div>
          </div>
        </div>

        {/* 메인 하단: 회원 및 보안 정보 (가로형 배치) */}
        <div className="member-detail-section">
          <h4 className="section-title">판매자 및 보안 정보</h4>
          <div className="member-info-grid">
            <div className="member-field">
              <label>아이디(이메일)</label>
              <span>{item.email}</span>
            </div>
            <div className="member-field">
              <label>비밀번호</label>
              <span>{item.pw || "********"}</span>
            </div>
            <div className="member-field">
              <label>닉네임</label>
              <span>{item.member?.nickname || item.writer}</span>
            </div>
            <div className="member-field">
              <label>연락처</label>
              <span>{item.member?.phone || item.phone || "정보 없음"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReadComponent;
