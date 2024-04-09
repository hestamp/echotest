import React from 'react'
import styles from './MainPage.module.css'
import { formatDateNow } from '@/utils/dateUtils'
const ToggleManu = ({
  formatDate,
  selectedDate,
  toggleMode,
  stringDate,
  todayMode,
}) => {
  console.log('TOOOOOOOOOOOOOOOOOOOOGLE')
  return (
    <div className={styles.echodiv}>
      <div className={styles.echotype}>
        <button
          onClick={() => toggleMode('day')}
          className={`${styles.typebutt} ${
            todayMode == 'day' ? styles.activetype : ''
          }`}
        >
          {formatDate(selectedDate) == stringDate
            ? 'Today'
            : `${formatDateNow(selectedDate)}`}
        </button>
        <h4>|</h4>
        <button
          onClick={() => toggleMode('all')}
          className={`${styles.typebutt} ${
            todayMode == 'all' ? styles.activetype : ''
          }`}
        >
          Active
        </button>

        <h4>|</h4>

        <button
          onClick={() => toggleMode('completed')}
          className={`${styles.typebutt} ${
            todayMode == 'completed' ? styles.activetype : ''
          }`}
        >
          Done{' '}
        </button>
      </div>
    </div>
  )
}

export default React.memo(ToggleManu)
