import React, { useEffect, useState } from 'react'
import styles from './PageStructure.module.css'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { telegramApp } from '@/hooks/useTelegram'
const PageStructure = ({ name, children }) => {
  const navigate = useNavigate()

  const backButt = () => {
    navigate(-1)
  }

  const [showArrow, setShowArrow] = useState(false)

  useEffect(() => {
    if (telegramApp.platform != 'unknown') {
      setShowArrow(true)
    }
  }, [])
  return (
    <div className={styles.page}>
      <div className={styles.paddingblock}>
        <div className={styles.arrowName}>
          <button style={{ opacity: showArrow ? 1 : 0 }} onClick={backButt}>
            <MdArrowBackIosNew />
          </button>
          <h3>{name || 'Page'}</h3>
          <button style={{ opacity: 0 }}>
            <MdArrowBackIosNew />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}

export default PageStructure
