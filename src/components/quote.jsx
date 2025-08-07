import React from "react";
import styled from "styled-components";
import QuotePaper from "../assets/Quote.png";
import Flower from "../assets/flower1.png";

const Wrapper = styled.div`
  padding-top: 42px;
  padding-left: 42px;
  padding-right: 42px;
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
`;

const Content = styled.span`
  display: block;
  margin: 0 auto;
  font-size: 1.3rem;
  font-family: "mom_to_daughter";
  text-align: center;
  color: var(--title-color);
  line-height: 2.25rem;
  opacity: 0.75;
  background-image: url(${QuotePaper});
  background-repeat: no-repeat;
  background-position: center;
`;

const Image = styled.img`
  display: block;
  margin: 0 auto;
  width: 1.375rem;
  padding-bottom: 42px;
`;

const Quote = () => {
  return (
    <Wrapper>
      <Image src={Flower} data-aos="fade-up" />
      <Content data-aos="fade-up">
        사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며
        <br />
        사랑은 자랑하지 아니하며 교만하지 아니하며 무례히 행하지 아니하며
        <br />
        자기의 유익을 구하지 아니하며 성내지 아니하며 악한 것을 생각하지 아니하며
        <br />
        불의를 기뻐하지 아니하며 진리와 함께 기뻐하고
        <br />
         모든 것을 참으며 모든 것을 믿으며 모든 것을 바라며 모든 것을 견디느니라
        <br />
        - 고린도전서 13:4-7 -
        <br />
      </Content>
    </Wrapper>
  );
};

export default Quote;
