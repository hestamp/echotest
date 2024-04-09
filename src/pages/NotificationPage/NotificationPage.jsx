import React from 'react'
import { PageStructure } from '@/components/'
import styles from './NotificationPage.module.css'
import { useMyNotification } from '@/storage'

const NotificationPage = () => {
  const { uIsTimeModal, uFirstTimeNotif } = useMyNotification()

  const showTimeModal = () => {
    uIsTimeModal(true)
    uFirstTimeNotif(true)
  }
  return (
    <>
      <PageStructure name={'Notifications'}>
        <div className={styles.textblock}>
          <img className={styles.logoimg} src="/guide/guide.notif.webp" />
          <button className={styles.setnotif} onClick={showTimeModal}>
            Set notifications
          </button>
          <p className={styles.gray}>
            We sends notifications to help you stay on track with your learning
            goals. Here's what you need to know:
          </p>

          <p>
            <strong>Setting Notification Time:</strong> During your first use of
            the app, you'll be prompted to set a notification time. This is the
            time when you'll receive notifications to repeat echoes.
          </p>
          <p>
            <strong>Notification Content:</strong> If there are echoes to repeat
            for the day, you'll receive a notification with a list of echoes. If
            there are no echoes to repeat, you'll receive a reminder to learn
            something new and create a new echo.
          </p>
        </div>
      </PageStructure>
    </>
  )
}

export default NotificationPage
