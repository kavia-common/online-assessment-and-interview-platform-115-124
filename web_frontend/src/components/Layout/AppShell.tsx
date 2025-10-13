import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useEventLogger } from '../../hooks/useEventLogger';
import { useWebsocketStatus } from '../../services/ws';
import '../../styles/theme.css';

/**
 * AppShell provides the layout with Topbar and Sidebar.
 * It also mounts global event logging listeners.
 */
const AppShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { status } = useWebsocketStatus();
  const { bufferSize } = useEventLogger({ attachGlobal: true });

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} />
      <Topbar
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        connectionIndicator={
          <span className="badge" aria-label={`Connection ${status}`}>
            <span
              style={{
                width: 8, height: 8, borderRadius: 999,
                background: status === 'connected' ? 'limegreen' : status === 'connecting' ? 'orange' : 'crimson'
              }}
            />
            {status}
          </span>
        }
        queueIndicator={<span className="badge" aria-label="Event queue size">log {bufferSize}</span>}
      />
      <main className="main-area" role="main">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
