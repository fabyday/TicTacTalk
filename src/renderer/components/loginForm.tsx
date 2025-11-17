import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Server, User, Lock, AlertCircle } from "lucide-react";
// import { apiService } from "../services/api";
import LoadingOverlay from "./loadingOverlay";

interface LoginFormProps {
  onLogin: (serverUrl: string, username: string, password: string) => void;
}

interface SavedLoginInfo {
  serverUrl: string;
  username: string;
  autoLogin: boolean;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [serverUrl, setServerUrl] = useState("http://localhost:3000");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const [bgmOn, setBgmOn] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 저장된 로그인 정보 로드
  useEffect(() => {
    loadSavedLoginInfo();
  }, []);

  // BGM on/off 상태 로드
  useEffect(() => {
    const saved = localStorage.getItem("loginBgmOn");
    if (saved !== null) {
      const savedBgmOn = saved === "true";
      setBgmOn(savedBgmOn);

      // 저장된 상태가 ON이면 바로 재생 시도
      if (savedBgmOn && audioRef.current) {
        audioRef.current.volume = 0.15;
        audioRef.current.play().catch(() => {});
      }
    }
  }, []);

  // BGM 볼륨 및 on/off 제어
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15;
      if (bgmOn) {
        // 자동 재생이 안 될 경우를 대비해 사용자 상호작용 시 재생
        const playAudio = () => {
          audioRef.current?.play().catch(() => {});
          document.removeEventListener("click", playAudio);
          document.removeEventListener("keydown", playAudio);
        };

        audioRef.current.play().catch(() => {
          // 자동 재생이 실패하면 사용자 상호작용 시 재생
          document.addEventListener("click", playAudio);
          document.addEventListener("keydown", playAudio);
        });
      } else {
        audioRef.current.pause();
      }
    }
    localStorage.setItem("loginBgmOn", String(bgmOn));
  }, [bgmOn]);

  // 로그인 성공 시 BGM 정지
  useEffect(() => {
    if (isLoading === false && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isLoading]);

  const loadSavedLoginInfo = () => {
    try {
      const savedInfo = localStorage.getItem("savedLoginInfo");
      if (savedInfo) {
        const parsed: SavedLoginInfo = JSON.parse(savedInfo);
        setServerUrl(parsed.serverUrl);
        setUsername(parsed.username);
        setAutoLogin(parsed.autoLogin);

        // 자동 로그인이 활성화되어 있으면 자동 로그인 시도
        if (parsed.autoLogin) {
          handleAutoLogin();
        }
      }
    } catch (error) {
      console.error("저장된 로그인 정보 로드 실패:", error);
    }
  };

  const saveLoginInfo = () => {
    try {
      const loginInfo: SavedLoginInfo = {
        serverUrl,
        username,
        autoLogin,
      };
      localStorage.setItem("savedLoginInfo", JSON.stringify(loginInfo));
    } catch (error) {
      console.error("로그인 정보 저장 실패:", error);
    }
  };

  const clearSavedLoginInfo = () => {
    try {
      localStorage.removeItem("savedLoginInfo");
    } catch (error) {
      console.error("저장된 로그인 정보 삭제 실패:", error);
    }
  };

  const handleAutoLogin = async () => {
    try {
      setIsAutoLoggingIn(true);
      setError(null);

      // 저장된 토큰이 있는지 확인
      const savedToken = localStorage.getItem("accessToken");
      if (!savedToken) {
        setError("저장된 로그인 정보가 없습니다. 비밀번호를 입력해주세요.");
        return;
      }

      // // 서버 URL 설정
      // apiService.setBaseUrl(serverUrl);
      // apiService.setAccessToken(savedToken);

      // // 토큰 유효성 검사
      // const profile = await apiService.getProfile();

      // 자동 로그인 성공
      // await onLogin(serverUrl, profile.username, "");
    } catch (error) {
      console.error("자동 로그인 실패:", error);
      // 토큰이 유효하지 않으면 삭제
      localStorage.removeItem("accessToken");
      setError(
        "저장된 로그인 정보가 만료되었습니다. 비밀번호를 다시 입력해주세요."
      );
    } finally {
      setIsAutoLoggingIn(false);
    }
  };

  const testConnection = async () => {
    if (!serverUrl.trim()) {
      setError("서버 주소를 입력해주세요.");
      return;
    }

    setIsTestingConnection(true);
    setError(null);

    try {
      // apiService.setBaseUrl(serverUrl);
      // 먼저 기본 ping 테스트
      // const isPingable = await apiService.ping();
      // if (!isPingable) {
      //   setError("서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.");
      //   return;
      // }
      // // 그 다음 auth 엔드포인트 테스트
      // // const isConnected = await apiService.testConnection();
      // if (isConnected) {
      //   setError(null);
      //   // 성공 메시지를 잠시 표시
      //   setTimeout(() => setError(null), 2000);
      // } else {
      //   setError("인증 서비스에 연결할 수 없습니다. 서버 설정을 확인해주세요.");
      // }
    } catch (error) {
      setError("서버 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 서버 URL 설정
      // apiService.setBaseUrl(serverUrl);

      // 로그인 API 호출
      // const loginResponse = await apiService.login({ username, password });

      // 액세스 토큰 설정
      // apiService.setAccessToken(loginResponse.accessToken);

      // 토큰을 localStorage에 저장 (자동 로그인용)
      // localStorage.setItem("accessToken", loginResponse.accessToken);

      // 사용자 프로필 정보 가져오기
      // const profile = await apiService.getProfile();

      // 로그인 정보 저장 (자동 로그인 체크 시)
      if (autoLogin) {
        saveLoginInfo();
      } else {
        clearSavedLoginInfo();
      }

      // 최소 로딩 시간 보장 (자연스러운 전환을 위해)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 로그인 성공 콜백 호출
      // await onLogin(serverUrl, profile.username, password);
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof Error) {
        if (error.message.includes("Invalid credentials")) {
          setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        } else if (error.message.includes("Network error")) {
          setError(
            "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
          );
        } else {
          setError(error.message);
        }
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* BGM 오디오 */}
      <audio
        ref={audioRef}
        src="file:///D:/project/tictactalk/client/resources/sounds/login_sound.mp3"
        autoPlay
        loop
        style={{ display: "none" }}
        onLoadedData={() => {
          console.log("오디오 로드 완료, 재생 시도...");
          if (bgmOn && audioRef.current) {
            audioRef.current.volume = 0.15;
            audioRef.current
              .play()
              .then(() => {
                console.log("오디오 재생 성공!");
              })
              .catch((error) => {
                console.error("오디오 재생 실패:", error);
              });
          }
        }}
        onError={(e) => {
          console.error("오디오 로드 실패:", e);
        }}
      />
      {/* BGM on/off 라디오 버튼 */}
      <div className="fixed left-4 bottom-4 z-50 flex items-center space-x-2 bg-gray-900/80 px-3 py-2 rounded-lg border border-gray-700 shadow-lg">
        <label className="flex items-center space-x-1 cursor-pointer">
          <input
            type="radio"
            name="bgm"
            checked={bgmOn}
            onChange={() => setBgmOn(true)}
            className="accent-blue-500"
          />
          <span className="text-xs text-blue-300">BGM ON</span>
        </label>
        <label className="flex items-center space-x-1 cursor-pointer">
          <input
            type="radio"
            name="bgm"
            checked={!bgmOn}
            onChange={() => setBgmOn(false)}
            className="accent-gray-400"
          />
          <span className="text-xs text-gray-300">BGM OFF</span>
        </label>
      </div>
      {/* 로딩 오버레이 */}
      <LoadingOverlay
        isVisible={isLoading || isAutoLoggingIn}
        message={isAutoLoggingIn ? "자동 로그인 중..." : "로그인 중..."}
        type="login"
      />

      <div className="h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* 반투명 오버레이로 배경을 어둡게 */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* 로고 및 제목 */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-2xl font-bold text-white">T</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-white drop-shadow-lg">
              TicTacTalk
            </h2>
            <p className="mt-2 text-sm text-gray-200 drop-shadow">
              채팅 서버에 로그인하세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-900/70 border border-red-500 rounded-md p-3 flex items-center space-x-2 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-sm text-red-200">{error}</span>
            </div>
          )}

          {/* 로그인 폼 */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* 서버 주소 입력 */}
              <div>
                <label
                  htmlFor="server-url"
                  className="block text-sm font-medium text-gray-200"
                >
                  서버 주소
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Server className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="server-url"
                    name="server-url"
                    type="url"
                    required
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-20 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/80 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="http://localhost:3000"
                  />
                  <button
                    type="button"
                    onClick={testConnection}
                    disabled={isTestingConnection}
                    className="absolute inset-y-0 right-0 px-3 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                  >
                    {isTestingConnection ? "연결 중..." : "테스트"}
                  </button>
                </div>
              </div>

              {/* 사용자명 입력 */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-200"
                >
                  아이디
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/80 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="사용자명을 입력하세요"
                  />
                </div>
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                  비밀번호
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-10 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/80 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="비밀번호를 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* 자동 로그인 체크박스 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoLogin}
                    onChange={(e) => setAutoLogin(e.target.checked)}
                    className="text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-300">자동 로그인</span>
                </label>

                {autoLogin && (
                  <button
                    type="button"
                    onClick={clearSavedLoginInfo}
                    className="text-xs text-gray-400 hover:text-gray-300"
                  >
                    저장된 정보 삭제
                  </button>
                )}
              </div>
            </div>

            {/* 로그인 버튼 */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </div>

            {/* 회원가입 버튼 */}
            <div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                계정이 없으신가요? 회원가입
              </button>
            </div>
          </form>

          {/* 자동 로그인 안내 */}
          {autoLogin && (
            <div className="bg-blue-900/20 border border-blue-700 rounded-md p-3">
              <p className="text-xs text-blue-300">
                자동 로그인이 활성화되었습니다. 다음 실행 시 자동으로
                로그인됩니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 회원가입 모달 */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        serverUrl={serverUrl}
        onRegisterSuccess={() => setShowCongratulations(true)}
      />

      {/* 축하 모달 */}
      <CongratulationsModal
        isOpen={showCongratulations}
        onClose={() => setShowCongratulations(false)}
      />
    </>
  );
}

interface CongratulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CongratulationsModal({ isOpen, onClose }: CongratulationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4 shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-white text-2xl font-bold mb-2">
            회원가입을 축하합니다!
          </h2>
          <p className="text-gray-300 text-sm mb-6">
            계정이 성공적으로 생성되었습니다.
            <br />
            이제 로그인하여 서비스를 이용하세요!
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverUrl: string;
  onRegisterSuccess: () => void;
}

function RegisterModal({
  isOpen,
  onClose,
  serverUrl,
  onRegisterSuccess,
}: RegisterModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 4) {
      setError("비밀번호는 최소 4자 이상이어야 합니다.");
      return;
    }

    try {
      setIsRegistering(true);
      setError(null);

      // 서버 URL 설정
      // apiService.setBaseUrl(serverUrl);

      // 회원가입 API 호출
      // const response = await apiService.register({ username, password });

      // 즉시 모달 닫기
      onClose();
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setSuccess(null);

      // 축하 모달 표시
      onRegisterSuccess();
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      setError(error.message || "회원가입에 실패했습니다.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleClose = () => {
    if (!isRegistering) {
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccess(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4 shadow-2xl">
        <h2 className="text-white text-xl font-bold mb-4 text-center">
          회원가입
        </h2>

        {error && (
          <div className="bg-red-900/70 border border-red-500 rounded-md p-3 mb-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-sm text-red-200">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-900/70 border border-green-500 rounded-md p-3 mb-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm text-green-200">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 아이디 입력 */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              아이디
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isRegistering}
                required
                minLength={3}
              />
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-10 pr-10 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isRegistering}
                required
                minLength={4}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isRegistering}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isRegistering}
                required
                minLength={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isRegistering}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={
                !username.trim() ||
                !password.trim() ||
                !confirmPassword.trim() ||
                isRegistering
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isRegistering ? "가입 중..." : "회원가입"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
