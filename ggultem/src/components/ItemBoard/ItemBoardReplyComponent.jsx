import { useEffect, useState } from "react";
import {
  getReplyList,
  addReply,
  modifyReply,
  removeReply,
} from "../../api/ItemBoardReplyApi";
import useReport from "../../hooks/useReport";
import ReportModal from "../../common/ReportModal";
import { useSelector } from "react-redux";
import "./ItemBoardReplyComponent.css";

const ItemBoardReplyComponent = ({ itemId }) => {
  const [replyList, setReplyList] = useState([]);
  const [content, setContent] = useState("");
  const [openReplyNo, setOpenReplyNo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [modifyReplyNo, setModifyReplyNo] = useState(null);
  const [modifyContent, setModifyContent] = useState("");

  const { showModal, setShowModal, sendReport } = useReport();
  const loginState = useSelector((state) => state.loginSlice);
  const email = loginState?.email;

  const loadReplies = () => {
    if (!itemId) return;
    getReplyList(itemId).then((data) => {
      console.log("서버에서 온 데이터:", data);
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
    removeReply(replyNo).then(() => {
      loadReplies();
    });
  };
  const [targetData, setTargetData] = useState(null);
  const sendTargetData = (reply) => {
    setTargetData({
      targetType: "거래게시판",
      targetNo: Number(reply.replyNo),
      targetMemberId: reply.email,
    });
  };

  return (
    <div className="reply-container">
      <hr className="reply-divider" />
      <h3 className="reply-title">댓글 ({replyList.length})</h3>
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
      <div className="reply-list">
        {replyList.map((reply) => (
          <div key={reply.replyNo} className="reply-item">
            <div className="reply-info">
              <span className="reply-writer">
                {reply.enabled == 0
                  ? reply.nickname
                  : reply.nickname || reply.email}
              </span>
              <span className="reply-date">
                {reply.regDate ? reply.regDate.split(" ")[0] : "방금 전"}
              </span>
            </div>

            <div className="reply-content-box">
              {Number(reply.enabled) === 0 ? (
                <div className="reply-text deleted-text">
                  <span className="text-muted">🔒 삭제된 댓글입니다.</span>
                </div>
              ) : modifyReplyNo === reply.replyNo ? (
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
                <div className="reply-text">{reply.content}</div>
              )}
            </div>

            <div className="reply-actions">
              {Number(reply.enabled) === 1 && (
                <>
                  {email && (
                    <button onClick={() => setOpenReplyNo(reply.replyNo)}>
                      답글
                    </button>
                  )}

                  {email && reply.email !== email && (
                    <button
                      onClick={() => {
                        sendTargetData(reply);
                        setShowModal(true);
                      }}
                      className="btn-report"
                    >
                      신고하기
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

            {reply.childList && reply.childList.length > 0 && (
              <div className="child-reply-list">
                {reply.childList.map((child) => (
                  <div key={child.replyNo} className="child-reply-item">
                    <div className="reply-info">
                      <span className="reply-writer">
                        ㄴ{" "}
                        {child.enabled == 0
                          ? child.nickname
                          : child.nickname || child.email}
                      </span>
                      <span className="reply-date">
                        {child.regDate
                          ? child.regDate.split(" ")[0]
                          : "방금 전"}
                      </span>
                    </div>

                    <div className="reply-content-box">
                      {Number(child.enabled) === 0 ? (
                        <div className="reply-text deleted-text">
                          <span className="text-muted">삭제된 댓글입니다.</span>
                        </div>
                      ) : modifyReplyNo === child.replyNo ? (
                        <div className="modify-box">
                          <input
                            className="modify-input"
                            value={modifyContent}
                            onChange={(e) => setModifyContent(e.target.value)}
                          />
                          <div className="modify-btns">
                            <button
                              onClick={() => handleModifySubmit(child.replyNo)}
                            >
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
                        <div className="reply-text">{child.content}</div>
                      )}
                    </div>
                    <div className="reply-actions">
                      {email && child.email !== email && (
                        <button
                          onClick={() => {
                            sendTargetData(child);
                            setShowModal(true);
                          }}
                          className="btn-report"
                        >
                          신고하기
                        </button>
                      )}
                    </div>
                    {Number(child.enabled) === 1 && child.email === email && (
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
      <ReportModal
        show={showModal}
        targetData={targetData}
        callbackFn={() => setShowModal(false)}
        submitFn={sendReport}
      />
    </div>
  );
};

export default ItemBoardReplyComponent;
