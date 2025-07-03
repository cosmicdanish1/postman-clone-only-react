import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import logo from '../assets/icons/logo.svg';

const tabs = [
  {
    label: 'REST',
    to: '/',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path fill="currentColor" d="M13.527.099C6.955-.744.942 3.9.099 10.473c-.843 6.572 3.8 12.584 10.373 13.428 6.573.843 12.587-3.801 13.428-10.374C24.744 6.955 20.101.943 13.527.099zm2.471 7.485a.855.855 0 0 0-.593.25l-4.453 4.453-.307-.307-.643-.643c4.389-4.376 5.18-4.418 5.996-3.753zm-4.863 4.861 4.44-4.44a.62.62 0 1 1 .847.903l-4.699 4.125-.588-.588zm.33.694-1.1.238a.06.06 0 0 1-.067-.032.06.06 0 0 1 .01-.073l.645-.645.512.512zm-2.803-.459 1.172-1.172.879.878-1.979.426a.074.074 0 0 1-.085-.039.072.072 0 0 1 .013-.093zm-3.646 6.058a.076.076 0 0 1-.069-.083.077.077 0 0 1 .022-.046h.002l.946-.946 1.222 1.222-2.123-.147zm2.425-1.256a.228.228 0 0 0-.117.256l.203.865a.125.125 0 0 1-.211.117h-.003l-.934-.934-.294-.295 3.762-3.758 1.82-.393.874.874c-1.255 1.102-2.971 2.201-5.1 3.268zm5.279-3.428h-.002l-.839-.839 4.699-4.125a.952.952 0 0 0 .119-.127c-.148 1.345-2.029 3.245-3.977 5.091zm3.657-6.46-.003-.002a1.822 1.822 0 0 1 2.459-2.684l-1.61 1.613a.119.119 0 0 0 0 .169l1.247 1.247a1.817 1.817 0 0 1-2.093-.343zm2.578 0a1.714 1.714 0 0 1-.271.218h-.001l-1.207-1.207 1.533-1.533c.661.72.637 1.832-.054 2.522zm-.1-1.544a.143.143 0 0 0-.053.157.416.416 0 0 1-.053.45.14.14 0 0 0 .023.197.141.141 0 0 0 .084.03.14.14 0 0 0 .106-.05.691.691 0 0 0 .087-.751.138.138 0 0 0-.194-.033z"/>
      </svg>
    ),
  },
  {
    label: 'GraphQl',
    to: '/graphql',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24" viewBox="0 0 21 24">
        <path fill="currentColor" d="M12.731 2.751 17.666 5.6a2.138 2.138 0 1 1 2.07 3.548l-.015.003v5.7a2.14 2.14 0 1 1-2.098 3.502l-.002-.002-4.905 2.832a2.14 2.14 0 1 1-4.079.054l-.004.015-4.941-2.844a2.14 2.14 0 1 1-2.067-3.556l.015-.003V9.15a2.14 2.14 0 1 1 1.58-3.926l-.01-.005c.184.106.342.231.479.376l.001.001 4.938-2.85a2.14 2.14 0 1 1 4.096.021l.004-.015zm-.515.877a.766.766 0 0 1-.057.057l-.001.001 6.461 11.19c.026-.009.056-.016.082-.023V9.146a2.14 2.14 0 0 1-1.555-2.603l-.003.015.019-.072zm-3.015.059-.06-.06-4.946 2.852A2.137 2.137 0 0 1 2.749 9.12l-.015.004-.076.021v5.708l.084.023 6.461-11.19zm2.076.507a2.164 2.164 0 0 1-1.207-.004l.015.004-6.46 11.189c.286.276.496.629.597 1.026l.003.015h12.911c.102-.413.313-.768.599-1.043l.001-.001L11.28 4.194zm.986 16.227 4.917-2.838a1.748 1.748 0 0 1-.038-.142H4.222l-.021.083 4.939 2.852c.39-.403.936-.653 1.54-.653.626 0 1.189.268 1.581.696l.001.002z"/>
      </svg>
    ),
  },
  {
    label: 'Realtime',
    to: '/realtime',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 16 16">
        <path fill="currentColor" d="M1 2h4.257a2.5 2.5 0 0 1 1.768.732L9.293 5 5 9.293 3.732 8.025A2.5 2.5 0 0 1 3 6.257V4H2v2.257a3.5 3.5 0 0 0 1.025 2.475L5 10.707l1.25-1.25 2.396 2.397.708-.708L6.957 8.75 8.75 6.957l2.396 2.397.708-.708L9.457 6.25 10.707 5 7.732 2.025A3.5 3.5 0 0 0 5.257 1H1v1ZM10.646 2.354l2.622 2.62A2.5 2.5 0 0 1 14 6.744V12h1V6.743a3.5 3.5 0 0 0-1.025-2.475l-2.621-2.622-.707.708ZM4.268 13.975l-2.622-2.621.708-.708 2.62 2.622A2.5 2.5 0 0 0 6.744 14H15v1H6.743a3.5 3.5 0 0 1-2.475-1.025Z"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: <FaCog title="Settings" className="text-xl text-zinc-400 group-hover:text-violet-500 cursor-pointer" />,
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const expandNav = useSelector((state: RootState) => state.settings.expandNav);

  return (
    <div
      className={`flex flex-col h-full bg-neutral-900 transition-all duration-300 ${
        expandNav ? 'w-24' : 'w-16'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center py-4">
        <img
          src={logo}
          alt="Logo"
          className={`transition-all duration-300 ${expandNav ? 'w-10 h-10' : 'w-7 h-7'}`}
        />
      </div>
      {/* Sidebar options */}
      <nav className="flex-1 flex flex-col gap-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          return (
            <Link
              key={tab.label}
              to={tab.to}
              className="flex flex-col items-center group relative w-full "
            >
              <span
                title={tab.label}
                className={`w-full flex flex-col items-center py-2  ${isActive ? 'bg-neutral-800' : ''}`}
              >
                {tab.icon}
                {expandNav && <span className="text-[11px] mt-1 text-zinc-300 group-hover:text-violet-400">{tab.label}</span>}
              </span>
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-bar"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar; 