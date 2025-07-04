import React from 'react';
import RequestPanel from './RequestPanel';

const CenterPanel: React.FC = () => (
  <div className="flex flex-col flex-1 bg-zinc-900 border-r border-zinc-800">
    <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
      <RequestPanel />
    </div>
  </div>
);

export default CenterPanel; 