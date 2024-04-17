import React, { useEffect, useState } from "react";
import styles from "./EchoRemover.module.css";

import {
  useMyLogic,
  useMyMainContext,
  useMyToaster,
  useMyUser,
} from "@/storage";

const EchoRemover = () => {
  const {
    taskArr,
    uTaskArr,
    activeEcho,
    uActiveEcho,
    pickedDateEchos,
    setPickedDateEchos,
  } = useMyMainContext();

  const { myUserData, uMyUserData } = useMyUser();

  const {
    crudMode,
    uCrudMode,
    echoModal,
    uEchoModal,
    WEBAPP_URL,
    platformCheck,
  } = useMyLogic();
  const { successToast, errorToast } = useMyToaster();
  const [tempName, setTempName] = useState("");
  const [tempContent, setTempContent] = useState("");

  const [linkArr, setLinkArr] = useState([]);

  useEffect(() => {
    if (activeEcho) {
      setTempName(activeEcho.name);
      setTempContent(activeEcho.content);
      setLinkArr(activeEcho.links);
    }
  }, [activeEcho]);

  const removeFunc = async () => {
    const newArr = taskArr.filter((item) => item.id !== activeEcho.id);
    const newArrPicked = pickedDateEchos.filter(
      (item) => item.id !== activeEcho.id
    );
    uTaskArr(newArr);
    setPickedDateEchos(newArrPicked);
    closeModal();
    await removeEcho(activeEcho.id);
  };

  const closeModal = () => {
    uCrudMode("create");
    uEchoModal(false);
    uActiveEcho(null);
  };

  const removeEcho = async (echoid) => {
    try {
      const response = await fetch(`${WEBAPP_URL}/api/auth/echos/remove`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authId: myUserData.authId,
          echoId: echoid,
        }),
      });

      if (!response.ok) {
        errorToast("Network response was not ok.");
        throw new Error("Network response was not ok.");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        errorToast("Response not JSON");
        throw new Error("Response not JSON");
      }

      const data = await response.json();

      if (data.success) {
        successToast("Your echo was removed!");
        if (data.userStats) {
          uMyUserData((prevUserData) => ({
            ...prevUserData,
            stats: data.userStats,
          }));
        }
      } else {
        errorToast("Problem with deleting echo");
      }
    } catch (error) {
      // console.error()

      errorToast(`Something went wrong. Please try again. ${error}`);

      if (error?.response?.status === 429) {
        errorToast("Too many requests. Please wait a little bit.");
      }
    }
  };

  return (
    <div className={styles.echocreator}>
      <h3>Remove this echo?</h3>

      <h2>{activeEcho.name || "Echo name"}</h2>
      <h4 className={styles.progress}>
        {" "}
        Echo level progress:
        <span className={`${styles.waves} `}>{activeEcho.lvl || 1}</span>
      </h4>

      <button
        onClick={removeFunc}
        className={`${styles.addbutt} ${styles.redbutt}`}
      >
        <span>Remove</span>
      </button>
      <button onClick={closeModal} className={styles.addbutt}>
        <span> Cancel</span>
      </button>
    </div>
  );
};

export default EchoRemover;
