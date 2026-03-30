import axios from "axios";
import { API_SERVER_HOST } from "../config";

// 1. host 자체를 export 합니다. (빨간 줄 방지 + 주소 공유)
export const host = `${API_SERVER_HOST}/admin/report`;

/**
 * 2. 관리자: 전체 신고 목록 조회
 */
export const getReportList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${host}/list`, {
    params: { page, size },
  });
  return res.data;
};

/**
 * 3. 관리자: 특정 신고 상세 조회
 */
export const getOneReport = async (reportId) => {
  // ID 뒤에 붙은 쿼리스트링 제거
  const cleanId = String(reportId).split("?")[0];
  const res = await axios.get(`${host}/${cleanId}`);
  return res.data;
};

/**
 * 4. 관리자: 신고 처리 완료
 */
export const completeReportProcess = async (processedDTO) => {
  const res = await axios.post(`${host}/process`, processedDTO);
  return res.data;
};

/**
 * 5. 사용자: 신고 접수 (추가)
 */
export const postReport = async (reportData) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  const formData = new FormData();

  // 파일 외의 데이터들을 추가
  formData.append("memberEmail", reportData.memberEmail);
  formData.append("reportType", reportData.reportType);
  formData.append("reason", reportData.reason);
  formData.append("targetType", reportData.targetType);
  formData.append("targetNo", reportData.targetNo);

  // 파일들 추가
  if (reportData.files && reportData.files.length > 0) {
    for (let i = 0; i < reportData.files.length; i++) {
      formData.append("files", reportData.files[i]);
    }
  }

  const res = await axios.post(`${host}/`, formData, header);
  return res.data;
};
