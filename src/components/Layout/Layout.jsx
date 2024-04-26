import { memo, useCallback, useState } from 'react';
import ReactSidebar from 'react-sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '..';
import Sidebar from './Sidebar';
import AppStyles from '../../App.module.css';
import styles from './Sidebar.module.css';

const Layout = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const openSidebar = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);
  console.log('Layout');
  return (
    <ReactSidebar
      sidebar={
        <Sidebar openSidebar={openSidebar} closeSidebar={closeSidebar} />
      }
      open={isOpen}
      rootClassName={styles.sidebarRoot}
      sidebarClassName={styles.sidebar}
      contentClassName={styles.content}
      overlayClassName={styles.overlay}
      onSetOpen={openSidebar}
      styles={{ sidebar: { background: 'white' } }}
    >
      {pathname !== '/' && (
        <Navbar openSidebar={openSidebar} closeSidebar={closeSidebar} />
      )}
      <div className={AppStyles.routewrap}>
        <Outlet />
      </div>
      <div className="onepix"></div>
    </ReactSidebar>
  );
});

Layout.displayName = 'Layout';

export default Layout;
