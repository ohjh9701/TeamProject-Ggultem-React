import React, { useState, useEffect, useRef } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { getChatMessages, getChatRoom, updateReadStatus, leaveChatRoom } from "../../api/ChatApi"; // ✨ 과거 내역 API 추가
import useCustomLogin from "../../hooks/useCustomLogin";
import "./ChatComponent.css";
import useReport from "../../hooks/useReport";
import ReportModal from "../../common/ReportModal";
import { useNavigate } from "react-router";

// 시간 포맷 함수 (서버의 regDate 형식에 맞춰 조정 가능)
const formatTime = (regDate) => {
  if (!regDate) return "";
  const date = new Date(regDate);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const ChatComponent = ({ roomId }) => {
  const [chatRoom, setChatRoom] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { loginState } = useCustomLogin();
  const stompClient = useRef(null);
  const scrollRef = useRef();
  const navigate = useNavigate();

  const { showModal, setShowModal, sendReport } = useReport();

  const targetData = {
    targetType: "채팅", // Notice인지 reply인지 등
    targetNo: roomId, // targetNo에 해당하는 변수명
    targetMemberId:
      chatRoom.sellerId === loginState.email
        ? chatRoom.buyerId
        : chatRoom.sellerId,
  };

  useEffect(() => {
    getChatRoom(roomId).then((data) => {
      setChatRoom(data);
    });
  });

  // 스크롤 하단 이동 로직
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    // 1. 과거 메시지 불러오기
    const fetchHistory = async () => {
      try {
        const data = await getChatMessages(roomId);
        setMessages(data); // 서버에서 받아온 List<ChatMessageDTO>를 상태에 저장
      } catch (err) {
        console.error("과거 내역 로드 실패:", err);
      }
    };
    fetchHistory();

    // 2. 소켓 연결 및 구독
    const socket = new SockJS("https://api.ggultem.shop/ws");
    const client = Stomp.over(socket);
    client.debug = null; // 콘솔 로그 숨기기 (선택)

    client.connect({}, () => {
      client.subscribe(`/topic/chat/${roomId}`, (msg) => {
        const receivedMessage = JSON.parse(msg.body);
        setMessages((prev) => [...prev, receivedMessage]);
      });
    });

    stompClient.current = client;

    return () => {
      if (stompClient.current) stompClient.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() && stompClient.current?.connected) {
      const chatMessage = {
        roomId: roomId, // ✨ 서버 DTO에 맞게 추가
        senderId: loginState.email,
        content: message,
        isRead: 0,
        regDate: new Date().toISOString(), // 실시간 표시용 임시 시간
      };

      stompClient.current.send(
        `/app/chat.sendMessage/${roomId}`,
        {},
        JSON.stringify(chatMessage),
      );
      setMessage("");
    }
  };

useEffect(() => {
  if (!roomId || !loginState.email) return;

  const fetchHistoryAndRead = async () => {
    try {
      // 1. 과거 내역 가져오기
      const data = await getChatMessages(roomId);
      setMessages(data);

      // 2. ✨ 읽음 처리 API 호출! (상대방이 보낸 메시지 0 -> 1)
      await updateReadStatus(roomId, loginState.email);
      console.log("읽음 처리 완료! 🐝");

    } catch (err) {
      console.error("채팅방 로딩 중 에러:", err);
    }
  };

  fetchHistoryAndRead();

  // ... (기존 소켓 연결 로직)
}, [roomId, loginState.email]);

const handleLeaveRoom = async (roomId) => {
  if (!window.confirm("정말 이 채팅방을 나가시겠습니까?\n나간 후에는 이전 대화 내용을 볼 수 없습니다. 🧤")) return;

  try {
    // 백엔드 API 호출 (아까 만든 로직)
    await leaveChatRoom(roomId, loginState.email); 
    
    alert("채팅방에서 나갔습니다. 🐝");
    
    // 나가기 성공 후 채팅 목록 페이지로 이동
    navigate("/chatroom/list", { replace: true }); 
  } catch (error) {
    console.error("나가기 실패:", error);
    alert("처리 중 오류가 발생했습니다.");
  }
};

  return (
    <div className="chat-container">
      <header className="chat-header">
      <div className="chat-header-left">
        <button className="btn-back" onClick={() => navigate(-1)}>〈</button>
        <h2>{chatRoom.roomName || "꿀템 채팅"}</h2>
      </div>
      
      <div className="chat-header-right">
        <button 
          className="btn-leave-room" 
          onClick={() => handleLeaveRoom(roomId)}
          title="채팅방 나가기"
        >
          나가기
        </button>
      </div>
    </header>
      <div className="message-area" ref={scrollRef}>
        <ul className="message-list">
          {messages.map((msg, index) => {
            // 본인 확인 로직 (senderId로 비교)
            const isMyMessage = msg.senderId === loginState.email;
            return (
              <li
                key={index}
                className={`message-item ${isMyMessage ? "my-message" : "other-message"}`}
              >
                <div className="message-content">
                  {!isMyMessage && (
                    <span className="user-name">{msg.senderId}</span>
                  )}
                  <div className="bubble-wrapper">
                    <p className="text-bubble">{msg.content}</p>
                    <span className="chat-timestamp">
                      {formatTime(msg.regDate)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <footer className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="꿀템 메시지를 입력하세요..."
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          className="btn-send"
        >
          전송
        </button>
        <button onClick={() => setShowModal(true)} className="btn-report">
          신고
        </button>
      </footer>
      <ReportModal
        show={showModal}
        targetData={targetData}
        callbackFn={() => setShowModal(false)}
        submitFn={sendReport}
      />
    </div>
  );
};

export default ChatComponent;
