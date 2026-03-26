import { useEffect, useState } from "react";
import {
  getReplyList,
  addReply,
  modifyReply,
  removeReply,
} from "../../api/ItemBoardReplyApi";
import { useSelector } from "react-redux";
import "./ItemBoardReplyComponent.css"; // CSS 파일 임포트

const ItemBoardReplyComponent = ({ itemId }) => {
  const [replyList, setReplyList] = useState([]);
  const [content, setContent] = useState("");
  const [openReplyNo, setOpenReplyNo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [modifyReplyNo, setModifyReplyNo] = useState(null);
  const [modifyContent, setModifyContent] = useState("");

  const loginState = useSelector((state) => state.loginSlice);
  const email = loginState?.email;

  const loadReplies = () => {
    if (!itemId) return;
    getReplyList(itemId).then((data) => {
      setReplyList(data);
    });
  };

  useEffect(() => {
    loadReplies();
  }, [itemId]);

  const handleAddReply = () => {
    if (!email) return alert("로그인이 필요합니다.");
    if (!content.trim()) return alert("내용을 입력해주세요.");

    const replyObj = {
      itemId: Number(itemId),
      content: content,
      email: email,
      parentReplyNo: 0,
      enabled: 1,
    };

    addReply(replyObj)
      .then(() => {
        setContent("");
        loadReplies();
      })
      .catch(() => alert("등록 실패"));
  };

  const handleAddChildReply = (parentNo) => {
    if (!email) return alert("로그인이 필요합니다.");
    if (!replyContent.trim()) return alert("내용을 입력해주세요.");

    const childReplyObj = {
      itemId: Number(itemId),
      content: replyContent,
      email: email,
      parentReplyNo: Number(parentNo),
      enabled: 1,
    };

    addReply(childReplyObj).then(() => {
      setReplyContent("");
      setOpenReplyNo(null);
      loadReplies();
    });
  };

  const handleModify = (reply) => {
    setModifyReplyNo(reply.replyNo);
    setModifyContent(reply.content);
  };

  const handleModifySubmit = (replyNo) => {
    if (!modifyContent.trim()) return alert("내용을 입력해주세요.");
    const modifyObj = { replyNo, content: modifyContent, enabled: 1 };

    modifyReply(replyNo, modifyObj).then(() => {
      setModifyReplyNo(null);
      setModifyContent("");
      loadReplies();
    });
  };

  const handleDelete = (replyNo) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    removeReply(replyNo).then(() => loadReplies());
  };

  return (
    <div className="reply-container">
      <hr className="reply-divider" />
      <h3 className="reply-title">댓글 ({replyList.length})</h3>

      {/* 댓글 입력창 */}
      <div className="reply-input-section">
        <textarea
          className="reply-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="따뜻한 댓글을 남겨주세요"
        />
        <div className="reply-btn-group">
          <button className="reply-submit-btn" onClick={handleAddReply}>
            등록
          </button>
        </div>
      </div>

      {/* 댓글 리스트 */}
      <div className="reply-list">
        {replyList.map((reply) => (
          <div key={reply.replyNo} className="reply-item">
            <div className="reply-info">
              <span className="reply-writer">{reply.email}</span>
              <span className="reply-date">
                {reply.regDate ? reply.regDate.split("T")[0] : "방금 전"}
              </span>
            </div>

            <div className="reply-content-box">
              {modifyReplyNo === reply.replyNo ? (
                <div className="modify-box">
                  <textarea
                    className="modify-textarea"
                    value={modifyContent}
                    onChange={(e) => setModifyContent(e.target.value)}
                  />
                  <div className="modify-btns">
                    <button onClick={() => handleModifySubmit(reply.replyNo)}>
                      완료
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setModifyReplyNo(null)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`reply-text ${reply.enabled === 0 ? "deleted" : ""}`}
                >
                  {reply.enabled === 0 ? "삭제된 댓글입니다." : reply.content}
                </div>
              )}
            </div>

            {/* 댓글 액션 버튼 */}
            <div className="reply-actions">
              {reply.enabled !== 0 && (
                <>
                  {email && (
                    <button onClick={() => setOpenReplyNo(reply.replyNo)}>
                      답글
                    </button>
                  )}
                  {reply.email === email && (
                    <>
                      <button onClick={() => handleModify(reply)}>수정</button>
                      <button onClick={() => handleDelete(reply.replyNo)}>
                        삭제
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* 대댓글 입력창 */}
            {openReplyNo === reply.replyNo && (
              <div className="child-reply-input">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 입력하세요"
                />
                <div className="child-reply-btns">
                  <button onClick={() => handleAddChildReply(reply.replyNo)}>
                    등록
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setOpenReplyNo(null)}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 대댓글 리스트 */}
            {reply.childList && reply.childList.length > 0 && (
              <div className="child-reply-list">
                {reply.childList.map((child) => (
                  <div key={child.replyNo} className="child-reply-item">
                    <div className="reply-info">
                      <span className="reply-writer">ㄴ {child.email}</span>
                      <span className="reply-date">
                        {child.regDate
                          ? child.regDate.split("T")[0]
                          : "방금 전"}
                      </span>
                    </div>
                    <div className="reply-content-box">
                      {modifyReplyNo === child.replyNo ? (
                        <div className="modify-box">
                          <input
                            className="modify-input"
                            value={modifyContent}
                            onChange={(e) => setModifyContent(e.target.value)}
                          />
                          <button
                            onClick={() => handleModifySubmit(child.replyNo)}
                          >
                            완료
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`reply-text ${child.enabled === 0 ? "deleted" : ""}`}
                        >
                          {child.enabled === 0
                            ? "삭제된 댓글입니다."
                            : child.content}
                        </div>
                      )}
                    </div>
                    {child.enabled !== 0 && child.email === email && (
                      <div className="reply-actions small">
                        <button onClick={() => handleModify(child)}>
                          수정
                        </button>
                        <button onClick={() => handleDelete(child.replyNo)}>
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemBoardReplyComponent;
