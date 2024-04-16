import React from "react";
import styles from "./EchoReader.module.css";
import { useNavigate } from "react-router-dom";
import { MdOutlineLink } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { TourGuide } from "@/components/";
import { useMyLogic, useMyMainContext, useMyToaster } from "@/storage";
import {
  copyToClipboard,
  renderContentWithLineBreaks,
} from "@/utils/textUtils";
import { MenuDropdown } from "@/components/";

import { isTodayMatchingLevelDate } from "@/utils/objUtils";
import { useMyGuide } from "../../storage";
import { formatDateNow } from "@/utils/dateUtils";

const EchoReader = () => {
  const { activeEcho } = useMyMainContext();
  const navigate = useNavigate();
  const { isReadGuide, isTourGuideCache, uIsReadGuide } = useMyGuide();

  const { uEchoModal, uCrudMode } = useMyLogic();

  console.log(activeEcho);
  const { successToast } = useMyToaster();

  const updateFunc = () => {
    uCrudMode("update");
    uEchoModal(false);
    navigate("/echo/edit");
  };

  const delfunc = async () => {
    uCrudMode("remove");
    uEchoModal(true);
  };

  const copyLink = (context) => {
    copyToClipboard(context)
      .then(() => {
        // console.log('Content copied to clipboard successfully')
        successToast("Link copied to clipboard");
      })
      .catch((error) => {
        // console.error('Failed to copy content: ', error)
        // Handle error if necessary
      });
  };
  const copyEcho = () => {
    const context = activeEcho.name + " " + activeEcho.content;
    copyToClipboard(context)
      .then(() => {
        // console.log('Content copied to clipboard successfully')
        successToast("Echo copied to clipboard");
      })
      .catch((error) => {
        // console.error('Failed to copy content: ', error)
        // Handle error if necessary
      });
  };

  const arrFunc = [
    { name: "Copy", func: copyEcho },
    { name: "Edit", func: updateFunc },
    { name: "Remove", func: delfunc },
  ];

  const openCkecker = () => {
    uCrudMode("check");
  };

  const newSteps = [
    {
      id: "step-1",
      canClickTarget: false,

      attachTo: { element: ".tagtrack", on: "bottom" },
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
          localStorage.setItem("readtour", "true");
          uIsReadGuide(true);
        },
      },
      buttons: [
        {
          classes: "shepherd-button-primary",
          text: "Next",
          type: "next",
        },
      ],
      title: "1/2 Learn new",
      text: `Just repeat previously added information to prepare before passing the test `,
    },

    {
      id: "step-2",
      attachTo: {
        element: ".donetag",
        on: "top",
      },
      canClickTarget: false,
      buttons: [
        {
          classes: "shepherd-button-secondary",
          text: "Back",
          type: "back",
        },
        {
          classes: "shepherd-button-primary",
          text: "Finish",
          type: "next",
        },
      ],
      when: {
        show: () => {},
      },
      title: "2/2 Check your knowledge",
      text: "After you learn the information - now its time to pass the test \n\n Algorithm will pick one sentence from your text. Short text is easier, long text is harder. ",
    },
  ];

  const nextLvlv = activeEcho.lvl + 1;
  return (
    <div className={styles.echocreator}>
      {isTourGuideCache && !isReadGuide ? (
        <TourGuide steps={newSteps} />
      ) : (
        <></>
      )}
      {!activeEcho ? (
        <p>Wait or reload the app...</p>
      ) : (
        <>
          <h3>{activeEcho.name}</h3>

          <div className={`${styles.content} tagtrack`}>
            {renderContentWithLineBreaks(activeEcho.content)}
          </div>

          {activeEcho.links && activeEcho.links.length ? (
            <div className={styles.linkarrdiv}>
              {activeEcho.links.map((item, index) => {
                let truncatedContent = item;
                if (item.length > 30) {
                  truncatedContent = item.substring(0, 30) + "...";
                }

                return (
                  <div className={styles.linkdiv} key={index}>
                    <MdOutlineLink
                      className={styles.icon}
                      onClick={() => copyLink(item)}
                    />
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={item}
                      className={styles.itemlink}
                    >
                      {truncatedContent}
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <></>
          )}
          <div className={styles.lvledit}>
            <h3 className={styles.lvlecho}>
              Echo level: <span className={styles.echo}>{activeEcho.lvl}</span>
            </h3>
            <MenuDropdown
              itemobj={activeEcho}
              myalign="end"
              array={arrFunc}
              selected={<BsThreeDots className={styles.funcButt} />}
            />
          </div>

          {isTodayMatchingLevelDate(activeEcho) == "tocomplite" ? (
            <button
              onClick={openCkecker}
              className={`${styles.doneToday} donetag`}
            >
              {activeEcho.lvl < 5
                ? `Complete ${nextLvlv.toString() || "first"} repetition`
                : ` Finish this echo`}
            </button>
          ) : isTodayMatchingLevelDate(activeEcho) == "next" ? (
            <p className={styles.gray}>
              Next repetition:{" "}
              <strong>
                {formatDateNow(
                  activeEcho.next || activeEcho.dates[activeEcho.lvl]
                )}
              </strong>
            </p>
          ) : isTodayMatchingLevelDate(activeEcho) == "late" ? (
            <p className={styles.gray}>
              You lose your streak. Repeat from start!
            </p>
          ) : (
            <></>
          )}
          {activeEcho.completed ? (
            <div className={styles.blue}>This echo was completed!</div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default EchoReader;
