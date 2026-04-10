import { useRef, useState, useEffect } from "react";
import { postAdd } from "../../../api/ItemBoardApi";
import { useNavigate } from "react-router";
import useCustomLogin from "../../../hooks/useCustomLogin";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import "./AdminRegisterComponent.css";

const initState = {
  title: "",
  price: 0,
  content: "",
  category: "",
  location: "",
  lat: 37.5665,
  lng: 126.978,
};

const ItemBoardRegister = () => {
  const { loginState, isLogin, moveToLogin } = useCustomLogin();
  const navigate = useNavigate();
  const uploadRef = useRef();
  const [searchKey, setSearchKey] = useState("");
  const [fetching, setFetching] = useState(false);
  const [item, setItem] = useState({ ...initState });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (!isLogin) {
      alert("로그인이 필요한 서비스입니다.");
      moveToLogin();
    }
  }, [isLogin, moveToLogin]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => {
      const target = prev[index];
      URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleChangeItem = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleClickAdd = () => {
    if (!loginState.email) {
      alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
      return;
    }

    const formData = new FormData();
    imagePreviews.forEach((imgObj) => {
      formData.append("files", imgObj.file);
    });

    formData.append("email", loginState.email);
    formData.append("writer", loginState.nickname || loginState.name);
    formData.append("title", item.title);
    formData.append("price", Number(item.price));
    formData.append("content", item.content);
    formData.append("category", item.category);
    formData.append("location", item.location);
    formData.append("lat", item.lat);
    formData.append("lng", item.lng);

    setFetching(true);
    postAdd(formData)
      .then((data) => {
        setFetching(false);
        alert("등록 완료!");
        navigate("/admin/itemBoard/list");
      })
      .catch((err) => {
        setFetching(false);
        alert("등록 중 오류 발생!");
      });
  };

  if (!isLogin) return null;

  const handleSearchAddress = () => {
    if (!searchKey.trim()) {
      alert("검색어를 입력하세요!");
      return;
    }
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(searchKey, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const newLat = result[0].y;
        const newLng = result[0].x;
        const regionName =
          result[0].address.region_2depth_name ||
          result[0].address.region_3depth_name;

        setItem((prev) => ({
          ...prev,
          lat: parseFloat(newLat),
          lng: parseFloat(newLng),
          location: regionName,
        }));
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>상품 등록</h2>

        <div className="form-group">
          <label>판매자</label>
          <input
            type="text"
            value={`${loginState.nickname} (${loginState.email})`}
            readOnly
            className="read-only-input"
          />
        </div>

        <div className="form-group">
          <label>제목</label>
          <input
            name="title"
            type="text"
            value={item.title}
            onChange={handleChangeItem}
            placeholder="상품 제목을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>가격</label>
          <input
            name="price"
            type="number"
            value={item.price}
            onChange={handleChangeItem}
          />
        </div>

        <div className="form-group">
          <label>카테고리</label>
          <select
            name="category"
            value={item.category}
            onChange={handleChangeItem}
          >
            <option value="">선택하세요</option>
            <option value="electronics">전자제품</option>
            <option value="clothing">의류</option>
            <option value="sports">스포츠</option>
            <option value="books">도서</option>
            <option value="health">건강식품</option>
            <option value="furniture">가구</option>
          </select>
        </div>

        <div className="form-group">
          <label>거래 희망 장소 (검색 후 마커를 조정하세요)</label>

          <div className="address-search-group">
            <input
              className="address-search-input"
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchAddress()}
              placeholder="동네 이름이나 주소 검색 (예: 강남역, 화양동)"
            />
            <button
              className="address-search-btn"
              type="button"
              onClick={handleSearchAddress}
            >
              검색
            </button>
          </div>

          <div className="map-display-area">
            <Map center={{ lat: item.lat, lng: item.lng }} level={3}>
              <MapMarker
                position={{ lat: item.lat, lng: item.lng }}
                draggable={true}
                onDragEnd={(marker) => {
                  const newLat = marker.getPosition().getLat();
                  const newLng = marker.getPosition().getLng();
                  const geocoder = new window.kakao.maps.services.Geocoder();
                  geocoder.coord2Address(newLng, newLat, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                      const regionName = result[0].address.region_2depth_name;
                      setItem((prev) => ({
                        ...prev,
                        lat: newLat,
                        lng: newLng,
                        location: regionName,
                      }));
                    }
                  });
                }}
              />
            </Map>
          </div>

          <div className="selected-location-info">
            <span>
              설정된 지역:{" "}
              {item.location || "지도에서 검색하거나 마커를 옮겨주세요."}
            </span>
            <input type="hidden" name="location" value={item.location} />
          </div>
        </div>

        <div className="form-group">
          <label>상세 설명</label>
          <textarea
            name="content"
            value={item.content}
            onChange={handleChangeItem}
            rows="5"
            placeholder="상품에 대한 상세 설명을 작성해주세요"
          ></textarea>
        </div>

        <div className="form-group">
          <label>이미지 첨부</label>
          <input
            ref={uploadRef}
            type="file"
            multiple={true}
            accept="image/*"
            onChange={handleFileChange}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="file-label">
            이미지 선택하기
          </label>
        </div>

        {imagePreviews.length > 0 && (
          <div className="image-preview-container">
            {imagePreviews.map((imgObj, index) => (
              <div key={index} className="preview-item">
                <img src={imgObj.url} alt={`preview-${index}`} />
                <button
                  type="button"
                  className="remove-prev-btn"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="button-group">
          <button
            className="submit-btn"
            type="button"
            onClick={handleClickAdd}
            disabled={fetching}
          >
            {fetching ? "등록 중..." : "상품 등록하기"}
          </button>
          <button
            className="submit-btn"
            type="button"
            onClick={() => navigate(-1)}
            disabled={fetching}
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemBoardRegister;
