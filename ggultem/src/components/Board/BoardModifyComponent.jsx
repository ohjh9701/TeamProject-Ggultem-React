import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOne, modifyBoard } from "../../api/BoardApi";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const BoardModifyComponent = () => {

  const { boardNo } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const editorRef = useRef();

  //  기존 데이터 불러오기
  useEffect(() => {
    getOne(boardNo).then(data => {

      console.log(" 불러온 데이터:", data);

      setTitle(data.title || "");

      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.getInstance().setHTML(data.content || "");
        }
      }, 300);

    });
  }, [boardNo]);

  //  수정 실행
  const handleModify = () => {

    const content = editorRef.current?.getInstance().getHTML() || "";

    console.log("🔥 수정 content:", content);
    console.log("🔥 수정 직전 값:", {
      title,
      content
    });

    if (!title || !content) {
      alert("제목/내용 입력");
      return;
    }

    const boardObj = {
      title: title || "",
      content: content || "",
    };

    modifyBoard(boardNo, boardObj).then(() => {
      alert("수정 완료");
      navigate(`/board/read/${boardNo}`);
    });
  };
  return (
    <div>
      <h2>게시글 수정</h2>

      {/* 제목 */}
      <input
        type="text"
        value={title || ""}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* 에디터 */}
      <Editor
        ref={editorRef}
        previewStyle="tab"
        initialEditType="wysiwyg"
        height="400px"
        key={boardNo}
      />

      {/* 버튼 */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleModify}>수정</button>
        <button onClick={() => navigate(-1)}>취소</button>
      </div>
    </div>
  );
};

export default BoardModifyComponent;