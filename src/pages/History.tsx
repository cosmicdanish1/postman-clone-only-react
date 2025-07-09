import React from 'react';

const History: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center">
      <div className="text-xs text-zinc-400 mb-2">No history yet</div>
      <div className="text-zinc-400 mb-4">Your request history will appear here.</div>
    </div>
  );
};

export default History; 