import React from 'react'
import styles from './AchiveModal.module.css'

const AchiveModal = ({ achiveObj, recieveFunc }) => {
  return (
    <div className={styles.achivemodal}>
      <h3>New achivement</h3>
      <div className={`${styles.gridItem} ${styles.gridComplete}`}>
        <div className={styles.achiveOne}>
          <img
            className={`${styles.achimage}`}
            alt={achiveObj.name}
            src={achiveObj.img}
          />
          <div className={styles.textblock}>
            <h3>{achiveObj.name}</h3>
            <p>{achiveObj.desc}</p>
          </div>
        </div>
      </div>
      <button onClick={recieveFunc} className={styles.getButt}>
        Recieve
      </button>
    </div>
  )
}

export default AchiveModal
