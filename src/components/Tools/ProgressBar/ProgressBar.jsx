import React from 'react'
import styles from './ProgressBar.module.css'
const ProgressBar = ({ value, maxValue, markers, height, round }) => {
  const widthPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0

  const generateMarkers = () => {
    const markers = []
    for (let i = 1; i < maxValue; i++) {
      markers.push(
        <div
          key={i}
          className={styles.marker}
          style={{ left: `${(i / maxValue) * 100}%` }}
        />
      )
    }
    return markers
  }

  return (
    <div
      style={{ height: `${height}px` }}
      className={`${styles.progressContainer} ${
        round && styles.roundContainer
      }`}
    >
      <div
        className={`${styles.progressBar} ${round && styles.roundBar}`}
        style={{ width: `${widthPercentage}%`, height: `${height}px` }}
      ></div>
      {markers && generateMarkers()}
    </div>
  )
}

export default ProgressBar
