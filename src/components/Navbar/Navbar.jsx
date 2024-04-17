import styles from './Navbar.module.css';
import { RiUser4Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { useMyLogic } from '@/storage';
import { TbMenu2 } from 'react-icons/tb';
import { AchiveBar } from '@/components/';
import { useMyStats } from '../../storage';
import { memo } from 'react';

const Navbar = memo(() => {
  const { uIsSidebar } = useMyLogic();
  const { activeLevel } = useMyStats();

  const activeSidebar = () => {
    uIsSidebar(true);
  };

  const disableSidebar = () => {
    uIsSidebar(false);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.paddingblock2}>
        <button onClick={activeSidebar} className={styles.activebutt}>
          <TbMenu2 onClick={activeSidebar} className={styles.menu} />
        </button>
        {activeLevel ? (
          <Link onClick={disableSidebar} className={styles.rest} to={'/stats'}>
            <AchiveBar activeAchive={activeLevel} />
          </Link>
        ) : (
          <></>
        )}
        <Link
          onClick={disableSidebar}
          className={styles.activebutt}
          to={'/settings'}
        >
          <RiUser4Line onClick={disableSidebar} />
        </Link>
      </div>
    </div>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
