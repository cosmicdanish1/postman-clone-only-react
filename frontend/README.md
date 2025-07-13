# React Postman Clone

A modern, modular API client inspired by Postman, built with React, TypeScript, and Vite. Supports REST, GraphQL, and Realtime protocols (WebSocket, SSE, MQTT, Socket.IO), with a feature-based folder structure and extensible UI.

---

## 🚀 Features
- **Tabbed API requests** (REST, GraphQL, Realtime)
- **Collections, History, Environments, and Share** pages
- **Settings** with theme, general, and interceptor options
- **Modern, modular codebase** (feature-based folders, reusable components)
- **Drag-and-drop, Monaco editor, and more**

---

## 📁 Project Structure

```
src/
├── App.tsx                # Root app component, sets up routing and layout
├── main.tsx               # Entry point, renders App to the DOM
├── store.ts               # Redux store setup
├── types.ts               # Shared TypeScript types and interfaces
├── constants/             # Shared constants
│   └── index.ts
├── utils/                 # Utility/helper functions
│   └── helpers.ts
├── context/               # React context providers
│   └── ThemeContext.tsx
├── features/              # Redux slices and feature state
│   └── settingsSlice.ts
├── components/            # Shared UI components
│   ├── Layout.tsx         # Main layout with sidebar and content
│   ├── NavBar.tsx         # Top navigation bar
│   ├── BottomBar.tsx      # Footer/status bar
│   ├── Sidebar.tsx        # Main sidebar navigation
│   ├── TabsBar.tsx        # Main tabs bar for open requests
│   ├── TabContentArea.tsx # Main tab content area (REST)
│   ├── ...                # (Sortable rows, modals, helpers, etc.)
│   └── TabContentArea/    # REST tab content components
│       ├── ParametersTabContent.tsx
│       ├── BodyTabContent.tsx
│       ├── HeadersTabContent.tsx
│       ├── AuthorizationTabContent.tsx
│       ├── VariablesTabContent.tsx
│       ├── PreRequestTabContent.tsx
│       ├── PostRequestTabContent.tsx
│       └── SortableVariableRow.tsx
├── pages/                 # Feature-based pages (route entry points)
│   ├── Rest/              # REST API client feature
│   │   ├── RestPage.tsx           # Main REST page (tabbed requests)
│   │   ├── RequestEditor.tsx      # Request editor UI
│   │   ├── RequestPanel.tsx       # Request panel (details, controls)
│   │   ├── ParametersTab.tsx      # Parameters tab
│   │   ├── BodyTab.tsx            # Body tab
│   │   ├── AuthorizationTab.tsx   # Authorization tab
│   │   └── RestSubSidebar.tsx     # REST sidebar
│   ├── GraphQL/           # GraphQL API client feature
│   │   ├── GraphQL.tsx            # Main GraphQL page (tabbed requests)
│   │   ├── GraphQLTabBar.tsx      # Tab bar for GraphQL tabs
│   │   ├── GraphQLTabContentArea.tsx # Tab content area
│   │   ├── GraphQLQueryEditor.tsx # Query editor
│   │   ├── GraphQLVariablesEditor.tsx # Variables editor
│   │   ├── GraphQLTopBar.tsx      # Endpoint input bar
│   │   ├── GraphQLHelpPanel.tsx   # Help/documentation panel
│   │   └── GraphQLSecondaryTabBar.tsx # Secondary tab bar
│   ├── Realtime/          # Realtime protocols (WebSocket, SSE, MQTT, Socket.IO)
│   │   ├── Realtime.tsx           # Main Realtime page
│   │   ├── WebSocketPanel.tsx     # WebSocket protocol panel
│   │   ├── SSEPanel.tsx           # SSE protocol panel
│   │   ├── SocketIOPanel.tsx      # Socket.IO protocol panel
│   │   ├── MQTTPanel.tsx          # MQTT protocol panel
│   │   ├── CommunicationTab.tsx   # Communication tab
│   │   ├── RealtimeProtocolTabBar.tsx # Protocol tab bar
│   │   └── RealtimeHelpPanel.tsx  # Help/documentation panel
│   ├── Collections/       # Collections feature
│   │   ├── Collections.tsx        # Collections page
│   │   └── CollectionsSubSidebar.tsx # Sidebar for collections
│   ├── Environments/      # Environments feature
│   │   └── Environments.tsx      # Environments page
│   ├── History/           # History feature
│   │   └── History.tsx           # History page
│   ├── Share/             # Share feature
│   │   └── Share.tsx             # Share page
│   ├── Settings/          # Settings feature
│   │   ├── SettingsPanel.tsx     # Main settings panel
│   │   ├── GeneralSettings.tsx   # General settings
│   │   ├── ThemeSettings.tsx     # Theme customization
│   │   ├── InterceptorSettings.tsx # Interceptor settings
│   │   └── InterceptorCard.tsx   # Interceptor card UI
│   └── Settings.tsx       # Settings page entry
├── assets/                # Static assets (icons, themes, styles)
│   ├── icons/
│   ├── themes/
│   └── scss/
└── ...
```

---

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

---

## 📝 Contributing
- PRs and issues welcome!
- See comments at the top of each file for detailed documentation.

---

## 📄 License
MIT
