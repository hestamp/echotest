import React, { useEffect, useState } from 'react'
import styles from './Navbar.module.css'
import { RiUser4Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'

import { useMyAchive, useMyLogic } from '@/storage'

import { TbMenu2 } from 'react-icons/tb'
import { AchiveBar } from '@/components/'
import { useMyStats, useMyUser } from '../../storage'

const Navbar = () => {
  const { uIsSidebar } = useMyLogic()
  const { activeAchive, allAchives } = useMyAchive()

  const { activeLevel, setActiveLvl } = useMyStats()

  const activeSidebar = () => {
    uIsSidebar(true)
  }

  const disableSidebar = () => {
    uIsSidebar(false)
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.paddingblock2}>
        <button
          // aria-label="Menu"
          // data-balloon-pos="down-left"
          onClick={activeSidebar}
          className={styles.activebutt}
        >
          <TbMenu2 onClick={activeSidebar} className={styles.menu} />
        </button>

        {activeLevel ? (
          <Link onClick={disableSidebar} className={styles.rest} to={'/stats'}>
            {/* <AchiveBar activeAchive={activeAchive} /> */}
            <AchiveBar activeAchive={activeLevel} />
          </Link>
        ) : (
          <></>
        )}
        <Link
          // aria-label="Settings"
          // data-balloon-pos="down-right"
          onClick={disableSidebar}
          className={styles.activebutt}
          to={'/settings'}
        >
          <RiUser4Line onClick={disableSidebar} />
        </Link>
      </div>
    </div>
  )
}

export default Navbar
