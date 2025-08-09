import React, { useEffect, useRef } from "react";
import { Layout } from "antd";
import styled from "styled-components";
import "react-image-gallery/styles/css/image-gallery.css";
import "antd/dist/antd.css";
import Gallery from "../components/gallery";
import Greeting from "../components/greeting";
import Title from "../components/title";
import "../styles/index.css";

import GroovePaper from "../assets/GroovePaper.png";
import Location from "../components/location";
import CongratulatoryMoney from "../components/congratulatoryMoney";
import Share from "../components/share";
import Quote from "../components/quote";
import Song from "../assets/song2.mp3";

import AOS from "aos";
import "aos/dist/aos.css";

// markup
const { Footer } = Layout;

const Wrapper = styled.div`
  background: #efebe9;
  background-image: url(${GroovePaper});
  width: 100%;
`;

const IndexPage = () => {
  const audioRef = useRef(null);

  // Kakao JavaScript SDK (for KakaoTalk share) 로딩
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
    document.body.appendChild(script);

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // AOS 초기화 (1회)
  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

  // 백그라운드 음악을 안정적으로 재생 (사용자 상호작용 대응, 포커스 전환 대응)
  useEffect(() => {
    const audioElement = new Audio(Song);
    audioElement.loop = true;
    audioElement.preload = "auto";
    audioElement.crossOrigin = "anonymous";
    audioRef.current = audioElement;

    const tryPlay = () => {
      if (!audioRef.current) return;
      const p = audioRef.current.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // 모바일 환경 등 자동재생 제한 시: 첫 사용자 상호작용에서 재생
        });
      }
    };

    // 최초 시도 (일부 브라우저에서는 차단될 수 있음)
    tryPlay();

    // 사용자 상호작용 시 재생 시도
    const interactionHandler = () => {
      tryPlay();
      window.removeEventListener("click", interactionHandler);
      window.removeEventListener("touchstart", interactionHandler);
      window.removeEventListener("keydown", interactionHandler);
    };
    window.addEventListener("click", interactionHandler, { once: true });
    window.addEventListener("touchstart", interactionHandler, { once: true });
    window.addEventListener("keydown", interactionHandler, { once: true });

    // 탭 전환 등으로 일시정지된 경우 복구 시도
    const visibilityHandler = () => {
      if (document.visibilityState === "visible") {
        tryPlay();
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    // iOS 등의 환경에서 ended 이벤트가 발생할 수 있어 방지
    const endedHandler = () => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = 0;
      tryPlay();
    };
    audioElement.addEventListener("ended", endedHandler);

    return () => {
      document.removeEventListener("visibilitychange", visibilityHandler);
      window.removeEventListener("click", interactionHandler);
      window.removeEventListener("touchstart", interactionHandler);
      window.removeEventListener("keydown", interactionHandler);
      audioElement.removeEventListener("ended", endedHandler);
      audioElement.pause();
      audioRef.current = null;
    };
  }, []);

  return (
    <Wrapper>
      {/* 오디오는 JS에서 제어 (자동재생/복구 처리) */}
      <Title />
      <Greeting />
      <Gallery />
      <Location />
      <Quote />
      <CongratulatoryMoney />
      <Share />
      <Footer
        style={{
          background: "#D7CCC8",
          backgroundImage: `url(${GroovePaper})`,
          opacity: 0.6,
          textAlign: "center",
        }}
      >
        Copyright © 2025 ppatabox
      </Footer>
    </Wrapper>
  );
};

export default IndexPage;
