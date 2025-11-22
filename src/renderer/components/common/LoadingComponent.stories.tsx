import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";
import { LoadingComponent } from "./LoadingComponent";

const meta: Meta<typeof LoadingComponent> = {
  title: "Components/common/LoadingComponent",
  component: LoadingComponent,
  argTypes: {
    progressBarType: {
      control: "select",
      options: ["none", "bar", "ring"],
    },
    message: { control: "text" },
    isVisible: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof LoadingComponent>;

// 기본 스토리
export const Default: Story = {
  args: {
    isVisible: true,
    message: "로딩 중...",
    progressBarType: "bar",
    progressAnimationGif: "./loading.gif",
    progress: { progress: 0, max: 100 },
  },
};

// 자동 진행 + 메시지 변경 테스트
export const Preview: Story = {
  args: {
    isVisible: true,
    message: "불러오는 중...",
    progressBarType: "ring",
    progressAnimationGif: "./loading.gif",
    progress: { progress: 0, max: 100 },
  },
  render: ({ message, progress, progressBarType, progressAnimationGif, isVisible }) => {
    const [p, setP] = useState(progress?.progress || 0);
    const [m, setM] = useState(message);

    // 자동 로딩 시뮬레이션
    useEffect(() => {
      let step = p;
      const interval = setInterval(() => {
        step += 1;
        setP(step);

        if (step === 30) setM("서버와 통신 중...");
        if (step === 60) setM("메시지 불러오는 중...");
        if (step >= 100) clearInterval(interval);
      }, 50);

      return () => clearInterval(interval);
    }, []);

    return (
      <LoadingComponent
        isVisible={isVisible}
        message={m}
        progress={{ progress: p, max: 100 }}
        progressBarType={progressBarType}
        progressAnimationGif={progressAnimationGif}
      />
    );
  },
};
