import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './EchoChecker.module.css';
import {
  useMyGuide,
  useMyLogic,
  useMyMainContext,
  useMyUser,
} from '../../storage';
import { getRandomSBD } from '../../utils/textUtils';
import CheckerBlock from '../CheckerBlock/CheckerBlock';
import { isDayStreakDone } from '@/utils/objUtils';
import { TourGuide } from '@/components/Tools/TourGuide/TourGuide';
import { errorToast, successToast } from '@/utils/toast';
import { WEBAPP_URL } from '@/config/constants';

const EchoChecker = () => {
  const { uTaskArr, taskArr, setTodayMode, activeEcho } = useMyMainContext();

  const { myUserData, uMyUserData } = useMyUser();
  const { uEchoModal } = useMyLogic();

  const { isCheckGuide, isTourGuideCache, uIsCheckGuide } = useMyGuide();

  const [renderText, setRenderText] = useState(null);

  useEffect(() => {
    if (activeEcho && renderText == null) {
      const oneSent = getRandomSBD(activeEcho.content);
      setRenderText(oneSent);
    }
  }, [activeEcho, renderText]);

  const updateStatDates = (date, isStreak) => {
    const newDate = date || new Date().toISOString();

    let newStat;
    if (isStreak == 0) {
      newStat = myUserData.stats.repetitionEchoes.count;
      if (myUserData.stats.repetitionEchoes.last == null) {
        newStat = 1;
      }
    } else if (isStreak == 1) {
      newStat = myUserData.stats.repetitionEchoes.count + 1;
    } else {
      newStat = 0;
    }

    uMyUserData((prevUserData) => ({
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

  function updateObjectWithInterval(obj, finish) {
    const intervals = [0, 1, 3, 10, 30, 60];
    const { lvl, dates } = obj;
    const currentDate = new Date();

    // Update the dates array
    const updatedDates = [];

    // Add old dates from obj.dates with indices lower than obj.lvl
    for (let i = 0; i < lvl; i++) {
      updatedDates.push(dates[i]);
    }

    // Update the dates array

    updatedDates.push(currentDate.toISOString());

    if (lvl >= 0 && lvl + 1 < intervals.length) {
      // Update next date based on the interval
      const interval = intervals[lvl + 1];
      const nextDate = new Date(
        currentDate.getTime() + interval * 24 * 60 * 60 * 1000
      );

      for (let i = lvl + 1; i < dates.length; i++) {
        const date = new Date(
          currentDate.getTime() + intervals[i] * 24 * 60 * 60 * 1000
        );
        updatedDates.push(date.toISOString());
      }

      obj.dates = updatedDates;

      obj.next = nextDate.toISOString();
    } else if (lvl == 5 && finish) {
      obj.completed = true;
    }
    obj.lvl = lvl + 1;
    return { obj: obj, completed: finish == true ? true : false };
  }

  const completeRepetition = async (finish) => {
    const newLvl = activeEcho.lvl + 1;

    const oldArr = [...taskArr];
    let updatedItem = null;
    let completedItem = null;

    const arrNewUpdated = oldArr.map((item) => {
      if (item.id === activeEcho.id) {
        const { obj, completed } = updateObjectWithInterval(item, finish);
        updatedItem = obj;
        if (completed) {
          completedItem = true;
        }
        return {
          ...updatedItem,
        };
      }
      return item;
    });
    uMyUserData((prevUserData) => ({
      ...prevUserData,
      stats: {
        ...prevUserData.stats,
        learnedTimes: prevUserData.stats.learnedTimes + 1,
        completedEchoes: completedItem
          ? prevUserData.stats.completedEchoes + 1
          : prevUserData.stats.completedEchoes,
      },

      echos: arrNewUpdated,
    }));

    const userTimezone = myUserData.timezone;

    const lastDate =
      myUserData.stats.repetitionEchoes.last != null
        ? myUserData.stats.repetitionEchoes.last
        : new Date().toISOString();

    const dateNow = new Date().toISOString();

    const resultIsStreak = isDayStreakDone(dateNow, lastDate, userTimezone);

    const { newDate, newStat } = updateStatDates(dateNow, resultIsStreak);

    if (completedItem) {
      successToast(
        `Сongratulations! \n ${activeEcho.name || 'echo was'} \n was finised!`
      );
      finishedItem();
    } else {
      successToast(
        `Your ${newLvl} repetition for \n ${
          activeEcho.name || 'echo'
        } \n was completed!`
      );
    }
    setTodayMode('all');
    uEchoModal(false);
    uTaskArr(arrNewUpdated);

    if (updatedItem != null) {
      await editServerEcho(updatedItem, finish, newDate, newStat);
    }
  };

  const finishedItem = () => {};

  const editServerEcho = async (newEchoData, finish, newDate, newStat) => {
    if (!newEchoData) {
      return null;
    }
    const echoId = newEchoData.id;
    const updatedEchoData = newEchoData;
    const isFinish = finish || false;
    const newDateStreak = newDate;
    const newStatStreak = newStat;

    try {
      const response = await fetch(`${WEBAPP_URL}/api/auth/echos/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authId: myUserData.authId,
          echoId: echoId,
          updatedEchoData: updatedEchoData,
          repeat: true,
          completed: isFinish,
          repDate: newDateStreak,
          repStat: newStatStreak,
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
      if (data && data.userStats) {
        if (data.userStats) {
          uMyUserData((prevUserData) => ({
            ...prevUserData,
            stats: data.userStats,
          }));
        }
      }
    } catch (error) {
      // console.error()

      errorToast(`Something went wrong. Please try again. ${error}`);

      if (error?.response?.status === 429) {
        errorToast('Too many requests. Please wait a little bit.');
      }
    }
  };

  // completeRepetition(false)

  const getNew = useCallback(() => {
    const oneSent = getRandomSBD(activeEcho.content, 1);
    setRenderText(oneSent);
  }, [activeEcho.content]);

  const newSteps = useMemo(
    () => [
      {
        id: 'step-1',
        canClickTarget: false,

        attachTo: { element: '.quizwrap', on: 'bottom' },
        beforeShowPromise: function () {
          return new Promise(function (resolve) {
            setTimeout(function () {
              window.scrollTo(0, 0);
              resolve();
            }, 500);
          });
        },
        when: {
          show: () => {
            localStorage.setItem('checktour', 'true');
            uIsCheckGuide(true);
          },
        },
        buttons: [
          {
            classes: 'shepherd-button-primary',
            text: 'Next',
            type: 'next',
          },
        ],
        title: '1/2 Start of the test',
        text: `Here will be one piece of the text you need to recreate`,
      },

      {
        id: 'step-2',
        attachTo: {
          element: '.optwrap',
          on: 'top',
        },
        canClickTarget: false,
        buttons: [
          {
            classes: 'shepherd-button-secondary',
            text: 'Back',
            type: 'back',
          },
          {
            classes: 'shepherd-button-primary',
            text: 'Finish',
            type: 'next',
          },
        ],
        when: {
          show: () => {},
        },
        title: '2/2 Drag and drop',
        text: 'Pick a word an place it in appropriate place in sentence \n\n When you place correctly all of the words - press <strong>Check Answer</strong> button to finish the test',
      },
    ],
    []
  );

  return (
    <div className={styles.echochecker}>
      {isTourGuideCache && !isCheckGuide ? (
        <TourGuide steps={newSteps} />
      ) : (
        <></>
      )}
      {!activeEcho ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>Pass the test</h3>
          {renderText ? (
            <div className={styles.alltext}>
              <CheckerBlock
                activeEcho={activeEcho}
                completeRepetition={completeRepetition}
                text={renderText}
                lvl={activeEcho.lvl}
              />
              {/* <p>{renderText}</p> */}
              <p className={styles.testtext}>
                This is random sentence from <span>{activeEcho.name}</span>echo
              </p>

              {/* <button className={styles.blueButt} onClick={getNew}>
                Generate
              </button>
              <button
                className={`${styles.blueButt} ${styles.whiteButt}`}
                onClick={clearAll}
              >
                Clear
              </button> */}
            </div>
          ) : (
            <>
              <button className={styles.blueButt} onClick={getNew}>
                Generate
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

// const Word = ({ id, content, index, moveWord }) => {
//   const [{ isDragging }, drag] = useDrag({
//     item: { type: 'WORD', id, index },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   })

//   const [, drop] = useDrop({
//     accept: 'WORD',
//     hover(item) {
//       if (item.index !== index) {
//         moveWord(item.index, index)
//         item.index = index
//       }
//     },
//   })

//   return (
//     <span
//       ref={(node) => drag(drop(node))}
//       style={{ opacity: isDragging ? 0.5 : 1 }}
//     >
//       {content}
//     </span>
//   )
// }

export default EchoChecker;
