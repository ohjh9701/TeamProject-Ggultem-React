import "./PageComponent.css"; // CSS 파일 임포트

const PageComponent = ({ serverData, moveToList }) => {
  return (
    <div className="pagination-container">
      <ul className="pagination-list">
        {/* 이전 페이지 버튼 */}
        {serverData.prev && (
          <li
            className="page-item page-nav"
            onClick={() => moveToList({ page: serverData.prevPage })}
          >
            &lt;
          </li>
        )}

        {/* 페이지 번호 목록 */}
        {(serverData.pageNumList || []).map((pageNum) => (
  <li
    key={pageNum}
    className={`page-item ${serverData.current === pageNum ? "active" : ""}`}
    onClick={() => moveToList({ page: pageNum })}
  >
    {pageNum}
  </li>
))}

        {/* 다음 페이지 버튼 */}
        {serverData.next && (
          <li
            className="page-item page-nav"
            onClick={() => moveToList({ page: serverData.nextPage })}
          >
            &gt;
          </li>
        )}
      </ul>
    </div>
  );
};
export default PageComponent;
