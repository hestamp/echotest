import { useCallback, useEffect, useState } from 'react';
import styles from './EchoEditor.module.css';
import { useNavigate } from 'react-router-dom';

import { MyTextarea, AddLinksBlock, MyInput } from '@/components/';
import { useMyLogic, useMyMainContext, useMyUser } from '@/storage';

import { telegramApp, useTelegram } from '@/hooks/useTelegram';
import { errorToast, successToast } from '@/utils/toast';
import { WEBAPP_URL } from '@/config/constants';

const EchoEditor = () => {
  const { taskArr, uTaskArr, activeEcho, uActiveEcho } = useMyMainContext();
  const navigate = useNavigate();
  const { myUserData, uMyUserData } = useMyUser();
  const { uEchoModal } = useMyLogic();
  const { mountBtn } = useTelegram();

  const [tempName, setTempName] = useState('');
  const [tempContent, setTempContent] = useState('');
  const [isAddLink, setIsAddLink] = useState(false);
  const [linkArr, setLinkArr] = useState([]);
  const [editLink, setEditLink] = useState('');
  const [editMode, setEditMode] = useState('add');
  const [currentEdited, setCurrentEdited] = useState(null);

  useEffect(() => {
    if (activeEcho) {
      setTempName(activeEcho.name);
      setTempContent(activeEcho.content);
      setLinkArr(activeEcho.links);
    }
  }, []);

  const updateEcho = async () => {
    if (activeEcho) {
      const updatedEcho = {
        ...activeEcho,
        name: tempName,
        content: tempContent,
        links: linkArr,
      };

      const updatedTaskArr = [...taskArr];

      const indexToUpdate = updatedTaskArr.findIndex(
        (task) => task.id === activeEcho.id
      );

      if (indexToUpdate !== -1) {
        updatedTaskArr[indexToUpdate] = updatedEcho;
        uTaskArr(updatedTaskArr);
      }
      navigate('/main');
      successToast('Echo updated');
      if (myUserData?.authId) {
        await editServerEcho(updatedEcho);
      }

      uEchoModal(false);
      uActiveEcho(null);
    }
  };

  const editServerEcho = async (newEchoData) => {
    const echoId = newEchoData.id;
    const updatedEchoData = newEchoData;

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

  const removeFunction = (id) => {
    const filteredLinks = linkArr.filter((item) => item != linkArr[id]);
    setLinkArr(filteredLinks);
  };

  const functionForButt = async () => {
    await updateEcho();
  };

  const editFunction = (id) => {
    setEditMode('edit');
    setCurrentEdited(id);
    const currentLink = linkArr[id];
    setEditLink(currentLink);
    setIsAddLink(true);
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

  const closeEdit = () => {
    setEditMode('add');
    setEditLink('');
    setIsAddLink(false);
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

  useEffect(() => {
    telegramApp.BackButton.show();
    mountBtn(processFormButt, 'Edit echo');
  }, []);

  const processFormButt = useCallback(async () => {
    await functionForButt();
  }, [tempName, tempContent, linkArr]);

  useEffect(() => {
    mountBtn(processFormButt, 'Edit echo');
  }, [processFormButt]);

  const nextDay = new Date(activeEcho.next);

  const options = { day: 'numeric', month: 'long' };
  const formattedDate = nextDay.toLocaleDateString('en-US', options);

  return (
    <div className={styles.echocreator}>
      <h3>Edit</h3>
      <div className={styles.inputblock}>
        <MyInput
          value={tempName}
          placeholder="Enter echo name"
          onChange={(e) => setTempName(e.target.value)}
          maxLength={33}
          type="text"
        />
        <MyTextarea
          value={tempContent}
          placeholder="Content of your echo"
          onChange={(e) => setTempContent(e.target.value)}
          type="text"
        />

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

      {formattedDate ? (
        <p className={styles.gray}>
          Next repetition day is <strong>{formattedDate}</strong>
        </p>
      ) : (
        <></>
      )}

      {/* <button onClick={updateEcho} className={styles.addbutt}>
        <span> Save echo</span>
      </button> */}
    </div>
  );
};

export default EchoEditor;
