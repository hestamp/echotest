import { useState } from 'react';
import TimePicker from '../TimePicker/TimePicker';

import styles from './NotificationPicker.module.css';
import {
  useMyLogic,
  useMyNotification,
  useMyToaster,
  useMyUser,
} from '@/storage';

const NotificationPicker = () => {
  const {
    isTimeModal,
    uIsTimeModal,
    showModalTime,
    uShowModalTime,
    userNotifTime,
    uUserNotifTime,
    userNotifMode,
    uUserNotifMode,
    firstTimeNotif,
    uFirstTimeNotif,
  } = useMyNotification();

  // const [fulltime, setFulltime] = useState('');

  const { WEBAPP_URL } = useMyLogic();

  const { myUserData, uMyUserData } = useMyUser();

  const { successToast, errorToast } = useMyToaster();

  const noThanks = () => {
    uIsTimeModal(false);
    uShowModalTime(false);
    uFirstTimeNotif(false);
    localStorage.setItem('notif1', 'true');
  };

  const setNewTime = async (newTime) => {
    try {
      const response = await fetch(`${WEBAPP_URL}/api/auth/setting/notiftime`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newtime: newTime,
          authId: myUserData.authId,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response not JSON');
      }

      const data = await response.json(); // Convert response to JSON
      // console.log(data)

      if (data?.success) {
        successToast('Time for notifications was set');
      } else {
        errorToast('Something went wrong.\nPlease try again');
      }
    } catch (error) {
      errorToast('Something went wrong.\nPlease try again');
      if (error?.response?.status === 429) {
        errorToast('Too many requests.\nWait a little bit');
      } else {
        // console.error(error)

        errorToast('Something went wrong.\nPlease reload the page');
      }
    }
  };

  const convertValueToTime = (value) => {
    const hours = Math.floor(value);
    const minutes = (value % 1) * 60;
    return `${hours === 0 ? '12' : hours}:${minutes === 0 ? '00' : '30'}`;
  };

  const userPickNotifTime = async () => {
    noThanks();
    const time = convertValueToTime(userNotifTime);
    const newNotifTime = `${time} ${userNotifMode}`;

    uMyUserData((prevUserData) => ({
      ...prevUserData,
      notifications: { ...prevUserData.notifications, time: newNotifTime },
    }));

    await setNewTime(newNotifTime);
  };

  return (
    <div className={styles.notifPicker}>
      <h3>Echo reminder</h3>
      <p className={styles.graytext}>
        Pick a time - bot will remind you to learn your echos every day
      </p>
      <TimePicker
        timeValue={userNotifTime}
        setTimeValue={uUserNotifTime}
        period={userNotifMode}
        setPeriod={uUserNotifMode}
      />
      <p className={styles.graytext2}>
        * you can change it later in settings *
      </p>
      <div className={styles.content}>
        <div className={styles.buttblock}>
          {firstTimeNotif ? (
            <button
              onClick={noThanks}
              className={`${styles.mybutt} ${styles.whiteButt}`}
            >
              Later
            </button>
          ) : (
            <></>
          )}

          <button
            onClick={userPickNotifTime}
            className={`${styles.mybutt} ${styles.blueButt}`}
          >
            Pick time
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPicker;
