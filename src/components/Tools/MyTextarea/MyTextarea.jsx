import React, { useState } from 'react'
import styles from './MyTextarea.module.css'
const MyTextarea = ({ type, style, onChange, value, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div className={styles.inputContainer}>
      <textarea
        onChange={onChange}
        type={type || 'text'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        rows={12}
        style={{ whiteSpace: 'pre-wrap' }}
        className={`${styles.Input} ${style ? style : ''}`}
        {...rest}
      />
      {isFocused && value.length != 0 && (
        <div className={`${styles.characterCounter}`}>{value.length}</div>
      )}
    </div>
  )
}

export default MyTextarea
