import { useEffect, useRef } from 'react'
import LinkLine from '../LinkLine/LinkLine'
import MyInput from '../MyInput/MyInput'
import { MdOutlineClose } from 'react-icons/md'
import styles from './AddLinksBlock.module.css'
const AddLinksBlock = ({
  linkArr,
  isAddLink,
  setIsAddLink,
  setEditLink,
  editLink,
  editMode,
  closeEdit,
  addcurrentLink,
  removeFunction,
  editFunction,
  saveEditedLink,
}) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current && isAddLink) {
      inputRef.current.focus()
    }
  }, [isAddLink])

  return (
    <>
      <div className={styles.linkarr}>
        {linkArr.length ? (
          linkArr.map((item, id) => (
            <LinkLine
              item={item}
              id={id}
              key={id}
              delFunc={removeFunction}
              editFunc={editFunction}
            />
          ))
        ) : (
          <></>
        )}
        {!isAddLink && (
          <button className={styles.addlink} onClick={() => setIsAddLink(true)}>
            Add link
          </button>
        )}
      </div>
      {isAddLink && (
        <div className={styles.addlinkblock}>
          <div className={styles.linkblock}>
            <MyInput
              value={editLink}
              placeholder="Link related to this echo"
              onChange={(e) => setEditLink(e.target.value)}
              type="text"
              myref={inputRef}
            />
            <button className={styles.removebutt} onClick={closeEdit}>
              <MdOutlineClose />
            </button>
          </div>
          {editMode == 'add' ? (
            <button className={styles.addlink} onClick={addcurrentLink}>
              Add
            </button>
          ) : (
            <button className={styles.addlink} onClick={saveEditedLink}>
              Save
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default AddLinksBlock
