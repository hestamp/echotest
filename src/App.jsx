import { useCallback, useEffect } from 'react';
import 'balloon-css';
import styles from './App.module.css';
import { useNavigate, useRoutes } from 'react-router-dom';

import { telegramApp, useTelegram } from './hooks/useTelegram';
import {
  useMyGuide,
  useMyLogic,
  useMyMainContext,
  useMyNotification,
  useMyStats,
} from './storage';

import { levelNamesBar } from './slug/data';

import {
  EchoReader,
  EchoRemover,
  NotificationPicker,
  MyNewModal,
  MyLoader,
} from '@/components/';

import EchoChecker from './components/EchoChecker/EchoChecker';
import router from './pages/router';
import useAuth from './hooks/Auth/useAuth';

function App() {
  const navigate = useNavigate();

  const { checkrunAndExpand } = useTelegram();

  const { uActiveEcho } = useMyMainContext();

  const { userData } = useAuth();

  const {
    echoModal,
    isLoading,
    uEchoModal,
    uCrudMode,
    crudMode,
    platformCheck,
    uPlatformCheck,
  } = useMyLogic();

  const { setActiveLvl } = useMyStats();

  const {
    isTimeModal,
    uIsTimeModal,
    userNotifTime,
    firstTimeNotif,
    uFirstTimeNotif,
  } = useMyNotification();

  const {
    uIsCheckGuide,
    uIsTourGuideCache,
    uMainPageGuide,
    uCreateEchoGuide,
    uIsReadGuide,
  } = useMyGuide();

  useEffect(() => {
    checkrunAndExpand();

    const isGuideDone = localStorage.getItem('guide');
    const isTourGuideMain = localStorage.getItem('maintour');
    const isTourGuideCreate = localStorage.getItem('createtour');
    const isReadGuide = localStorage.getItem('readtour');
    const isCheckGuide = localStorage.getItem('checktour');

    const localLaunch = localStorage.getItem('notif1');

    if (localLaunch != 'true') {
      uFirstTimeNotif(true);
    }

    if (isGuideDone) {
      navigate('/main');
    }

    if (isReadGuide == 'true') {
      uIsReadGuide(true);
    } else {
      uIsReadGuide(false);
    }
    if (isCheckGuide == 'true') {
      uIsCheckGuide(true);
    } else {
      uIsCheckGuide(false);
    }

    if (isTourGuideMain == 'true') {
      uMainPageGuide(true);
    } else {
      uMainPageGuide(false);
    }
    if (isTourGuideCreate == 'true') {
      uCreateEchoGuide(true);
    } else {
      uCreateEchoGuide(false);
    }
    uIsTourGuideCache(true);
  }, []);

  useEffect(() => {
    if (userData) {
      if (userData.notifications?.time) {
        localStorage.setItem('notif1', 'true');
      }
      if (userData.guides?.start) {
        localStorage.setItem('guide', 'true');
        navigate('/main');
      }
      if (userData.guides?.main) {
        localStorage.setItem('maintour', 'true');
        uMainPageGuide(true);
      }
      if (userData.guides?.create) {
        localStorage.setItem('createtour', 'true');
        uCreateEchoGuide(true);
      }
    }
  }, []);

  useEffect(() => {
    const localLaunchNotif = localStorage.getItem('notif1');

    if (
      userData &&
      userData.stats.totalEchos == 1 &&
      userData.notifications.echoes == true &&
      userData.notifications.time == null &&
      userNotifTime == null &&
      localLaunchNotif != 'true'
    ) {
      const timeout = setTimeout(() => {
        uIsTimeModal(true);
        uFirstTimeNotif(true);
      }, 3000);

      // Clear the timeout after it triggers
      return () => clearTimeout(timeout);
    }
  }, [userData]);

  useEffect(() => {
    if (telegramApp.platform != 'unknown') {
      uPlatformCheck(telegramApp.platform);
    } else {
      uPlatformCheck('unknown');
    }
  }, [telegramApp?.platform]);

  const closeFullModal = useCallback(() => {
    uEchoModal(false);
    uCrudMode(null);
    uActiveEcho(null);
  }, []);

  useEffect(() => {
    if (userData) {
      const activeL = {
        name: `Level ${userData.stats.level + 1}: ${
          levelNamesBar[userData.stats.level]
        }`,
        current: userData.stats.exp,
        goal: (userData.stats.level + 1) * 100,
      };
      setActiveLvl(activeL);
    }
  }, [userData]);

  const routes = useRoutes(router);

  return (
    <div className={styles.App}>
      <MyLoader isLoading={isLoading} />
      <div className={styles.appBlock}>
        <div
          className={`${styles.mainpage} ${
            platformCheck == 'unknown' ? styles.notapp : ''
          }`}
        >
          <MyNewModal isOpen={echoModal} onClose={closeFullModal}>
            <div className={styles.main}>
              <div className={styles.mainImgBlock}>
                {crudMode === 'read' ? (
                  <EchoReader />
                ) : crudMode == 'remove' ? (
                  <EchoRemover />
                ) : crudMode == 'check' ? (
                  <EchoChecker />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </MyNewModal>
          <MyNewModal noClose isOpen={isTimeModal && firstTimeNotif}>
            <NotificationPicker />
          </MyNewModal>
          {routes}
        </div>
      </div>
    </div>
  );
}

export default App;
