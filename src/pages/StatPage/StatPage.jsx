import React from 'react'
import styles from './StatPage.module.css'
import { Link } from 'react-router-dom'
import { MySpinner } from '@/components/'
import { useMyStats, useMyUser } from '../../storage'
import { AchiveBar } from '@/components/'
const StatPage = () => {
  const { activeLevel, setActiveLvl } = useMyStats()

  const { myUserData } = useMyUser()

  return (
    <div className={styles.statPage}>
      <div className={styles.paddingblock}>
        <h3>Statistics</h3>
        <img className={styles.images} src="/avatar.webp" />
        <h4>{myUserData?.fullName || 'User'}</h4>
        {myUserData ? (
          <div className={styles.statdiv}>
            <div className={styles.statblock}>
              {activeLevel ? (
                <AchiveBar numbs nonames activeAchive={activeLevel} />
              ) : (
                <></>
              )}
              <div className={styles.longsapp}>
                <h4>Current level:</h4>
                <p>{myUserData?.stats?.level || 0}</p>
              </div>
              <div className={styles.longsapp}>
                <h4>Total Echoes:</h4>
                <p>{myUserData?.stats?.totalEchos || 0}</p>
              </div>
              <div className={styles.longsapp}>
                <h4>Repetitions:</h4>
                <p>{myUserData?.stats?.learnedTimes || 0}</p>
              </div>
              <div className={styles.longsapp}>
                <h4>Current days streak:</h4>
                <p>{myUserData?.stats?.repetitionEchoes?.count || 0}</p>
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
  )
}

export default StatPage
