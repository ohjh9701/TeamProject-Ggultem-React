import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { postAdd, API_SERVER_HOST } from "../../../api/admin/MemberApi";
import "./RegisterComponent.css";

const host = API_SERVER_HOST;

const initState = {
  email: "",
  pw: "",
  nickname: "",
  social: false,
  phone: "",
  enabled: 0,
  regDate: null,
  files: [],
  uploadFileNames: [],
};

const RegisterPage = () => {
  const [member, setMember] = useState({ ...initState });
  const [imagePreview, setImagePreview] = useState(null);
  const nav = useNavigate();
  const uploadRef = useRef();

  // 사진 선택 시 미리보기 생성 함수
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // 읽어온 파일 데이터를 상태에 저장
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 클릭 시 input창 강제 클릭
  const handleClickImage = () => {
    uploadRef.current.click();
  };

  const handleChangeMember = (e) => {
    setMember({
      ...member,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickAdd = () => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("email", member.email);
    formData.append("pw", member.pw);
    formData.append("nickname", member.nickname);
    formData.append("phone", member.phone);

    postAdd(formData)
      .then((data) => {
        alert("회원 등록이 완료되었습니다.");
        nav(-1, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        alert("등록 실패: 입력 정보를 확인해주세요.");
      });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">신규 회원 등록</h2>

        <div className="register-form">
          {/* ✨ 동그란 프로필 이미지 업로드 구역 */}
          <div className="profile-upload-section">
            <div className="profile-image-wrapper" onClick={handleClickImage}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="profile-circle"
                />
              ) : (
                <div className="profile-placeholder">
                  <span>사진 추가</span>
                </div>
              )}
              <div className="camera-icon">📷</div>
            </div>
            {/* 실제 input은 숨김 처리 */}
            <input
              type="file"
              ref={uploadRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
          </div>
          {/* 이메일 입력 */}
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={member.email}
              onChange={handleChangeMember}
              placeholder="example@honey.com"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="pw"
              value={member.pw}
              onChange={handleChangeMember}
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {/* 닉네임 입력 */}
          <div className="form-group">
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={member.nickname}
              onChange={handleChangeMember}
              placeholder="멋진 닉네임을 지어주세요"
            />
          </div>

          {/* 전화번호 입력 */}
          <div className="form-group">
            <label>전화번호</label>
            <input
              type="text"
              name="phone"
              value={member.phone}
              onChange={handleChangeMember}
              placeholder="010-0000-0000"
            />
          </div>

          {/* 버튼 영역 */}
          <div className="register-buttons">
            <button className="btn-cancel" onClick={() => nav(-1)}>
              취소
            </button>
            <button className="btn-submit" onClick={handleClickAdd}>
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
