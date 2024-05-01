import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EchoCreator.module.css';

import { MyInput, MyTextarea, AddLinksBlock } from '@/components/';
import { isDayStreakDone } from '@/utils/objUtils';
import { telegramApp, useTelegram } from '@/hooks/useTelegram';

import { useMyLogic, useMyMainContext } from '@/storage';
import { errorToast, noteToast, successToast } from '@/utils/toast';
import { WEBAPP_URL } from '@/config/constants';
import useAuth from '@/hooks/Auth/useAuth';

const EchoCreator = () => {
  const { taskArr, uTaskArr } = useMyMainContext();
  const { userData, setUserData } = useAuth();
  const { uEchoModal, platformCheck } = useMyLogic();

  const { mountBtn } = useTelegram();
  const navigate = useNavigate();
  const [newEchoName, uNewEchoName] = useState('');
  const [newEchoContext, uNewEchoContext] = useState('');
  const [isAddLink, setIsAddLink] = useState(false);
  const [editLink, setEditLink] = useState('');
  const [editMode, setEditMode] = useState('add');
  const [linkArr, setLinkArr] = useState([]);
  const [currentEdited, setCurrentEdited] = useState();

  const currentDate = new Date();
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);

  const options = { day: 'numeric', month: 'long' };
  const formattedDate = tomorrow.toLocaleDateString('en-US', options);

  let newerr = null;
  const createEcho = async (newEchoData, newDate, newStat) => {
    const streakStat = newStat;
    const streakDate = newDate;
    try {
      const response = await fetch(`${WEBAPP_URL}/api/auth/echos/create`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authId: userData.authId,
          newEcho: newEchoData,
          repStat: streakStat,
          repDate: streakDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response not JSON');
      }

      const data = await response.json();

      if (data) {
        if (data.userStats) {
          setUserData((prevUserData) => ({
            ...prevUserData,
            stats: data.userStats,
          }));
        }
      } else {
        errorToast('Problem with creating echo');
      }
    } catch (error) {
      // console.error()

      errorToast(`Something went wrong. Please try again. ${error}`);

      if (error?.response?.status === 429) {
        errorToast('Too many requests. Please wait a little bit.');
      }
    }
  };

  const updateStatDates = (date, isStreak) => {
    const newDate = date || new Date().toISOString();

    let newStat;
    if (isStreak == 0) {
      newStat = userData.stats.repetitionEchoes.count;
      if (userData.stats.repetitionEchoes.last == null) {
        newStat = 1;
      }
    } else if (isStreak == 1) {
      newStat = userData.stats.repetitionEchoes.count + 1;
    } else {
      newStat = 0;
    }

    setUserData((prevUserData) => ({
      ...prevUserData,
      stats: {
        ...prevUserData.stats,
        repetitionEchoes: {
          count: newStat,
          last: newDate,
        },
      },
    }));

    return { newDate, newStat };
  };

  const handleAddTask = async () => {
    const currentDate = new Date();
    const intervals = [0, 1, 3, 10, 30, 60];

    const dates = intervals.map((interval) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + interval);
      return date.toISOString();
    });

    const iddate = new Date().toISOString();

    const newTask = {
      name: newEchoName,
      lvl: 1,
      dates: dates,
      links: linkArr || [],
      content: newEchoContext,
      active: true,
      next: dates[1],
      completed: false,
      repetition: {
        1: { totalWords: 0, answers: 0, correct: 0, perc: 0, tries: 0 },
        2: { totalWords: 0, answers: 0, correct: 0, perc: 0, tries: 0 },
        3: { totalWords: 0, answers: 0, correct: 0, perc: 0, tries: 0 },
        4: { totalWords: 0, answers: 0, correct: 0, perc: 0, tries: 0 },
        5: { totalWords: 0, answers: 0, correct: 0, perc: 0, tries: 0 },
      },
      id: iddate,
    };

    let linkRecord = null;
    let contentRecord = null;

    if (newEchoContext.length >= 300) {
      contentRecord = true;
    }
    if (linkArr.length >= 5) {
      linkRecord = true;
    }
    const newArrTaksker = [...taskArr, newTask];
    uTaskArr((prevTaskArr) => {
      const newTaskArr = [...prevTaskArr, newTask];

      return newTaskArr;
    });
    setUserData((prevUserData) => ({
      ...prevUserData,
      echos: newArrTaksker,
      stats: {
        ...prevUserData.stats,
        totalEchos: prevUserData.stats.totalEchos + 1,
        learnedTimes: prevUserData.stats.learnedTimes + 1,
      },
    }));
    uNewEchoName('');
    uNewEchoContext('');
    uEchoModal(false);
    successToast('New echo created');
    navigate('/main');
    const userTimezone = userData.timezone;

    const lastDate =
      userData.stats.repetitionEchoes.last != null
        ? userData.stats.repetitionEchoes.last
        : new Date().toISOString();

    const dateNow = new Date().toISOString();

    const resultIsStreak = isDayStreakDone(dateNow, lastDate, userTimezone);

    const { newDate, newStat } = updateStatDates(dateNow, resultIsStreak);

    const data = await createEcho(newTask, newDate, newStat);
  };

  const processForm = async () => {
    if (newEchoName.length > 1) {
      await handleAddTask();
    } else {
      noteToast('Fill echo name');
    }
  };

  const processFormButt = useCallback(async () => {
    await processForm();
  }, [newEchoName, newEchoContext, linkArr]);

  useEffect(() => {
    telegramApp.BackButton.show();
    mountBtn(processFormButt, 'Create');
  }, []);

  useEffect(() => {
    mountBtn(processFormButt, 'Create');
  }, [processFormButt]);

  const closeEdit = () => {
    setEditMode('add');
    setEditLink('');
    setIsAddLink(false);
  };

  const addcurrentLink = () => {
    const urlRegex = /^(https?:\/\/)/;

    if (urlRegex.test(editLink)) {
      try {
        new URL(editLink);

        setLinkArr((prevLinkArr) => {
          const newLinkArr = [...prevLinkArr, editLink];
          return newLinkArr;
        });
        setEditLink('');
        setIsAddLink(false);
        successToast('Link is added');
      } catch (error) {
        errorToast('Link is not correct');
      }
    } else {
      errorToast('The provided link is not a valid URL');
    }
  };

  const removeFunction = (id) => {
    const filteredLinks = linkArr.filter((item) => item != linkArr[id]);
    setLinkArr(filteredLinks);
  };

  const editFunction = (id) => {
    setEditMode('edit');
    setCurrentEdited(id);
    const currentLink = linkArr[id];
    setEditLink(currentLink);
    setIsAddLink(true);
  };

  const saveEditedLink = () => {
    const newArr = [...linkArr];

    const urlRegex = /^(https?:\/\/)/;

    if (urlRegex.test(editLink)) {
      try {
        new URL(editLink);

        newArr[currentEdited] = editLink;
        setLinkArr(newArr);
        setEditLink('');
        setEditMode('add');
        setCurrentEdited(null);
        setIsAddLink(false);
        successToast('Link is edited');

        setEditLink('');
      } catch (error) {
        errorToast('Link is not correct');
      }
    } else {
      errorToast('The provided link is not a valid URL');
    }
  };

  return (
    <div className={styles.echocreator}>
      <h3>New echo</h3>
      {newerr && <p>{JSON.stringify(newerr, null, 2)}</p>}
      <div className={styles.inputblock}>
        <div className={`newinput ${styles.inputDiv}`}>
          <MyInput
            value={newEchoName}
            placeholder="Short name"
            autoFocus
            onChange={(e) => uNewEchoName(e.target.value)}
            maxLength={33}
            type="text"
          />
        </div>
        <div className={`newtextarea ${styles.inputDiv}`}>
          <MyTextarea
            value={newEchoContext}
            placeholder="What you want to learn?"
            onChange={(e) => uNewEchoContext(e.target.value)}
            type="text"
          />
        </div>
        <div className={`newlinks ${styles.inputDiv}`}>
          <AddLinksBlock
            linkArr={linkArr}
            isAddLink={isAddLink}
            setIsAddLink={setIsAddLink}
            setEditLink={setEditLink}
            editLink={editLink}
            editMode={editMode}
            closeEdit={closeEdit}
            addcurrentLink={addcurrentLink}
            removeFunction={removeFunction}
            editFunction={editFunction}
            saveEditedLink={saveEditedLink}
          />
        </div>
      </div>
      <div className={`newdates ${styles.inputsome}`}>
        {formattedDate && (
          <p className={styles.gray}>
            First repetition will be <strong>{formattedDate}</strong>
          </p>
        )}
      </div>
      {platformCheck == 'unknown' ? (
        <button
          onClick={processFormButt}
          className={`guidecreate ${styles.addbutt}`}
        >
          <span> Create</span>
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default EchoCreator;
