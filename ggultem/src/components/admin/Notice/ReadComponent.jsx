import { useEffect, useState } from "react";
import { getOne } from "../../../api/NoticeApi";
import useCustomMove from "../../../hooks/useCustomMove";
import { API_SERVER_HOST } from "../../../api/config";
import "./ReadComponent.css";
import RemoveComponent from "./RemoveComponent";

const ReadComponent = ({ noticeId }) => {
  const [notice, setNotice] = useState({
    noticeId: 0,
    title: "",
    content: "",
    writer: "",
    regDate: "",
    visitCount: 0,
    uploadFileNames: [],
    isPinned: 0,
  });
  const { moveToAdminNoticeList, moveToAdminNoticeModify } = useCustomMove();

  useEffect(() => {
    getOne(noticeId).then((data) => setNotice(data));
  }, [noticeId]);

  return (
    <div className="admin-main-wrapper">
      <div className="admin-content-box board-read-type">
        {/* 1. 헤더 영역 (게시판 제목 스타일) */}
        <div className="board-header">
          <div className="board-category">
            {notice.isPinned === 1 ? (
              <span className="pin-badge">중요공지</span>
            ) : (
              <span className="normal-badge">공지</span>
            )}
            <span className="notice-no">No.{notice.noticeId}</span>
          </div>
          <h2 className="board-title">{notice.title}</h2>
          <div className="board-meta">
            <span className="meta-item">
              작성자: <b>{notice.writer}</b>
            </span>
            <span className="meta-divider">|</span>
            <span className="meta-item">등록일: {notice.regDate}</span>
            <span className="meta-divider">|</span>
            <span className="meta-item">조회수: {notice.visitCount}</span>
          </div>
        </div>

        {/* 2. 본문 영역 (이미지와 글이 수직으로 배치) */}
        <div className="board-body">
          {/* 첨부 이미지 상단 노출 */}
          <div className="board-image-gallery">
            {notice.uploadFileNames
              ?.filter((fn) => fn && fn !== "null")
              .map((fileName, i) => (
                <img
                  key={i}
                  src={`${API_SERVER_HOST}/admin/notice/view/${fileName}`}
                  alt="공지이미지"
                  className="full-width-img"
                />
              ))}
          </div>

          <div className="board-text-content">{notice.content}</div>
        </div>

        {/* 3. 푸터 영역 (버튼들) */}
        <div className="board-footer">
          <div className="footer-left">
            <button className="white-btn" onClick={moveToAdminNoticeList}>
              목록으로
            </button>
          </div>
          <div className="footer-right">
            <button
              className="yellow-btn"
              onClick={() => moveToAdminNoticeModify(noticeId)}
            >
              수정하기
            </button>
            <RemoveComponent noticeId={noticeId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadComponent;
