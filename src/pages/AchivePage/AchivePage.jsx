import { useCallback, useEffect, useState } from 'react';
import styles from './AchivePage.module.css';

import { ProgressBar, MySpinner, MyNewModal, AchiveModal } from '@/components/';
import { MdDone } from 'react-icons/md';
import { useMyAchive, useMyLogic, useMyUser } from '@/storage';

import { useTelegram } from '@/hooks/useTelegram';

import { Link, useNavigate } from 'react-router-dom';
const AchivePage = () => {
  const { allAchives, uAllAchives } = useMyAchive();
  const { WEBAPP_URL } = useMyLogic();

  const { myUserData } = useMyUser();

  const [notCheckedArr, setNotCheckedArr] = useState([]);
  const [notCheckedAchive, setNotCheckedAchive] = useState(null);

  const navigate = useNavigate();
  const { mountBtn } = useTelegram();


  const createFunc = () => {
    navigate('/echo/create');
  };

  useEffect(() => {
    mountBtn(createFunc, 'Create echo');
  }, []);
  
  useEffect(() => {
    if (allAchives) {
      const firstDoneArr = allAchives.filter(
        (achievement) => achievement.done && achievement.checked == false
      );

      if (firstDoneArr.length) {
        setNotCheckedArr(firstDoneArr);
        setNotCheckedAchive(firstDoneArr[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (notCheckedArr.length && notCheckedAchive == null) {
      setNotCheckedAchive(notCheckedArr[0]);
    }
  }, [notCheckedArr]);

  const checkOnServer = async (checkId) => {
    try {
      const response = await fetch(`${WEBAPP_URL}/api/auth/achive/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authId: myUserData.authId,
          achiveId: checkId,
          checked: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response not JSON');
      }

      await response.json();
    } catch (error) {
      // console.error()
    }
  };

  const recieveFunc = useCallback(async () => {
    const updateAchive = notCheckedAchive;
    updateAchive.checked = true;

    const filteredNotCheckedArr = notCheckedArr.filter(
      (item) => item.id != updateAchive.id
    );

    // console.log(filteredNotCheckedArr)
    setNotCheckedArr(filteredNotCheckedArr);

    const newAllAchive = allAchives.map((achive) => {
      return updateAchive.id === achive.id
        ? { ...achive, checked: true }
        : achive;
    });
    // console.log(newAllAchive)
    uAllAchives(newAllAchive);

    if (filteredNotCheckedArr.length) {
      setNotCheckedAchive(filteredNotCheckedArr[0]);
    }

    await checkOnServer(updateAchive.id);
  }, [allAchives, notCheckedAchive, notCheckedArr]);

  return (
    <div className={styles.achivePage}>
      <MyNewModal noClose isOpen={notCheckedArr.length}>
        <AchiveModal recieveFunc={recieveFunc} achiveObj={notCheckedAchive} />
      </MyNewModal>
      <h3>Achivements</h3>

      {allAchives ? (
        <>
          <div className={styles.gridContainer}>
            {allAchives.map((item, id) => {
              const isDone = item ? item.done : false;
              return (
                <div
                  key={id}
                  className={`${styles.gridItem} ${
                    isDone ? styles.gridComplete : styles.gridOk
                  }`}
                >
                  <div className={styles.achiveOne}>
                    <img
                      className={`${styles.achimage} ${
                        !isDone ? styles.notDone : ''
                      }`}
                      alt={item.name}
                      src={item.img}
                    />
                    <div className={styles.textblock}>
                      <h3>{item.name}</h3>
                      <p>{item.desc}</p>
                    </div>

                    <div className={styles.progressbar}>
                      {!isDone ? (
                        <ProgressBar
                          value={item.current}
                          height={9}
                          maxValue={item.goal}
                        />
                      ) : (
                        <MdDone className={styles.donemark} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <MySpinner />
      )}
      <p className={styles.gray}>
        Under construction... <br></br>
        <br></br>You will recieve all achivements after this page will be
        completed!{' '}
      </p>
      <Link to={'/main'} className={styles.backhome}>
        Main page
      </Link>
    </div>
  );
};

export default AchivePage;
