import styles from './AchiveBar.module.css';
import ProgressBar from '../ProgressBar/ProgressBar';
import { MdDone } from 'react-icons/md';

const AchiveBar = ({ activeAchive, nonames, numbs }) => {
  return (
    <>
      <div className={styles.achive}>
        {!nonames && (
          <div className={styles.namecount}>
            <h4>{activeAchive.name || 'Achive'}</h4>
            {activeAchive.done && (
              <div className={styles.donemark}>
                <MdDone />
              </div>
            )}
          </div>
        )}
        <ProgressBar
          value={activeAchive.current || 0}
          maxValue={activeAchive.goal || 1}
        />
        {numbs && (
          <div className={styles.numbs}>
            <p>{activeAchive.current || 0} xp</p>
            <p>{activeAchive.goal || 1} xp</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AchiveBar;
