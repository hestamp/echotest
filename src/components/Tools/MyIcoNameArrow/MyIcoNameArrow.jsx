import React from 'react'
import styles from './MyIcoNameArrow.module.css'
import { Link } from 'react-router-dom'
import { MdKeyboardArrowRight } from 'react-icons/md'

const MyIcoNameArrow = ({ links, index, rel, target }) => {
  return (
    <Link
      key={index}
      className={styles.linkBlock}
      to={links.link}
      rel={rel}
      target={target}
    >
      <div className={styles.myBlock}>
        <h3 className={styles.pText}>{links.name}</h3>
        <MdKeyboardArrowRight className={styles.arrowIcon} />
      </div>
    </Link>
  )
}

export default MyIcoNameArrow
