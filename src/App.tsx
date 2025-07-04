import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HoppscotchClone from './pages/HoppscotchClone';
import Settings from './pages/Settings';
import Collections from './pages/Collections';
import History from './pages/History';
import Share from './pages/Share';
import NavBar from './components/NavBar';
import BottomBar from './components/BottomBar';
import Environments from './pages/Environments';
import Request from './pages/Request';
import GenerateCode from './pages/GenerateCode';
import Realtime from './pages/Realtime';
import GraphQL from './pages/GraphQL';

function App() {
  return (
    <div className="scrollbar-hide">
      <Router>
        <NavBar />
        <Layout>
          <Routes>
            <Route path="/" element={<HoppscotchClone />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/history" element={<History />} />
            <Route path="/share" element={<Share />} />
            <Route path="/environments" element={<Environments />} />
            <Route path="/request" element={<Request />} />
            <Route path="/generate-code" element={<GenerateCode />} />
            <Route path="/realtime" element={<Realtime />} />
            <Route path="/graphql" element={<GraphQL />} />
          </Routes>
        </Layout>
        <BottomBar />
      </Router>
    </div>
  );
}

export default App;
