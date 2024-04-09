import React, { useEffect } from 'react'
import styles from './InfoPage.module.css'
import { MyIcoNameArrow } from '@/components/'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '@/hooks/useTelegram'
const InfoPage = () => {
  const settingArray = [
    {
      name: 'How to use',
      link: '/info/howto',
    },
    {
      name: 'Echo System',
      link: '/info/system',
    },
    {
      name: 'Notifications',
      link: '/info/notif',
    },
  ]

  const navigate = useNavigate()
  const { mountBtn } = useTelegram()
  const createFunc = () => {
    navigate('/echo/create')
  }
  useEffect(() => {
    mountBtn(createFunc, 'Create echo')
  }, [])

  return (
    <div className={styles.infoPage}>
      <div className={styles.paddingblock}>
        <h3>Information</h3>
        <div>
          {settingArray &&
            settingArray.map((links, ind) => (
              <MyIcoNameArrow links={links} key={ind} index={ind} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default InfoPage
