import { useRef, useState, useEffect } from "react";
import { postItemBoardAdd, getMyPage } from "../../../api/BusinessApi";
import { useNavigate } from "react-router";
import useCustomLogin from "../../../hooks/useCustomLogin";
import "./RegisterComponent.css";

const initState = {
  title: "",
  price: 0,
  content: "",
  category: "",
  email: "",
  writer: "",
  moveUrl: "",
  sign: false,
  regDate: null,
  endDate: "",
  files: [],
  uploadFileNames: [],
};

const initStateMember = {
  email: "",
  pw: "",
  nickname: "",
  phone: "",
  businessNumber: "",
  companyName: "",
  businessVerified: false,
  bizMoney: 0,
  roleNames: [],
  regDate: null,
  dtdDate: null,
  stopDate: null,
  stopEndDate: null,
  uploadFileNames: [],
};

const RegisterComponent = () => {
  const { loginState } = useCustomLogin();
  const navigate = useNavigate();
  const uploadRef = useRef();

  const [fetching, setFetching] = useState(false);
  const [member, setMember] = useState({ ...initStateMember });
  const [item, setItem] = useState({ ...initState });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    getMyPage(loginState.email).then((data) => {
      setMember(data);
    });
  }, [loginState.email]);

  // 이미지 선택 시 미리보기 생성
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // 브라우저 메모리에 임시 URL 생성
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    // 기존 미리보기와 합치기 (새로 선택할 때마다 추가됨)
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // 특정 미리보기 삭제
  const removeImage = (index) => {
    setImagePreviews((prev) => {
      const target = prev[index];
      URL.revokeObjectURL(target.url); // 메모리 해제
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleChangeItem = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleClickAdd = () => {
    console.log("현재 item 상태:", item);
    const formData = new FormData();

    // 이미지 추가
    imagePreviews.forEach((imgObj) => {
      formData.append("files", imgObj.file);
    });

    // 2. DTO 필드명과 일치시키기 (중요)
    formData.append("email", loginState.email); // 백엔드 ItemBoardDTO의 private String email; 과 매칭
    formData.append("writer", member.companyName);
    formData.append("title", item.title);
    formData.append("price", Number(item.price));
    formData.append("content", item.content);
    formData.append("category", item.category);
    formData.append("moveUrl", item.moveUrl);

    formData.append("endDate", item.endDate || "9999-12-31 23:59:59");

    console.log("폼데이터 확인용:", formData.get("endDate"));

    setFetching(true);
    postItemBoardAdd(formData)
      .then((data) => {
        setFetching(false);
        alert("등록 완료!");
        navigate("/business/list");
      })
      .catch((err) => {
        setFetching(false);
        // 서버에서 보낸 상세 에러 메시지 출력
        console.error("에러 상세:", err.response?.data);
        alert("등록 중 오류 발생!");
      });
  };

  return (
    <div className="business-register-container">
      <div className="business-register-form">
        <h2 className="business-form-title">광고 상품 등록</h2>

        <div className="business-form-group">
          <label>판매자 정보</label>
          <input
            type="text"
            value={`${member.companyName} (${member.email})`}
            readOnly
            className="business-read-only-input"
          />
        </div>

        <div className="business-form-row">
          <div className="business-form-group">
            <label>상품 제목</label>
            <input
              name="title"
              type="text"
              value={item.title}
              onChange={handleChangeItem}
              placeholder="노출될 상품 제목"
            />
          </div>
          <div className="business-form-group">
            <label>광고 종류</label>
            <select
              name="category"
              value={item.category}
              onChange={handleChangeItem}
            >
              <option value="">선택하세요</option>
              <option value="powershoping">파워쇼핑</option>
              <option value="powerlink">파워링크</option>
            </select>
          </div>
        </div>

        <div className="business-form-row">
          <div className="business-form-group">
            <label>판매 가격 (원)</label>
            <input
              name="price"
              type="number"
              value={item.price}
              onChange={handleChangeItem}
            />
          </div>
          {/* 🚩 광고 종료일 설정 영역 */}
          <div className="business-form-group">
            <label>광고 종료일</label>
            <input
              name="endDate"
              type="datetime-local"
              value={item.endDate || ""}
              onChange={handleChangeItem}
              // 현재 시간(분 단위까지) 이전은 선택 못하게 설정
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        <div className="business-form-group">
          <label>실제 상품 URL</label>
          <input
            name="moveUrl"
            type="text"
            value={item.moveUrl}
            onChange={handleChangeItem}
            placeholder="상품을 연결할 URL을 입력해 주세요"
          ></input>
        </div>
        <div className="business-form-group">
          <label>상세 설명</label>
          <textarea
            name="content"
            value={item.content}
            onChange={handleChangeItem}
            rows="6"
            placeholder="상품에 대한 전문적인 설명을 작성해주세요."
          ></textarea>
        </div>

        <div className="business-form-group">
          <label>상품 이미지 (다중 선택 가능)</label>
          <input
            ref={uploadRef}
            type="file"
            multiple={true}
            accept="image/*"
            onChange={handleFileChange}
            id="business-file-upload"
            hidden
          />
          <label htmlFor="business-file-upload" className="business-file-label">
            파일 탐색기 열기
          </label>
        </div>

        {/* 이미지 미리보기 */}
        {imagePreviews.length > 0 && (
          <div className="business-image-preview-container">
            {imagePreviews.map((imgObj, index) => (
              <div key={index} className="business-preview-item">
                <img src={imgObj.url} alt={`preview-${index}`} />
                <button type="button" onClick={() => removeImage(index)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="business-button-group">
          <button
            className="business-submit-btn"
            type="button"
            onClick={handleClickAdd}
            disabled={fetching}
          >
            {fetching ? "등록 처리 중..." : "광고 등록 승인 요청"}
          </button>
          <button
            className="business-cancel-btn"
            type="button"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
