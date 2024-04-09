import React from 'react'
import styles from './MyNewModal.module.css'
import { MdOutlineClose } from 'react-icons/md'

const MyNewModal = ({
  isOpen,
  onClose,
  modalName,
  modalText,
  children,
  noClose,
}) => {
  if (!isOpen) return null

  return (
    <div onClick={onClose} className={styles.modalOverlay}>
      <div
        className={` ${styles.modalContent} ${styles.maxparams}`}
        onClick={(e) => e.stopPropagation()}
      >
        {modalName && <div className={styles.dialogTitle}>{modalName}</div>}
        {modalText && (
          <div className={styles.dialogDescription}>{modalText}</div>
        )}
        {children}
        {!noClose && (
          <MdOutlineClose
            className={styles.closeButton}
            aria-label="Close"
            onClick={onClose}
          />
        )}
      </div>
    </div>
  )
}

export default MyNewModal
