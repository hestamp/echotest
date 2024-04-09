import React, { useEffect, useState } from 'react'
import styles from './TimeScroller.module.css'

const TimePicker = ({ timeValue, setTimeValue, period, setPeriod }) => {
  useEffect(() => {
    setTimeValue(9)
    setPeriod('am')
  }, [])

  if (!timeValue || !setTimeValue || !period || !setPeriod) {
    return <></>
  }

  const handleScroll = (event) => {
    setTimeValue(parseFloat(event.target.value))
  }

  const handleClick = (event) => {
    const clickX = event.clientX - event.target.getBoundingClientRect().left
    const clickPercentage = (clickX / event.target.offsetWidth) * 100
    const newValue = (clickPercentage / 100) * 12 // Assuming 12 represents the max range
    setTimeValue(newValue)
  }

  const togglePeriod = (newper) => {
    setPeriod(newper)
  }

  const convertValueToTime = (value) => {
    const hours = Math.floor(value)
    const minutes = (value % 1) * 60
    return `${hours === 0 ? '12' : hours}:${minutes === 0 ? '00' : '30'}`
  }

  const time = convertValueToTime(timeValue)

  const hourLines = []
  for (let i = 0; i < 12; i++) {
    hourLines.push(
      <div
        key={i}
        className={`${styles.line} ${i == 6 ? styles.midd : ''}`}
        style={{ left: `${i * 8.333}%`, opacity: `${i === 0 ? 0 : 1}` }}
      ></div>
    )
  }

  return (
    <div className={styles.timeScroller}>
      <div className={styles.scaleContainer}>
        <div className={styles.scale}>
          {hourLines}
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={timeValue}
            className={styles.slider}
            onChange={handleScroll}
          />
        </div>
        <div onClick={handleClick} className={styles.hidden} />
      </div>

      <div className={styles.timeandbutt}>
        <div className={`${styles.oneflex} ${styles.timeDisplay}`}>
          <h2>
            {time} {period}
          </h2>
        </div>
        <div className={`${styles.oneflex} ${styles.buttblock}`}>
          <button
            onClick={() => togglePeriod('am')}
            className={`${styles.toggleButton} ${
              period === 'am' && styles.activeButt
            }`}
          >
            am
          </button>
          <button
            onClick={() => togglePeriod('pm')}
            className={`${styles.toggleButton} ${
              period === 'pm' && styles.activeButt
            }`}
          >
            pm
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimePicker
