import { successToast } from '@/utils/toast';
import { createContext, useMemo, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export const StorageContext = createContext();

export const MyStorageProvider = ({ children }) => {
  //Tour guide

  //Toasters




  const initialFunction = () => {
    successToast('empty func');
  };

  //MainPage // Array of echos
  const [taskArr, uTaskArr] = useState([]);
  const WEBAPP_URL = 'https://c6a0-31-144-132-209.ngrok-free.app';

  const [todayMode, setTodayMode] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);

  //MainPage // Active item
  const [activeEcho, uActiveEcho] = useState(null);
  const [pickedDateEchos, setPickedDateEchos] = useState([]);

  //Main Button
  const [mainButtFunc, uMainButtFunc] = useState(null);
  const [activeMainFunc, uActiveMainFunc] = useState(() => initialFunction);

  //Achivement Storage
  const [allAchives, uAllAchives] = useState(null);
  const [activeAchive, uActiveAchive] = useState(null);

  //UserData
  const [getUserData, uGetUserData] = useState(null);
  const [myUserData, uMyUserData] = useState(null);
  const [userTz, uUserTz] = useState('UTC');

  // Logic
  const [isSendData, setIsSendData] = useState(false);
  const [echoModal, uEchoModal] = useState(false);
  const [isLoading, uIsLoading] = useState(false);

  const [crudMode, uCrudMode] = useState(null);
  const [platformCheck, uPlatformCheck] = useState('unknown');
  const [backButtMounted, uBackButtMounted] = useState(false);
  const [settingButtMounted, uSettingButtMounted] = useState(false);

  //Quotes
  const [isQuotes, uIsQuotes] = useState(null);
  const [myQuote, uMyQuote] = useState(null);

  // Notifications
  const [isTimeModal, uIsTimeModal] = useState(false);
  const [showModalTime, uShowModalTime] = useState(false);
  const [firstTimeNotif, uFirstTimeNotif] = useState(false);
  const [userNotifTime, uUserNotifTime] = useState(null);
  const [userNotifMode, uUserNotifMode] = useState('am');
  const [getAllNotif, uGetAllNotif] = useState(true);
  const [getEchoNotif, uGetEchoNotif] = useState(true);
  const [emptyReminder, uEmptyReminder] = useState(false);

  //Tour giude
  const [isTourGuideCache, uIsTourGuideCache] = useState(false);
  const [mainPageGuide, uMainPageGuide] = useState(false);
  const [createEchoGuide, uCreateEchoGuide] = useState(false);
  const [isReadGuide, uIsReadGuide] = useState(false);
  const [isCheckGuide, uIsCheckGuide] = useState(false);

  const firstRef = useRef();
  const secondRef = useRef();
  const thirdRef = useRef();

  // Statistics
  const [activeLevel, setActiveLvl] = useState(null);

  const storageContextData = useMemo(
    () => ({
      stats: { activeLevel, setActiveLvl },
      guide: {
        isTourGuideCache,
        uIsTourGuideCache,
        mainPageGuide,
        uMainPageGuide,
        createEchoGuide,
        uCreateEchoGuide,
        isReadGuide,
        uIsReadGuide,
        isCheckGuide,
        uIsCheckGuide,
      },
      refs: { firstRef, secondRef, thirdRef },
      notification: {
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
        getAllNotif,
        uGetAllNotif,
        getEchoNotif,
        uGetEchoNotif,
        emptyReminder,
        uEmptyReminder,
      },
      user: {
        myUserData,
        uMyUserData,
        userTz,
        uUserTz,
        getUserData,
        uGetUserData,
      },
      mainpage: {
        todayMode,
        setTodayMode,
        selectedDate,
        setSelectedDate,
        taskArr,
        uTaskArr,
        activeEcho,
        uActiveEcho,
        pickedDateEchos,
        setPickedDateEchos,
      },
      mainButt: {
        activeMainFunc,
        uActiveMainFunc,
        mainButtFunc,
        uMainButtFunc,
      },
      logic: {
        isSendData,
        setIsSendData,
        echoModal,
        uEchoModal,
        crudMode,
        uCrudMode,
        WEBAPP_URL,
        isLoading,
        uIsLoading,
        platformCheck,
        uPlatformCheck,

        backButtMounted,
        uBackButtMounted,
        settingButtMounted,
        uSettingButtMounted,
      },
      quote: { myQuote, uMyQuote, isQuotes, uIsQuotes },
      achivements: { allAchives, uAllAchives, activeAchive, uActiveAchive },
      // toaster: { successToast, errorToast, customToast, noteToast },
    }),
    [
      activeAchive,
      activeEcho,
      activeLevel,
      allAchives,
      backButtMounted,
      createEchoGuide,
      crudMode,
      echoModal,
      emptyReminder,
      firstTimeNotif,
      getAllNotif,
      getEchoNotif,
      getUserData,
      isCheckGuide,
      isLoading,
      isQuotes,
      isReadGuide,
      isSendData,
      isTimeModal,
      isTourGuideCache,
      mainButtFunc,
      mainPageGuide,
      myQuote,
      myUserData,
      pickedDateEchos,
      platformCheck,
      selectedDate,
      settingButtMounted,
      showModalTime,
      taskArr,
      todayMode,
      userNotifMode,
      userNotifTime,
      userTz,
    ]
  );

  return (
    <StorageContext.Provider value={storageContextData}>
      <Toaster />
      <div className={`theme `}>{children}</div>
    </StorageContext.Provider>
  );
};
