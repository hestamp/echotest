import styles from './Navbar.module.css';
import { RiUser4Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { TbMenu2 } from 'react-icons/tb';
import { AchiveBar } from '@/components/';
import { useMyStats } from '../../storage';
import { memo } from 'react';

const Navbar = memo(({ openSidebar, closeSidebar }) => {
  const { activeLevel } = useMyStats();

  return (
    <div className={styles.navbar}>
      <div className={styles.paddingblock2}>
        <button onClick={openSidebar} className={styles.activebutt}>
          <TbMenu2 className={styles.menu} />
        </button>
        {activeLevel && (
          <Link onClick={closeSidebar} className={styles.rest} to="/stats">
            <AchiveBar activeAchive={activeLevel} />
          </Link>
        )}
        <Link
          onClick={closeSidebar}
          className={styles.activebutt}
          to={'/settings'}
        >
          <RiUser4Line />
        </Link>
      </div>
    </div>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
