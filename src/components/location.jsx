import React, { useEffect, useRef, useState } from "react";
import { Divider } from "antd";
import styled from "styled-components";
import Flower from "../assets/flower2.png";
import { KAKAO_API_TOKEN } from "../../config";

const Wrapper = styled.div`
  padding-top: 42px;
  width: 70%;
  margin: 0 auto;
`;

const Title = styled.span`
  font-size: 1rem;
  color: var(--title-color);
  font-weight: bold;
  opacity: 0.85;
  margin-bottom: 0;
`;

const Image = styled.img`
  display: block;
  margin: 0 auto;
  width: 1.375rem;
  padding-bottom: 42px;
`;

const Content = styled.p`
  font-size: 0.875rem;
  line-height: 1.75;
  opacity: 0.75;
  width: 100%;
  text-align: center;
  padding-top: 42px;
  padding-bottom: 42px;
  margin: 0;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 360px;
  border-radius: 8px;
  overflow: hidden;
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #555;
  background: #fafafa;
  border: 1px dashed #ddd;
  font-size: 0.875rem;
`;

const Location = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadKakaoSdk = () =>
      new Promise((resolve) => {
        if (window.kakao && window.kakao.maps) {
          resolve();
          return;
        }
        const existing = document.getElementById("kakao-maps-sdk");
        if (existing) {
          existing.addEventListener("load", () => resolve());
          return;
        }
        const script = document.createElement("script");
        script.id = "kakao-maps-sdk";
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_TOKEN}&libraries=services&autoload=false`;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });

    const createMap = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const kakao = window.kakao;
        // 국회의사당 소통관 근처 좌표 (대략값)
        const SOTONG_LAT = 37.531184;
        const SOTONG_LNG = 126.914826;
        const center = new kakao.maps.LatLng(SOTONG_LAT, SOTONG_LNG);

        const map = new kakao.maps.Map(mapRef.current, {
          center,
          level: 3,
        });
        mapInstanceRef.current = map;

        // 기본 마커 + 인포윈도우 (지오코딩 실패해도 표시되도록)
        const defaultMarker = new kakao.maps.Marker({ position: center });
        defaultMarker.setMap(map);
        const infoWindow = new kakao.maps.InfoWindow({
          content: '<div style="padding:6px 8px;">국회의사당 소통관</div>',
        });
        infoWindow.open(map, defaultMarker);

        // 컨테이너 표시/레이아웃 이후 리사이즈 반영
        setTimeout(() => {
          kakao.maps.event.trigger(map, "resize");
          map.setCenter(center);
        }, 0);

        // 키워드(장소명) 검색 우선 시도 후, 실패 시 주소 지오코딩으로 보정
        try {
          if (kakao.maps.services) {
            const places = new kakao.maps.services.Places();
            places.keywordSearch("국회의사당 소통관", (data, status) => {
              if (status === kakao.maps.services.Status.OK && data && data.length) {
                const first = data[0];
                const lat = parseFloat(first.y);
                const lng = parseFloat(first.x);
                const coords = new kakao.maps.LatLng(lat, lng);
                map.setCenter(coords);
                defaultMarker.setPosition(coords);
                infoWindow.setContent('<div style="padding:6px 8px;">국회의사당 소통관</div>');
                infoWindow.open(map, defaultMarker);
              } else if (typeof kakao.maps.services.Geocoder === "function") {
                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch("서울 영등포구 의사당대로 1", (result, geocodeStatus) => {
                  if (geocodeStatus === kakao.maps.services.Status.OK && result && result.length) {
                    const y = parseFloat(result[0].y);
                    const x = parseFloat(result[0].x);
                    const coords = new kakao.maps.LatLng(y, x);
                    map.setCenter(coords);
                    defaultMarker.setPosition(coords);
                  }
                });
              }
            });
          }
        } catch (_) {
          // 무시: 기본 좌표/마커로 충분
        }

        // 창 크기 변경 시 중심 유지
        const handleResize = () => {
          kakao.maps.event.trigger(map, "resize");
          map.setCenter(center);
        };
        window.addEventListener("resize", handleResize);
      });
    };

    // SDK 로딩 시도 + 타임아웃 가드
    const timeoutId = setTimeout(() => {
      setMapError(
        "지도를 불러오지 못했습니다. 카카오 개발자 콘솔에서 도메인(예: http://localhost:8000)을 등록했는지 확인해주세요."
      );
    }, 8000);

    loadKakaoSdk()
      .then(() => {
        clearTimeout(timeoutId);
        setMapError("");
        createMap();
      })
      .catch(() => {
        setMapError(
          "카카오 지도 SDK 로딩 중 오류가 발생했습니다. 네트워크 상태와 앱키/도메인 설정을 확인해주세요."
        );
      });

    // cleanup: 인스턴스만 정리 (SDK 스크립트는 재사용)
    return () => {
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <Wrapper>
      <Divider plain style={{ marginTop: 0, marginBottom: 32 }}>
        <Title>오시는 길</Title>
      </Divider>
      <Image src={Flower} />
      <MapContainer ref={mapRef}>{mapError ? <ErrorBanner>{mapError}</ErrorBanner> : null}</MapContainer>
      <Content>
        서울 영등포구 의사당대로 1
        <br />
        국회의사당 소통관 1층
        <br />
        <br />
        <Title>버스 이용시</Title>
        <br />
        <br />
        <br />
        국회의사당역.KB국민은행, 국회의사당 하차
        <br />
        <br />
        <Title>지하철 이용시</Title>
        <br />
        <br />
        9호선 국회의사당역 하차 (도보 11분)
      </Content>
    </Wrapper>
  );
};

export default Location;
