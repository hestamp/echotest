import styles from './StatPage.module.css';
import { Link } from 'react-router-dom';
import { useMyStats } from '../../storage';
import { AchiveBar } from '@/components/';
import useAuth from '@/hooks/Auth/useAuth';
const StatPage = () => {
  const { activeLevel } = useMyStats();

  const { userData } = useAuth();

  return (
    <div className={styles.statPage}>
      <div className={styles.paddingblock}>
        <h3>Statistics</h3>
        <img className={styles.images} src="/avatar.webp" />
        <h4>{userData?.fullName || 'User'}</h4>
        {userData ? (
          <div className={styles.statdiv}>
            <div className={styles.statblock}>
              {activeLevel ? (
                <AchiveBar numbs nonames activeAchive={activeLevel} />
              ) : (
                <></>
              )}
              <div className={styles.longsapp}>
                <h4>Current level:</h4>
                <p>{userData?.stats?.level || 0}</p>
              </div>
              <div className={styles.longsapp}>
                <h4>Total Echoes:</h4>
                <p>{userData?.stats?.totalEchos || 0}</p>
              </div>
              <div className={styles.longsapp}>
                <h4>Repetitions:</h4>
                <p>{userData?.stats?.learnedTimes || 0}</p>
              </div>
              <div className={styles.longsapp}>
                <h4>Current days streak:</h4>
                <p>{userData?.stats?.repetitionEchoes?.count || 0}</p>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* <p className={styles.gray}>
          Under construction... <br></br>
          <br></br>Soon you will be able to see your full statistics{' '}
        </p> */}

        <Link to={'/main'} className={styles.backhome}>
          Calendar Plan
        </Link>
      </div>
    </div>
  );
};

export default StatPage;
