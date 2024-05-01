import styles from './AchiveBar.module.css';
import ProgressBar from '../ProgressBar/ProgressBar';
import { MdDone } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useMyStats } from '@/storage';

const AchiveBar = ({ nonames, numbs }) => {
  const { activeLevel } = useMyStats();

  if (!activeLevel) {
    return <></>;
  }
  return (
    <Link className={styles.rest} to="/stats">
      <div className={styles.achive}>
        {!nonames && (
          <div className={styles.namecount}>
            <h4>{activeLevel.name || 'Achive'}</h4>
            {activeLevel.done && (
              <div className={styles.donemark}>
                <MdDone />
              </div>
            )}
          </div>
        )}
        <ProgressBar
          value={activeLevel.current || 0}
          maxValue={activeLevel.goal || 1}
        />
        {numbs && (
          <div className={styles.numbs}>
            <p>{activeLevel.current || 0} xp</p>
            <p>{activeLevel.goal || 1} xp</p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default AchiveBar;
