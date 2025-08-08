import React, { useEffect } from "react";
import { Divider } from "antd";
import styled from "styled-components";
import Flower from "../assets/flower2.png";

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

const Map = styled.div`
  width: 100%;
  padding: 0;
`;

const Location = () => {
  // 카카오 맵 불러오기

  // roughmap 구성 요소 (한 곳에서 관리)
  const TIMESTAMP = "1754624476247";
  const MAP_KEY = "7zipf3hy7a7";
  const CONTAINER_ID = `daumRoughmapContainer${TIMESTAMP}`;

  // 실행 스크립트 (roughmap 로더가 로드된 후 직접 호출)
  const executeScript = () => {
    try {
      if (
        window.daum &&
        window.daum.roughmap &&
        typeof window.daum.roughmap.Lander === "function"
      ) {
        // 컨테이너 id는 timestamp와 연결되어야 합니다
        // id는 timestamp와 동일한 값을 사용해야 함
        // 중복 렌더 방지를 위해, 기존 컨테이너에 자식이 이미 존재하면 스킵
        const container = document.getElementById(CONTAINER_ID);
        if (container && container.children.length === 0) {
          new window.daum.roughmap.Lander({
            timestamp: TIMESTAMP,
            key: MAP_KEY,
            mapWidth: "640",
            mapHeight: "360",
          }).render();
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to render Kakao roughmap:", error);
    }
  };

  // 공식 roughmap 로더 스크립트 로드 (중복 로드 방지)
  const loadRoughmapLoader = () => {
    if (typeof window === "undefined") return;
    // 이미 로드된 경우 바로 실행
    if (window.daum && window.daum.roughmap && typeof window.daum.roughmap.Lander === "function") {
      executeScript();
      return;
    }
    // 기존에 삽입된 로더가 있는지 확인
    if (document.querySelector("script.daum_roughmap_loader_script")) {
      // 로더가 로드 완료되면 실행되도록 약간 지연
      const onReady = () => executeScript();
      if (document.readyState === "complete") {
        setTimeout(onReady, 0);
      } else {
        window.addEventListener("load", onReady, { once: true });
      }
      return;
    }
    const loader = document.createElement("script");
    loader.charset = "UTF-8";
    loader.src = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";
    loader.className = "daum_roughmap_loader_script";
    loader.onload = () => {
      // 로더 로드 직후 호출 (일부 환경에서 로더가 비동기 내부 초기화를 하므로 약간 지연)
      executeScript();
      setTimeout(executeScript, 0);
    };
    document.body.appendChild(loader);
  };


  useEffect(() => {
    loadRoughmapLoader();
  }, []);

  return (
    <Wrapper>
      <Divider plain style={{ marginTop: 0, marginBottom: 32 }}>
        <Title>오시는 길</Title>
      </Divider>
      <Image src={Flower} />
      <Map
        id={CONTAINER_ID}
        className="root_daum_roughmap root_daum_roughmap_landing"
      ></Map>
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
