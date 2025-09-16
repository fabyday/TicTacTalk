import React, { useState, useEffect } from "react";

interface Device {
  id: string;
  name: string;
}

export function VoiceVideoSettings() {
  const [audioInputs, setAudioInputs] = useState<Device[]>([]);
  const [audioOutputs, setAudioOutputs] = useState<Device[]>([]);
  const [videoInputs, setVideoInputs] = useState<Device[]>([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('');
  const [selectedVideoInput, setSelectedVideoInput] = useState('');
  const [inputVolume, setInputVolume] = useState(50);
  const [outputVolume, setOutputVolume] = useState(50);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // 실제 디바이스 목록 가져오기
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setAudioInputs(devices.filter(d => d.kind === 'audioinput').map(d => ({ id: d.deviceId, name: d.label || '마이크' })));
        setAudioOutputs(devices.filter(d => d.kind === 'audiooutput').map(d => ({ id: d.deviceId, name: d.label || '스피커' })));
        setVideoInputs(devices.filter(d => d.kind === 'videoinput').map(d => ({ id: d.deviceId, name: d.label || '카메라' })));
      } catch (e) {
        setAudioInputs([]);
        setAudioOutputs([]);
        setVideoInputs([]);
      }
    };
    getDevices();
  }, []);

  useEffect(() => {
    if (audioInputs.length > 0 && !selectedAudioInput) setSelectedAudioInput(audioInputs[0].id);
    if (audioOutputs.length > 0 && !selectedAudioOutput) setSelectedAudioOutput(audioOutputs[0].id);
    if (videoInputs.length > 0 && !selectedVideoInput) setSelectedVideoInput(videoInputs[0].id);
  }, [audioInputs, audioOutputs, videoInputs]);

  const startTest = () => {
    setIsTesting(true);
    setTimeout(() => setIsTesting(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">음성 & 비디오 설정</h2>
      
      <div className="space-y-6">
        {/* 오디오 입력 설정 */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">마이크</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">마이크 선택</label>
              <select
                value={selectedAudioInput}
                onChange={(e) => setSelectedAudioInput(e.target.value)}
                className="w-full bg-gray-600 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {audioInputs.length === 0 && <option>마이크 없음</option>}
                {audioInputs.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2">입력 볼륨</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={inputVolume}
                  onChange={(e) => setInputVolume(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-white w-12 text-right">{inputVolume}%</span>
              </div>
            </div>
            
            <button
              onClick={startTest}
              disabled={isTesting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {isTesting ? '테스트 중...' : '마이크 테스트'}
            </button>
          </div>
        </div>

        {/* 오디오 출력 설정 */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">스피커</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">스피커 선택</label>
              <select
                value={selectedAudioOutput}
                onChange={(e) => setSelectedAudioOutput(e.target.value)}
                className="w-full bg-gray-600 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {audioOutputs.length === 0 && <option>스피커 없음</option>}
                {audioOutputs.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2">출력 볼륨</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={outputVolume}
                  onChange={(e) => setOutputVolume(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-white w-12 text-right">{outputVolume}%</span>
              </div>
            </div>
            
            <button
              onClick={startTest}
              disabled={isTesting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {isTesting ? '테스트 중...' : '스피커 테스트'}
            </button>
          </div>
        </div>

        {/* 비디오 설정 */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">카메라</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">카메라 선택</label>
              <select
                value={selectedVideoInput}
                onChange={(e) => setSelectedVideoInput(e.target.value)}
                className="w-full bg-gray-600 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {videoInputs.length === 0 && <option>카메라 없음</option>}
                {videoInputs.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <div className="text-center text-gray-400">
                카메라 미리보기 영역
              </div>
            </div>
            
            <button
              onClick={startTest}
              disabled={isTesting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {isTesting ? '테스트 중...' : '카메라 테스트'}
            </button>
          </div>
        </div>

        {/* 고급 설정 */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">고급 설정</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="text-blue-600 rounded"
              />
              <span className="text-gray-300">노이즈 감소</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="text-blue-600 rounded"
              />
              <span className="text-gray-300">에코 제거</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="text-blue-600 rounded"
              />
              <span className="text-gray-300">자동 게인 제어</span>
            </label>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
            설정 저장
          </button>
        </div>
      </div>
    </div>
  );
} 