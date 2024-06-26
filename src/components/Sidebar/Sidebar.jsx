import React, { useState } from 'react'
import Sidebar from 'react-sidebar'
import styles from './Sidebar.module.css'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { TbSettings2 } from 'react-icons/tb'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { AiOutlineTrophy } from 'react-icons/ai'
import { VscGraph } from 'react-icons/vsc'
import { LuWaves } from 'react-icons/lu'
import { CgInfo } from 'react-icons/cg'
const MySidebar = ({ sidebarOpen, setSidebarOpen, children }) => {
  const [shouldUpdateSidebar, setShouldUpdateSidebar] = useState(true)

  const menuLinks = [
    {
      name: 'My Echos',
      link: '/main',
      icon: <LuWaves />,
    },

    {
      name: 'Achivements',
      link: '/achivements',
      icon: <AiOutlineTrophy />,
    },
    {
      name: 'Statistics',
      link: '/stats',
      icon: <VscGraph />,
    },
    {
      name: 'Settings',
      link: '/settings',
      icon: <TbSettings2 />,
    },
    {
      name: 'Info',
      link: '/info',
      icon: <CgInfo />,
    },
  ]

  const navigate = useNavigate()

  const onSetSidebarOpen = () => {
    setSidebarOpen(false)
  }

  const mainPageClick = () => {
    navigate('/main')
  }

  const shouldUpdateMainContent = () => {
    return shouldUpdateSidebar
  }

  const location = useLocation()

  const isActive = (to) => {
    if (to === location.pathname) return true

    if (location.pathname.startsWith(to) && to !== '/') return true
    return false
  }

  return (
    <Sidebar
      sidebar={
        <div className={styles.mycontent}>
          <div className={styles.mindecho}>
            <Link
              onClick={onSetSidebarOpen}
              className={styles.mainlink}
              to={'/main'}
            >
              <h1>MindEcho</h1>
            </Link>
            <MdKeyboardArrowLeft
              className={styles.arrowclose}
              onClick={onSetSidebarOpen}
            />
          </div>
          <nav className={`${styles.pagesBlock}`}>
            {menuLinks.map((link) => {
              return (
                <NavLink
                  key={link.name}
                  to={link.link}
                  onClick={onSetSidebarOpen}
                  className={`${
                    isActive(link.link) ? styles.activeLink : styles.normalLink
                  }`}
                >
                  <div className={styles.textIcoBLock}>
                    {React.cloneElement(link.icon, {
                      className: styles.menuIcon,
                    })}
                    <span>{link.name}</span>
                  </div>
                  {link.new && <span className={styles.newDiv}>New</span>}
                </NavLink>
              )
            })}
          </nav>
          <div>
            <h4 className={styles.createdby}>
              Created by
              <a
                className={styles.tom}
                href="https://hestamp.com"
                target="_blank"
              >
                Tom Hestamp
              </a>
            </h4>
          </div>
        </div>
      }
      open={sidebarOpen}
      rootClassName={styles.sidebarRoot}
      sidebarClassName={styles.sidebar}
      contentClassName={styles.content}
      overlayClassName={styles.overlay}
      onSetOpen={(open) => {
        setShouldUpdateSidebar(true)
        onSetSidebarOpen(open)
      }}
      styles={{ sidebar: { background: 'white' } }}
    >
      {children}
    </Sidebar>
  )
}

export default MySidebar
