import { useState, useEffect } from 'react'
import styles from './TypingAnimation.module.css'
const TypingAnimation = ({ text }) => {
  const [displayResponse, setDisplayResponse] = useState('')
  const [completedTyping, setCompletedTyping] = useState(false)

  useEffect(() => {
    if (text) {
      setCompletedTyping(false)
      let i = 0
      const intervalId = setInterval(() => {
        setDisplayResponse(text.slice(0, i))
        i++
        if (i >= text.length) {
          clearInterval(intervalId)
          setCompletedTyping(true)
        }
      }, 20)

      return () => clearInterval(intervalId)
    }
  }, [text])

  const CursorSVG = () => <p className={styles.cursor}> </p>

  return (
      <span className={styles.runcursor}>
        {displayResponse}
        {!completedTyping && <CursorSVG />}
      </span>
  )
}

export default TypingAnimation
