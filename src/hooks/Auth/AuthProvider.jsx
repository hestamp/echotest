import { WEBAPP_URL } from '@/config/constants';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { telegramApp } from '../useTelegram';
import { errorToast } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { slugData } from '@/utils/slugdata';

dayjs.extend(utc);
dayjs.extend(timezone);

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userTz, uUserTz] = useState('UTC');
  const [taskArr, uTaskArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const authUser = useCallback(async (tgid, initDataUnsafe, platform) => {
    let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!userTimeZone || userTimeZone === 'undefined') {
      userTimeZone = 'UTC';
    }

    try {
      setIsLoading(true);
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
        uTaskArr(userObj.echos);
        setUserData(userObj);
      }
    } catch (error) {
      errorToast(`Something went wrong \n Please, reload the app`);
    } finally {
      setIsLoading(false);
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
    if (telegramApp?.initDataUnsafe?.user?.id) {
      const initDataUnsafe = telegramApp.initDataUnsafe;
      const tgid = telegramApp.initDataUnsafe.user.id;
      const platform = telegramApp.platform;

      authUser(tgid, initDataUnsafe, platform);
    } else {
      uTaskArr(slugData.echos);
      setUserData(slugData);
    }

    telegramApp.BackButton.onClick(() => navigate(-1));
    telegramApp.SettingsButton.onClick(() => navigate('/settings'));
  }, []);

  const values = useMemo(
    () => ({
      userData,
      setUserData,
      userTz,
      taskArr,
      uTaskArr,
      isLoading,
    }),
    [userData, userTz, taskArr, isLoading]
  );

  if (!userData) {
    return null;
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
