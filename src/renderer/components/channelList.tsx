import { useState } from 'react';
import clsx from 'clsx';

const channels = ['general', 'music', 'gaming', 'memes', 'study'];

export default function ChannelList() {
  const [selected, setSelected] = useState('general');

  return (
    <div className="w-48 bg-gray-800 p-2 space-y-1">
      <h2 className="text-gray-300 text-sm font-bold mb-2 px-2">TEXT CHANNELS</h2>
      {channels.map((channel) => (
        <button
          key={channel}
          onClick={() => setSelected(channel)}
          className={clsx(
            'w-full text-left px-2 py-1 rounded hover:bg-gray-700 transition-all',
            selected === channel ? 'bg-gray-700 text-white font-semibold' : 'text-gray-400'
          )}
        >
          # {channel}
        </button>
      ))}
    </div>
  );
}