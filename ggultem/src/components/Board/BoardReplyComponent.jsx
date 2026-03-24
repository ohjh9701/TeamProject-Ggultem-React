import { useEffect, useState } from "react";
import {
  getReplyList,
  addReply,
  modifyReply,
  removeReply
} from "../../api/BoardReplyApi";
import { useSelector } from "react-redux";

const BoardReplyComponent = ({ boardNo }) => {

  const [replyList, setReplyList] = useState([]);
  const [content, setContent] = useState("");

  const [openReplyNo, setOpenReplyNo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const [modifyReplyNo, setModifyReplyNo] = useState(null);
  const [modifyContent, setModifyContent] = useState("");

  // 로그인 정보
  const loginState = useSelector(state => state.loginSlice);
  const email = loginState?.email;

  // 댓글 리스트
  const loadReplies = () => {
    getReplyList(boardNo).then((data) => {
      setReplyList(data);
    });
  };

  useEffect(() => {
    loadReplies();
  }, [boardNo]);

  // 댓글 등록
  const handleAddReply = () => {
    if (!email) return alert("로그인이 필요합니다.");
    if (!content.trim()) return alert("내용 입력");

    addReply({
      boardNo,
      content,
      email,
      parentReplyNo: null
    }).then(() => {
      setContent("");
      loadReplies();
    });
  };

  // 대댓글 등록
  const handleAddChildReply = (parentNo) => {
    if (!email) return alert("로그인이 필요합니다.");
    if (!replyContent.trim()) return alert("내용 입력");

    addReply({
      boardNo,
      content: replyContent,
      email,
      parentReplyNo: parentNo
    }).then(() => {
      setReplyContent("");
      setOpenReplyNo(null);
      loadReplies();
    });
  };

  // 수정 시작
  const handleModify = (reply) => {
    setModifyReplyNo(reply.replyNo);
    setModifyContent(reply.content);
  };

  // 수정 완료
  const handleModifySubmit = (replyNo) => {
    if (!modifyContent.trim()) return alert("내용 입력");

    modifyReply(replyNo, modifyContent).then(() => {
      setModifyReplyNo(null);
      setModifyContent("");
      loadReplies();
    });
  };

  // 삭제
  const handleDelete = (replyNo) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    removeReply(replyNo).then(() => {
      loadReplies();
    });
  };

  return (
    <div className="reply-wrapper">
      <h3>댓글</h3>

      {/* 댓글 입력 */}
      <div style={{ marginBottom: "20px" }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글 입력"
          style={{ width: "100%", height: "80px" }}
        />
        <button type="button" onClick={handleAddReply}>등록</button>
      </div>

      {/* 댓글 리스트 */}
      {replyList.map((reply) => (
        <div key={reply.replyNo} style={{ marginBottom: "20px" }}>

          <div style={{ borderBottom: "1px solid #ddd" }}>
            <strong>{reply.email}</strong>

            {/* 내용 or 수정 */}
            {modifyReplyNo === reply.replyNo ? (
              <>
                <textarea
                  value={modifyContent}
                  onChange={(e) => setModifyContent(e.target.value)}
                />
                <button type="button" onClick={() => handleModifySubmit(reply.replyNo)}>완료</button>
                <button type="button" onClick={() => setModifyReplyNo(null)}>취소</button>
              </>
            ) : (
              <div>
                {reply.enabled === 0 ? "삭제된 댓글입니다" : reply.content}
              </div>
            )}

            {/*  답글쓰기 (로그인만) */}
            {reply.enabled !== 0 && email && (
              <button
                type="button"
                onClick={() => setOpenReplyNo(reply.replyNo)}
              >
                답글쓰기
              </button>
            )}

            {/*  수정/삭제 (작성자만) */}
            {reply.enabled !== 0 && reply.email === email && (
              <>
                <button type="button" onClick={() => handleModify(reply)}>수정</button>
                <button type="button" onClick={() => handleDelete(reply.replyNo)}>삭제</button>
              </>
            )}
          </div>

          {/* 대댓글 입력 */}
          {openReplyNo === reply.replyNo && (
            <div style={{ marginLeft: "20px" }}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <button type="button" onClick={() => handleAddChildReply(reply.replyNo)}>등록</button>
              <button type="button" onClick={() => setOpenReplyNo(null)}>취소</button>
            </div>
          )}

          {/* 대댓글 리스트 */}
          <div style={{ marginLeft: "20px" }}>
            {reply.childList?.map((child) => (
              <div key={child.replyNo}>

                <strong>{child.email}</strong>

                {modifyReplyNo === child.replyNo ? (
                  <>
                    <textarea
                      value={modifyContent}
                      onChange={(e) => setModifyContent(e.target.value)}
                    />
                    <button type="button" onClick={() => handleModifySubmit(child.replyNo)}>완료</button>
                    <button type="button" onClick={() => setModifyReplyNo(null)}>취소</button>
                  </>
                ) : (
                  <div>
                    {child.enabled === 0 ? "삭제된 댓글입니다" : child.content}
                  </div>
                )}

                {/* 수정/삭제 */}
                {child.enabled !== 0 && child.email === email && (
                  <>
                    <button type="button" onClick={() => handleModify(child)}>수정</button>
                    <button type="button" onClick={() => handleDelete(child.replyNo)}>삭제</button>
                  </>
                )}

              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
};

export default BoardReplyComponent;