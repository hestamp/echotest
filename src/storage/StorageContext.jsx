import { successToast } from '@/utils/toast';
import { createContext, useMemo, useRef, useState } from 'react';

export const StorageContext = createContext();

export const MyStorageProvider = ({ children }) => {
  const initialFunction = () => {
    successToast('empty func');
  };

  //MainPage // Array of echos

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

  // Logic
  const [echoModal, uEchoModal] = useState(false);
  const [isLoading, uIsLoading] = useState(false);

  const [crudMode, uCrudMode] = useState(null);
  const [platformCheck, uPlatformCheck] = useState('unknown');
  const [settingButtMounted, uSettingButtMounted] = useState(false);

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
      mainpage: {
        todayMode,
        setTodayMode,
        selectedDate,
        setSelectedDate,
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
        echoModal,
        uEchoModal,
        crudMode,
        uCrudMode,
        isLoading,
        uIsLoading,
        platformCheck,
        uPlatformCheck,

        settingButtMounted,
        uSettingButtMounted,
      },

      achivements: { allAchives, uAllAchives, activeAchive, uActiveAchive },
    }),
    [
      activeAchive,
      activeEcho,
      activeLevel,
      allAchives,
      createEchoGuide,
      crudMode,
      echoModal,
      emptyReminder,
      firstTimeNotif,
      getAllNotif,
      getEchoNotif,
      isCheckGuide,
      isLoading,
      isReadGuide,

      isTimeModal,
      isTourGuideCache,
      mainButtFunc,
      mainPageGuide,
      pickedDateEchos,
      platformCheck,
      selectedDate,
      settingButtMounted,
      showModalTime,
      todayMode,
      userNotifMode,
      userNotifTime,
    ]
  );

  return (
    <StorageContext.Provider value={storageContextData}>
      <div className={`theme `}>{children}</div>
    </StorageContext.Provider>
  );
};
