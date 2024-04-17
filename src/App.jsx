import { useCallback, useEffect } from 'react';
import 'balloon-css';
import styles from './App.module.css';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

import {
  EditEchoPage,
  NewEchoPage,
  EchoSystemPage,
  NotificationPage,
  HowToUsePage,
  InfoPage,
  StatPage,
  AchivePage,
  GuidePage,
  SettingsPage,
  MainPage,
} from '@/pages';

import { telegramApp, useTelegram } from './hooks/useTelegram';
import {
  useMyGuide,
  useMyLogic,
  useMyMainContext,
  useMyNotification,
  useMyQuote,
  useMyStats,
  useMyToaster,
  useMyUser,
} from './storage';

import { levelNamesBar, staticAchiveNames } from './slug/data';

import { quotesDayArray } from './static/quotes';

import {
  EchoReader,
  EchoRemover,
  Navbar,
  NotificationPicker,
  MySidebar,
  MyNewModal,
  MyLoader,
} from '@/components/';

import { getRandomQuote } from './utils/textUtils';
import EchoChecker from './components/EchoChecker/EchoChecker';
import { slugData } from './utils/slugdata';

function App() {
  const navigate = useNavigate();

  const locationCheck = useLocation();

  const isMainPage = locationCheck.pathname === '/';
  const { myQuote, uMyQuote, isQuotes, uIsQuotes } = useMyQuote();
  const { checkrunAndExpand } = useTelegram();

  const { uTaskArr, uActiveEcho } = useMyMainContext();

  const { myUserData, uMyUserData, uUserTz, uGetUserData } = useMyUser();

  const {
    echoModal,
    WEBAPP_URL,
    isLoading,
    uIsLoading,
    backButtMounted,
    uBackButtMounted,
    settingButtMounted,
    uSettingButtMounted,
    uEchoModal,
    uCrudMode,
    crudMode,
    platformCheck,
    uPlatformCheck,
    isSidebar,
    uIsSidebar,
    isSendData,
    setIsSendData,
  } = useMyLogic();

  const { successToast, errorToast } = useMyToaster();

  const { setActiveLvl } = useMyStats();

  const {
    isTimeModal,
    uIsTimeModal,
    userNotifTime,
    firstTimeNotif,
    uFirstTimeNotif,
  } = useMyNotification();

  const {
    // isTourGuideCache,
    uIsCheckGuide,
    uIsTourGuideCache,
    uMainPageGuide,
    uCreateEchoGuide,
    uIsReadGuide,
  } = useMyGuide();

  useEffect(() => {
    checkrunAndExpand();

    const isGuideDone = localStorage.getItem('guide');
    const isActiveQuote = localStorage.getItem('quotes');
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
    if (isActiveQuote == 'false') {
      uIsQuotes(false);
    } else {
      uIsQuotes(true);
    }
  }, []);

  useEffect(() => {
    const newTz = dayjs.tz.guess();

    const userTimeZone =
      newTz || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    localStorage.setItem('timezone', userTimeZone);

    uUserTz(newTz);
  }, []);

  useEffect(() => {
    if (echoModal && isSidebar) {
      uIsSidebar(false);
    }
  }, [echoModal, isSidebar]);

  const authUser = async (tgid, initDataUnsafe, platform) => {
    let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!userTimeZone || userTimeZone === 'undefined') {
      userTimeZone = 'UTC';
    }

    try {
      uIsLoading(true);
      uGetUserData(false);
      const response = await fetch(`${WEBAPP_URL}/api/auth/userdata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tgid: tgid || null,
          tgdata: initDataUnsafe || {},
          platform: platform || 'unknown',
          timezone: userTimeZone || 'UTC',
        }),
      });

      const responseData = await response.json();

      if (responseData.error) {
        errorToast(`${responseData.message}`);
      }
      if (responseData.user) {
        const userObj = responseData.user;
        // console.log(userObj)
        setIsSendData(true);
        uTaskArr(userObj.echos);
        uMyUserData(userObj);
        if (userObj.notifications.time) {
          localStorage.setItem('notif1', 'true');
        }
        if (userObj.guides.start) {
          localStorage.setItem('guide', 'true');
          navigate('/main');
        }
        if (userObj.guides.main) {
          localStorage.setItem('maintour', 'true');
          uMainPageGuide(true);
        }
        if (userObj.guides.create) {
          localStorage.setItem('createtour', 'true');
          uCreateEchoGuide(true);
        }
      }
      // console.log(responseData)
    } catch (error) {
      errorToast(`Something went wrong \n Please, reload the app`);
    } finally {
      uIsLoading(false);
      uGetUserData(true);
    }
  };

  const backButt = () => {
    navigate(-1);
    uIsSidebar(false);
  };

  const goSetting = () => {
    navigate('/settings');
  };

  useEffect(() => {
    if (telegramApp?.initDataUnsafe?.user?.id && !isSendData) {
      const initDataUnsafe = telegramApp.initDataUnsafe;
      const tgid = telegramApp.initDataUnsafe.user.id;
      const platform = telegramApp.platform;

      authUser(tgid, initDataUnsafe, platform);
      // console.log('trigger auth data')
    } else {
      uGetUserData(true);
      uTaskArr(slugData.echos);
      uMyUserData(slugData);
    }

    if (!backButtMounted) {
      telegramApp.BackButton.onClick(() => backButt());
      uBackButtMounted(true);
    }

    if (!settingButtMounted) {
      telegramApp.SettingsButton.onClick(() => goSetting());

      uSettingButtMounted(true);
    }
  }, []);

  useEffect(() => {
    const localLaunchNotif = localStorage.getItem('notif1');

    if (
      myUserData &&
      myUserData.stats.totalEchos == 1 &&
      myUserData.notifications.echoes == true &&
      myUserData.notifications.time == null &&
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
  }, [myUserData]);

  useEffect(() => {
    if (telegramApp.platform != 'unknown') {
      uPlatformCheck(telegramApp.platform);
    } else {
      uPlatformCheck('unknown');
    }
  }, [telegramApp?.platform]);

  useEffect(() => {
    if (!myQuote && quotesDayArray) {
      const newQuote = getRandomQuote(quotesDayArray);
      uMyQuote(newQuote);
    }

    telegramApp.SettingsButton.show();
  }, [myQuote]);

  const closeFullModal = useCallback(() => {
    uEchoModal(false);
    uCrudMode(null);
    uActiveEcho(null);
  }, []);

  useEffect(() => {
    if (myUserData) {
      const activeL = {
        name: `Level ${myUserData.stats.level + 1}: ${
          levelNamesBar[myUserData.stats.level]
        }`,
        current: myUserData.stats.exp,
        goal: (myUserData.stats.level + 1) * 100,
      };
      setActiveLvl(activeL);
    }
  }, [myUserData]);

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
          <MySidebar sidebarOpen={isSidebar} setSidebarOpen={uIsSidebar}>
            {!isMainPage && <Navbar />}
            <div className={styles.routewrap}>
              <Routes>
                <Route exact path="/main" element={<MainPage />} />
                <Route exact path="/settings" element={<SettingsPage />} />
                <Route exact path="/" element={<GuidePage />} />
                <Route exact path="/achivements" element={<AchivePage />} />
                <Route exact path="/stats" element={<StatPage />} />
                <Route exact path="/info" element={<InfoPage />} />
                <Route exact path="/info/howto" element={<HowToUsePage />} />
                <Route exact path="/info/system" element={<EchoSystemPage />} />
                <Route
                  exact
                  path="/info/notif"
                  element={<NotificationPage />}
                />
                <Route exact path="/echo/create" element={<NewEchoPage />} />
                <Route exact path="/echo/edit" element={<EditEchoPage />} />
              </Routes>
            </div>

            <div className="onepix"></div>
          </MySidebar>
        </div>
      </div>
    </div>
  );
}

export default App;
