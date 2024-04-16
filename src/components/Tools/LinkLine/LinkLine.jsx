import styles from "./LinkLine.module.css";

import MenuDropdown from "../MenuDropdown/MenuDropdown";
import { BsThreeDots } from "react-icons/bs";
import { useMyToaster } from "@/storage";
import { copyToClipboard } from "@/utils/textUtils";

const LinkLine = ({ item, id, delFunc }) => {
  let truncatedContent = item;
  if (item.length > 30) {
    truncatedContent = item.substring(0, 30) + "...";
  }

  const { successToast } = useMyToaster();

  const copyLink = () => {
    const context = item;
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

  const arrFunc = [
    { name: "Copy", func: copyLink },
    { name: "Remove", func: delFunc },
  ];

  return (
    <div key={id} className={styles.onelink}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={item}
        className={styles.itemlink}
      >
        {truncatedContent}
      </a>
      <MenuDropdown
        itemobj={id}
        myalign="end"
        array={arrFunc}
        selected={<BsThreeDots className={styles.removebutt} />}
      />
    </div>
  );
};

export default LinkLine;
