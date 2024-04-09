import React, { useState } from 'react'
import styles from './MyInput.module.css'
const MyInput = ({
  type,
  stylez,
  onChange,
  value,
  myref,
  maxLength,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const characterCount = maxLength ? `${value.length}/${maxLength}` : ''
  const counterClassName =
    value.length === maxLength && isFocused
      ? `${styles.maxCounter} ${styles.appear}`
      : ''
  return (
    <div className={styles.inputContainer}>
      <input
        onChange={onChange}
        type={type || 'text'}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxLength={maxLength}
        ref={myref ? myref : null}
        className={`${styles.Input} ${stylez ? stylez : ''}`}
        {...rest}
      />
      {maxLength && isFocused && (
        <div className={`${styles.characterCounter} ${counterClassName}`}>
          {characterCount}
        </div>
      )}
    </div>
  )
}

export default MyInput
