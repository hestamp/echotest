import { useCallback, useEffect, useState } from 'react'
import styles from './SettingsPage.module.css'
import { MyInput, MyToggle } from '@/components/'
import {
  useMyLogic,
  useMyNotification,
  useMyQuote,
  useMyToaster,
  useMyUser,
} from '@/storage'

import { telegramApp, useTelegram } from '@/hooks/useTelegram'

const SettingsPage = () => {
  const { myUserData, uMyUserData } = useMyUser()
  const { uIsQuotes } = useMyQuote()
  const { WEBAPP_URL } = useMyLogic()
  const { successToast, errorToast } = useMyToaster()
  const [tempName, setTempName] = useState('')
  const [tempQuoteBool, setTempQuoteBool] = useState(true)

  const {
    getAllNotif,
    uGetAllNotif,
    getEchoNotif,
    uGetEchoNotif,
    uIsTimeModal,
    uFirstTimeNotif,
    emptyReminder,
    uEmptyReminder,
  } = useMyNotification()

  const { mountBtn } = useTelegram()

  const showTimeModal = () => {
    uIsTimeModal(true)
    uFirstTimeNotif(true)
  }

  const toggleMyQuote = () => {
    const newStat = !tempQuoteBool
    if (newStat == false) {
      localStorage.setItem('quotes', 'false')
    } else {
      localStorage.setItem('quotes', 'true')
    }
    uIsQuotes(newStat)
    setTempQuoteBool(newStat)
  }
  const toggleMyBasicNotif = () => {
    const newStat = !getAllNotif

    uGetAllNotif(newStat)
  }
  const toggleMyEchoNotif = () => {
    const newStat = !getEchoNotif

    uGetEchoNotif(newStat)
  }
  const toggleMyEmptyReminder = () => {
    const newStat = !emptyReminder

    uEmptyReminder(newStat)
  }

  useEffect(() => {
    if (myUserData) {
      setTempName(myUserData?.fullName || '')

      if (myUserData.quotes) {
        const userQuotes = myUserData.quotes == 'false' ? false : true
        uIsQuotes(userQuotes)
        setTempQuoteBool(userQuotes)
      }
    }
  }, [myUserData])

  const clearStorage = () => {
    localStorage.clear()

    if (window.location && window.location.reload) {
      successToast('Cache was cleared! \n App reloading...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      successToast('Cache was cleared! \n Please reload app')
    }
  }

  useEffect(() => {
    telegramApp.BackButton.show()
  }, [])

  const setSettings = async () => {
    const valueQuote = tempQuoteBool == true ? 'true' : 'false'

    const newTime = myUserData.notifications.time
      ? myUserData.notifications.time
      : null

    uMyUserData((prevUserData) => ({
      ...prevUserData,
      fullName: tempName,
      quotes: valueQuote,
      notifications: {
        basic: getAllNotif,
        echoes: getEchoNotif,
        time: newTime,
        empty: emptyReminder,
      },
    }))
    successToast('Settings was saved')
    try {
      const response = await fetch(`${WEBAPP_URL}/api/auth/setting/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: tempName,
          quotes: valueQuote,
          notifications: {
            basic: getAllNotif,
            echoes: getEchoNotif,
            time: newTime,
            empty: emptyReminder,
          },
          authId: myUserData.authId,
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok.')
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response not JSON')
      }

      const data = await response.json()

      if (data?.success) {
        // console.log(first)
      } else {
        errorToast('Something went wrong.\nPlease try again')
      }
    } catch (error) {
      errorToast('Something went wrong.\nPlease try again')
      if (error?.response?.status === 429) {
        errorToast('Too many requests.\nWait a little bit')
      } else {
        console.error(error)

        errorToast('Something went wrong.\nPlease reload the page')
      }
    }
  }

  const processFormButt2 = useCallback(async () => {
    await setSettings()
  }, [
    tempName,
    tempQuoteBool,
    getAllNotif,
    getEchoNotif,
    emptyReminder,
    myUserData?.notifications?.time,
  ])

  useEffect(() => {
    mountBtn(processFormButt2, 'Save')
  }, [])

  useEffect(() => {
    mountBtn(processFormButt2, 'Save')
  }, [processFormButt2])

  return (
    <div className={styles.settingPage}>
      {myUserData ? (
        <>
          <div className={styles.paddingblock}>
            <h3>Settings</h3>
            <div className={styles.accordContent}>
              <h4>Name</h4>
              <MyInput
                value={tempName}
                placeholder="Enter name"
                onChange={(e) => setTempName(e.target.value)}
                maxLength={21}
                type="text"
                stylez={styles.myinputs}
              />

              <div className={styles.notifications}>
                <h3>Notifications</h3>
                <div className={styles.toggleBlock}>
                  <h4>Basic</h4>
                  <MyToggle
                    toggleStatus={getAllNotif}
                    toggleChange={toggleMyBasicNotif}
                    toggleId="notif-toggle"
                    toggleName=""
                  />
                </div>
                {/* <div className={styles.somehr} /> */}
                <div className={styles.toggleBlock}>
                  <h4>Echo repeat</h4>
                  <MyToggle
                    toggleStatus={getEchoNotif}
                    toggleChange={toggleMyEchoNotif}
                    toggleId="echo-toggle"
                    toggleName=""
                  />
                </div>
                {getEchoNotif ? (
                  <>
                    <div onClick={showTimeModal} className={styles.settime}>
                      <p>
                        {myUserData.notifications.time
                          ? myUserData.notifications.time
                          : 'No time'}
                      </p>
                      <button className={styles.editButt}>
                        {myUserData.notifications.time ? 'Edit' : 'Set'}
                      </button>
                    </div>
                    <div className={styles.toggleBlock}>
                      <h4>Empty day reminder</h4>
                      <MyToggle
                        toggleStatus={emptyReminder}
                        toggleChange={toggleMyEmptyReminder}
                        toggleId="echo-empty"
                        toggleName=""
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className={styles.notifications}>
                <h3>Rest</h3>
                <div className={styles.toggleBlock}>
                  <h4>Show quotes</h4>
                  <MyToggle
                    toggleStatus={tempQuoteBool}
                    toggleChange={toggleMyQuote}
                    toggleId="quote-toggle"
                    toggleName=""
                  />
                </div>
              </div>
              {/* <p>Name error</p> */}
            </div>

            <button
              className={`${styles.mybutt} ${styles.whiteButt}`}
              onClick={clearStorage}
            >
              Clear cache
            </button>

            {/* <button
              onClick={setSettings}
              className={`${styles.mybutt} ${styles.blueButt}`}
            >
              Save
            </button> */}
          </div>
        </>
      ) : (
        <>
          <p>Loading...</p>
        </>
      )}
    </div>
  )
}

export default SettingsPage
