import {
  HeadphoneOff,
  Headphones,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  Settings2,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
} from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidePanel } from "../common/SlidePanel";
import { useTranslation } from "react-i18next";

type SignalState = "zero" | "low" | "medium" | "high" | "max";
type ConnectionState = "TryConnect" | "TryReconnect" | "Connected" | "Disconnected";

type onMuteMicFunction = () => void;
type onMuteSpeakerFunction = () => void;
type onOpenSettingsFunction = () => void;
type onDisconnectFunction = () => void | Promise<void>;
interface IconPorps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export interface UserBarProps {
  imgSrc?: string;
  userId: string;
  userName: string;
  ExpandView?: boolean;
  roomPath?: string;
  signalState?: SignalState;
  isMicMuted?: boolean;
  connectionState?: ConnectionState;
  isSpeakerMuted?: boolean;
  onMuteMic: onMuteMicFunction;
  onMuteSpeaker: onMuteSpeakerFunction;
  onOpenSettings: onOpenSettingsFunction;
  onDisconnect?: onDisconnectFunction;
}
const MotionMic = motion(Mic);
const MotionMicOff = motion(MicOff);
const MotionSetting = motion(Settings);
const MotionHeadphoneOff = motion(HeadphoneOff);
const MotionHeadphones = motion(Headphones);
const MotionPhoneOff = motion(PhoneOff);
// components/SlidePanel.tsx

Signal;
SignalHigh;
SignalMedium;
SignalLow;
SignalZero;
export function UserBar({
  imgSrc,
  userId,
  userName,
  roomPath,
  signalState,
  connectionState,
  ExpandView = false,
  isSpeakerMuted = false,
  isMicMuted = false,
  onMuteSpeaker,
  onMuteMic,
  onOpenSettings,
  onDisconnect,
}: UserBarProps) {

  const [RoundTop, setRoundTop] = useState(!ExpandView);

  // this is tmp settings. TODO Must remove this hard coded-values
  const iconColor = "#8a8a8a";
  const iconSize = 31;
  const strokeWidth = 3;
  const IconProps = { size: iconSize, color: iconColor, strokeWidth: strokeWidth };

  const btnClassName = `rounded-full  hover:scale-105 active:translate-y-1 active:scale-95 transition-all duration-200`;

  const SignalIconProps = { size: 36, color: "green", strokeWidth: strokeWidth };

  return (
    <div>
      <SlidePanel
        isOpen={ExpandView}
        upperChildren={
          <ConnectionStatusBar
            signalState={signalState}
            connectionState={connectionState}
            IconProps={IconProps}
            SignalIconProps={SignalIconProps}
            onDisconnect={onDisconnect}
            roomPath={roomPath}
          />
        }
        lowerChildren={
          <UserStatusBar
            RoundTop={RoundTop}
            IconProps={IconProps}
            isMicMuted={isMicMuted}
            isSpeakerMuted={isSpeakerMuted}
            onMuteMic={onMuteMic}
            onMuteSpeaker={onMuteSpeaker}
            onOpenSettings={onOpenSettings}
            btnClassName={btnClassName}
            imgSrc={imgSrc}
            userName={userName}
          />
        }
        onOpen={() => {
          setRoundTop(false);
        }}
        onClose={() => {
          setRoundTop(true);
        }}
      />
    </div>
  );
}

const shakeVariants = {
  idle: { rotate: 0 },
  shake: {
    rotate: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.6, repeat: 0 },
  },
};
const earMoveVariants = {
  idle: { rotate: 0 },
  move: {
    rotate: [0, -10, 10, -10, 10, 0],
    transition: { duration: 1, repeat: 0 },
  },
};
const RotateVariants = {
  idle: { rotate: 0 },
  rotate: {
    rotate: -360,
    transition: { duration: 1 },
  },
  done: {},
};

interface ConnectionStatusBarState {
  signalState?: SignalState;
  connectionState?: ConnectionState;
  roomPath?: string;
  SignalIconProps: IconPorps;
  IconProps: IconPorps;
  onDisconnect?: () => void;
}

function ConnectionStatusBar({
  signalState,
  connectionState,
  roomPath,
  SignalIconProps,
  IconProps,
  onDisconnect,
}: ConnectionStatusBarState) {
  const { t } = useTranslation();

  const [PhoneOffAnimState, setPhoneOffAnimState] = useState<"idle" | "move">("idle");

  return (
    <div className="w-full flex  rounded-t-sm justify-between p-2 bg-purple-400">
      <div className="flex items-center">
        <div key={signalState} className="pr-2">
          {(() => {
            console.log(signalState);
            switch (signalState) {
              case "zero":
                return <SignalZero {...SignalIconProps} />;
              case "low":
                return <SignalLow {...SignalIconProps} />;
              case "medium":
                return <SignalMedium {...SignalIconProps} />;
              case "high":
                return <SignalHigh {...SignalIconProps} />;
              case "max":
              default:
                return <Signal {...SignalIconProps} />;
            }
          })()}
        </div>
        <div>
          <div key={connectionState}>
            {(() => {
              switch (connectionState) {
                case "TryReconnect":
                  return t("renderer.components.user.TryReConnect");
                case "Connected":
                  return t("renderer.components.user.VoiceConnected");
                case "TryConnect":
                  return t("renderer.components.user.TryConnect");
                case "Disconnected":
                  return t("renderer.components.user.Disconnected");
                default:
                  return "idle";
              }
            })()}
          </div>
          <p>{roomPath || "Empty"}</p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {/* when Connect chatroom, enable this Button */}
        {onDisconnect ? (
          <button
            onClick={async () => {
              setPhoneOffAnimState("move");
              const result = await Promise.resolve(onDisconnect?.());
              console.log(result);

              return;
            }}
          >
            <MotionPhoneOff
              animate={PhoneOffAnimState}
              onAnimationComplete={async () => setPhoneOffAnimState("idle")}
              variants={earMoveVariants}
              {...IconProps}
              color="red"
            />
          </button>
        ) : undefined}
      </div>
    </div>
  );
}

interface UserStatusBarProps {
  RoundTop?: boolean;
  userName?: string;
  imgSrc?: string;
  btnClassName?: string;
  isSpeakerMuted: boolean;
  isMicMuted: boolean;
  IconProps: IconPorps;
  onMuteMic: onMuteMicFunction;
  onMuteSpeaker: onMuteSpeakerFunction;
  onOpenSettings: onOpenSettingsFunction;
}

function UserStatusBar({
  RoundTop,
  userName,
  imgSrc,
  btnClassName,
  isMicMuted,
  isSpeakerMuted,
  IconProps,
  onMuteMic,
  onMuteSpeaker,
  onOpenSettings,
}: UserStatusBarProps) {
  const [micAnimState, setMicAnimState] = useState<"idle" | "shake">("idle");
  const [headphoneAnimState, setHeadphoneAnimState] = useState<"idle" | "move">("idle");
  const [SettingAnimState, setSettingAnimState] = useState<"init" | "done" | "rotate">("init");
  const [animKey, setAnimKey] = useState(0);

  return (
    <div
      className={`z-10 h-14 p-3 w-full ${
        RoundTop ? "rounded-sm" : "rounded-b-sm"
      } bg-amber-800 justify-between flex items-center`}
    >
      {/* user Img and Infos */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-400 rounded-full">
          <img src={imgSrc}></img>
        </div>
        <div>
          <p className="text-white">{userName}</p>
        </div>
      </div>
      {/* right buttons */}
      <div className="flex gap-2 items-center">
        {/* Mic enable/disable button*/}
        <button
          className={btnClassName}
          onClick={() => {
            onMuteMic?.();
            setMicAnimState("shake");
          }}
        >
          {isMicMuted ? (
            <MotionMicOff
              animate={micAnimState}
              onAnimationComplete={() => setMicAnimState("idle")}
              variants={shakeVariants}
              {...IconProps}
            />
          ) : (
            <MotionMic
              animate={micAnimState}
              onAnimationComplete={() => setMicAnimState("idle")}
              variants={shakeVariants}
              {...IconProps}
            />
          )}
        </button>

        {/* Speaker enable/disable button*/}
        <button
          className={btnClassName}
          onClick={async () => {
            onMuteSpeaker?.();
            setHeadphoneAnimState("move");
          }}
        >
          {isSpeakerMuted ? (
            <MotionHeadphoneOff
              animate={headphoneAnimState}
              onAnimationComplete={() => setHeadphoneAnimState("idle")}
              variants={earMoveVariants}
              {...IconProps}
            />
          ) : (
            <MotionHeadphones
              animate={headphoneAnimState}
              onAnimationComplete={() => setHeadphoneAnimState("idle")}
              variants={earMoveVariants}
              {...IconProps}
            />
          )}
        </button>
        <button
          className={btnClassName}
          onClick={async () => {
            onOpenSettings?.();
            setSettingAnimState("rotate");
            setAnimKey((prev) => (prev + 1) % 5); // for animation
          }}
        >
          <MotionSetting
            onAnimationComplete={() => {}}
            key={animKey}
            animate={SettingAnimState}
            variants={RotateVariants}
            {...IconProps}
          />
        </button>
      </div>
    </div>
  );
}
