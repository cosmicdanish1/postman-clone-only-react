// File: App.tsx
// Type: Root App Component
// Imports: BrowserRouter, Routes, Route (react-router-dom), Layout, HoppscotchClone, Settings, Collections, History, NavBar, BottomBar, Realtime, GraphQL
// Imported by: main.tsx
// Role: Main entry point for the React app, sets up routing and layout.
// Located at: src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { SearchProvider } from './contexts/SearchContext';

import Layout from './components/Layout';
import HoppscotchClone from './pages/Rest/RestPage';
import Settings from './pages/Settings';
import Collections from './pages/Rest/RightPanel/Collections';
import History from './pages/Rest/RightPanel/History';
import GenerateCode from './pages/Rest/RightPanel/GenerateCode';
import NavBar from './components/NavBar';
import BottomBar from './components/BottomBar';
import Realtime from './pages/Realtime/Realtime';
import GraphQL from './pages/GraphQL/GraphQL';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <SearchProvider>
        <div className="scrollbar-hide">
          <Router>
            <NavBar />
            <Layout>
              <Routes>
                <Route path="/" element={<HoppscotchClone />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/history" element={<History />} />
                <Route path="/generate-code" element={<GenerateCode />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/realtime" element={<Realtime />} />
                <Route path="/graphql" element={<GraphQL />} />
              </Routes>
            </Layout>
            <BottomBar />
          </Router>
        </div>
      </SearchProvider>
    </I18nextProvider>
  );
}

export default App;
