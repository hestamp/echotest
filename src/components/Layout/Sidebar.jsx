import { cloneElement, useCallback } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { Link, NavLink, useLocation } from 'react-router-dom';
import menuLinks from './menulinks';
import styles from './Sidebar.module.css';

const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();

  const isActive = useCallback(
    (to) => {
      if (to === location.pathname) return true;

      if (location.pathname.startsWith(to) && to !== '/') return true;
      return false;
    },
    [location.pathname]
  );

  return (
    <div className={styles.mycontent}>
      <div className={styles.mindecho}>
        <Link onClick={closeSidebar} className={styles.mainlink} to={'/main'}>
          <h1>MindEcho</h1>
        </Link>
        <MdKeyboardArrowLeft
          className={styles.arrowclose}
          onClick={closeSidebar}
        />
      </div>
      <nav className={`${styles.pagesBlock}`}>
        {menuLinks.map((link) => {
          return (
            <NavLink
              key={link.name}
              to={link.link}
              onClick={closeSidebar}
              className={`${
                isActive(link.link) ? styles.activeLink : styles.normalLink
              }`}
            >
              <div className={styles.textIcoBLock}>
                {cloneElement(link.icon, {
                  className: styles.menuIcon,
                })}
                <span>{link.name}</span>
              </div>
              {link.new && <span className={styles.newDiv}>New</span>}
            </NavLink>
          );
        })}
      </nav>
      <div>
        <h4 className={styles.createdby}>
          Created by
          <a
            className={styles.tom}
            href="https://hestamp.com"
            target="_blank"
            rel="noreferrer"
          >
            Tom Hestamp
          </a>
        </h4>
      </div>
    </div>
  );
};

export default Sidebar;
