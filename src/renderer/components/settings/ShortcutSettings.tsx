import React, { useState } from "react";

interface Shortcut {
  id: string;
  name: string;
  description: string;
  defaultKey: string;
  currentKey: string;
}

export function ShortcutSettings() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    { id: 'minimize', name: '창 최소화', description: '애플리케이션 창을 최소화합니다', defaultKey: 'Ctrl+M', currentKey: 'Ctrl+M' },
    { id: 'maximize', name: '창 최대화', description: '애플리케이션 창을 최대화합니다', defaultKey: 'F11', currentKey: 'F11' },
    { id: 'search', name: '검색', description: '채널이나 사용자를 검색합니다', defaultKey: 'Ctrl+K', currentKey: 'Ctrl+K' },
    { id: 'settings', name: '설정', description: '설정 창을 엽니다', defaultKey: 'Ctrl+,', currentKey: 'Ctrl+,' },
    { id: 'mute', name: '음소거', description: '음성을 음소거합니다', defaultKey: 'Ctrl+Shift+M', currentKey: 'Ctrl+Shift+M' },
    { id: 'deafen', name: '듣기 중지', description: '듣기를 중지합니다', defaultKey: 'Ctrl+Shift+D', currentKey: 'Ctrl+Shift+D' },
  ]);

  const [editingShortcut, setEditingShortcut] = useState<string | null>(null);

  const handleKeyPress = (shortcutId: string, event: React.KeyboardEvent) => {
    event.preventDefault();
    
    const keys: string[] = [];
    if (event.ctrlKey) keys.push('Ctrl');
    if (event.shiftKey) keys.push('Shift');
    if (event.altKey) keys.push('Alt');
    if (event.metaKey) keys.push('Cmd');
    
    if (event.key !== 'Control' && event.key !== 'Shift' && event.key !== 'Alt' && event.key !== 'Meta') {
      keys.push(event.key.toUpperCase());
    }
    
    const newKey = keys.join('+');
    
    setShortcuts(prev => 
      prev.map(shortcut => 
        shortcut.id === shortcutId 
          ? { ...shortcut, currentKey: newKey }
          : shortcut
      )
    );
    setEditingShortcut(null);
  };

  const resetToDefault = (shortcutId: string) => {
    setShortcuts(prev => 
      prev.map(shortcut => 
        shortcut.id === shortcutId 
          ? { ...shortcut, currentKey: shortcut.defaultKey }
          : shortcut
      )
    );
  };

  const resetAll = () => {
    setShortcuts(prev => 
      prev.map(shortcut => ({ ...shortcut, currentKey: shortcut.defaultKey }))
    );
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">단축키 설정</h2>
        <button
          onClick={resetAll}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          기본값으로 복원
        </button>
      </div>
      
      <div className="space-y-4">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{shortcut.name}</h3>
                <p className="text-gray-400 text-sm">{shortcut.description}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-gray-400">기본값</div>
                  <div className="text-gray-300 font-mono">{shortcut.defaultKey}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-400">현재</div>
                  {editingShortcut === shortcut.id ? (
                    <input
                      type="text"
                      className="bg-gray-600 text-white border border-blue-500 rounded px-2 py-1 font-mono text-center w-24"
                      placeholder="키 입력"
                      onKeyDown={(e) => handleKeyPress(shortcut.id, e)}
                      onBlur={() => setEditingShortcut(null)}
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => setEditingShortcut(shortcut.id)}
                      className="bg-gray-600 hover:bg-gray-500 text-white border border-gray-500 rounded px-3 py-1 font-mono transition-colors duration-200"
                    >
                      {shortcut.currentKey}
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => resetToDefault(shortcut.id)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  복원
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">사용법</h3>
        <p className="text-gray-300 text-sm">
          단축키를 변경하려면 해당 키를 클릭하고 원하는 조합을 입력하세요. 
          Ctrl, Shift, Alt, Cmd 키와 함께 다른 키를 조합할 수 있습니다.
        </p>
      </div>
    </div>
  );
} 