import React, { useRef, useState } from 'react';

const MIN_LEFT_WIDTH = 300;
const MAX_LEFT_WIDTH = 900;

const PROTOCOLS = [
  { key: 'websocket', label: 'WebSocket', icon: 'wifi' },
  { key: 'sse', label: 'SSE', icon: 'rss_feed' },
  { key: 'socketio', label: 'Socket.IO', icon: 'settings_input_antenna' },
  { key: 'mqtt', label: 'MQTT', icon: 'router' },
];

const Realtime: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState(700);
  const [dragging, setDragging] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState('websocket');
  const dividerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    document.body.style.cursor = 'col-resize';
  };

  React.useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const container = dividerRef.current?.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      let newWidth = e.clientX - rect.left;
      if (newWidth < MIN_LEFT_WIDTH) newWidth = MIN_LEFT_WIDTH;
      if (newWidth > MAX_LEFT_WIDTH) newWidth = MAX_LEFT_WIDTH;
      setLeftWidth(newWidth);
    };
    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  // Placeholder UIs for each protocol
  const renderProtocolUI = () => {
    switch (selectedProtocol) {
      case 'websocket':
        return (
          <div className="flex flex-col flex-1 bg-gray-900 rounded p-4 mt-2">
            <div className="text-lg text-blue-400 mb-2">WebSocket UI Placeholder</div>
            {/* ...existing WebSocket UI here... */}
          </div>
        );
      case 'sse':
        return (
          <div className="flex flex-col flex-1 bg-gray-900 rounded p-4 mt-2">
            <div className="flex items-center gap-4 mb-4">
              <input
                className="flex-1 bg-gray-800 border-none rounded px-4 py-2 text-white focus:outline-none"
                placeholder="https://express-eventsource.herokuapp.com/events"
                defaultValue="https://express-eventsource.herokuapp.com/events"
                style={{ minWidth: 0 }}
              />
              <span className="text-gray-400 text-sm">Event type</span>
              <input
                className="w-32 bg-gray-800 border-none rounded px-2 py-2 text-white focus:outline-none text-center font-mono"
                defaultValue="data"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold">Start</button>
            </div>
            {/* The rest of the area is empty and dark */}
            <div className="flex-1" />
          </div>
        );
      case 'socketio':
        return (
          <div className="flex flex-col flex-1 bg-gray-900 rounded p-4 mt-2">
            {/* Top bar */}
            <div className="flex items-center gap-4 mb-4">
              <select className="bg-gray-800 border-none rounded px-3 py-2 text-white font-semibold">
                <option>Client v4</option>
                <option>Client v3</option>
              </select>
              <input
                className="flex-1 bg-gray-800 border-none rounded px-4 py-2 text-white focus:outline-none"
                placeholder="wss://echo-socketio.hoppscotch.io"
                defaultValue="wss://echo-socketio.hoppscotch.io"
                style={{ minWidth: 0 }}
              />
              <input
                className="w-40 bg-gray-800 border-none rounded px-4 py-2 text-white focus:outline-none"
                placeholder="/socket.io"
                defaultValue="/socket.io"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold">Connect</button>
            </div>
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-800 mb-2">
              <button className="px-2 py-1 border-b-2 border-blue-500 font-semibold">Communication</button>
              <button className="px-2 py-1 text-gray-400">Authorization</button>
            </div>
            {/* Event/Topic Name */}
            <div className="flex items-center gap-2 mt-4 mb-2">
              <span className="text-blue-400">
                <span className="material-icons">rss_feed</span>
              </span>
              <input
                className="flex-1 bg-gray-800 border-none rounded px-4 py-2 text-white focus:outline-none"
                placeholder="Event/Topic Name"
              />
            </div>
            {/* Message Input Area */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400">Message</span>
                <select className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm">
                  <option>JSON</option>
                  <option>Text</option>
                </select>
              </div>
              <textarea
                className="flex-1 bg-transparent text-white border-none resize-none outline-none"
                placeholder="Message"
                rows={6}
              />
              <div className="flex items-center gap-2 mt-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded font-semibold">Send</button>
                <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
                  <input type="checkbox" className="accent-blue-600" /> Clear input
                </label>
                <button className="ml-auto text-gray-400 hover:text-white" title="Help">
                  <span className="material-icons">help_outline</span>
                </button>
                <button className="text-gray-400 hover:text-white" title="History">
                  <span className="material-icons">history</span>
                </button>
                <button className="text-gray-400 hover:text-white" title="Format">
                  <span className="material-icons">format_align_left</span>
                </button>
                <button className="text-gray-400 hover:text-white" title="Copy">
                  <span className="material-icons">content_copy</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'mqtt':
        return (
          <div className="flex flex-col flex-1 bg-gray-900 rounded p-4 mt-2">
            {/* Top bar */}
            <div className="flex items-center gap-4 mb-4">
              <input
                className="flex-1 bg-gray-800 border-none rounded px-4 py-2 text-white focus:outline-none"
                placeholder="wss://test.mosquitto.org:8081"
                defaultValue="wss://test.mosquitto.org:8081"
                style={{ minWidth: 0 }}
              />
              <span className="text-gray-400 text-sm">Client ID</span>
              <input
                className="w-40 bg-gray-800 border-none rounded px-4 py-2 text-white focus:outline-none font-mono"
                placeholder="Client ID"
                defaultValue="hoppscotch"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold">Connect</button>
              <label className="flex items-center gap-2 ml-4">
                <input type="checkbox" className="accent-blue-600" defaultChecked />
                <span className="text-gray-400 text-sm">Clean Session</span>
              </label>
            </div>
            {/* Connection Config Section */}
            <div className="text-gray-400 font-semibold mb-2 mt-2">Connection Config</div>
            <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center h-10">
                <span className="text-gray-400">Username</span>
              </div>
              <div className="flex items-center h-10">
                <span className="text-gray-400">Last-Will Topic</span>
              </div>
              <div className="flex items-center h-10">
                <span className="text-gray-400">Password</span>
              </div>
              <div className="flex items-center h-10">
                <span className="text-gray-400">Last-Will Message</span>
              </div>
              <div className="flex items-center h-10">
                <span className="text-gray-400">Keep Alive <span className="text-white font-bold ml-1">60</span></span>
              </div>
              <div className="flex items-center h-10">
                <span className="text-gray-400">Last-Will QoS</span>
                <select className="ml-2 bg-gray-800 border-none rounded px-2 py-1 text-white">
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                </select>
              </div>
              <div className="flex items-center h-10"></div>
              <div className="flex items-center h-10">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" />
                  <span className="text-gray-400">Last-Will Retain</span>
                </label>
              </div>
            </div>
            <div className="flex-1" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-full bg-black text-white select-none" style={{ userSelect: dragging ? 'none' : undefined }}>
      {/* Left Main Panel */}
      <div className="flex flex-col p-6" style={{ width: leftWidth }}>
        {/* Protocol Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-800 mb-4">
          {PROTOCOLS.map((protocol) => (
            <button
              key={protocol.key}
              className={`px-2 py-1 flex items-center gap-2 focus:outline-none transition-colors duration-150 font-semibold ${selectedProtocol === protocol.key ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setSelectedProtocol(protocol.key)}
            >
              <span className="material-icons">{protocol.icon}</span> {protocol.label}
            </button>
          ))}
        </div>
        {/* Connection Input */}
        <div className="flex items-center gap-4 mb-4">
          <input
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none"
            placeholder="wss://echo-websocket.hoppscotch.io"
            defaultValue="wss://echo-websocket.hoppscotch.io"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold">Connect</button>
        </div>
        {/* Communication/Protocols Tabs */}
        <div className="flex gap-6 border-b border-gray-800 mb-2">
          <button className="px-2 py-1 border-b-2 border-blue-500 font-semibold">Communication</button>
          <button className="px-2 py-1 text-gray-400">Protocols</button>
        </div>
        {/* Protocol-specific UI */}
        {renderProtocolUI()}
      </div>
      {/* Draggable Divider */}
      <div
        ref={dividerRef}
        className={`w-1.5 cursor-col-resize transition-colors duration-150 ${dragging ? 'bg-blue-600' : 'bg-gray-800 hover:bg-blue-500'}`}
        onMouseDown={handleMouseDown}
        style={{ zIndex: 10 }}
      />
      {/* Right Help/Shortcuts Panel */}
      {selectedProtocol === 'mqtt' ? (
        <div className="flex-1 flex h-full flex-col">
          {/* Horizontal tabs at the top */}
          <div className="flex border-b border-gray-800">
            <div className="px-6 py-3 font-bold text-white border-b-2 border-blue-500">All Topics</div>
            {/* Add more tabs here if needed */}
          </div>
          {/* Centered help/shortcuts */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Send Request</span>
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">Ctrl ↵</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Keyboard shortcuts</span>
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">Ctrl /</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Search & command menu</span>
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">Ctrl K</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Help menu</span>
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">?</span>
              </div>
              <a
                href="#"
                className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center border-l border-gray-800 p-8">
          <div className="flex flex-col gap-4 items-start">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Send Request</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">Ctrl ↵</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Keyboard shortcuts</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">Ctrl /</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Search & command menu</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">Ctrl K</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Help menu</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">?</span>
            </div>
            <a
              href="#"
              className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Realtime; 