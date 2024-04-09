import React, { useEffect } from 'react'
import styles from './EchoSystemPage.module.css'
import { PageStructure } from '@/components/'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '@/hooks/useTelegram'

const EchoSystemPage = () => {
  const navigate = useNavigate()
  const { mountBtn } = useTelegram()
  const createFunc = () => {
    navigate('/echo/create')
  }
  useEffect(() => {
    mountBtn(createFunc, 'Create echo')
  }, [])

  return (
    <>
      <PageStructure name={'Echo System'}>
        <div className={styles.textblock}>
          <img className={styles.logoimg} src="/guide/guide.graph.webp" />
          <p className={styles.gray}>
            Our app uses a spaced repetition system to help you remember
            information effectively. Here's how it works:
          </p>

          <p>
            <strong>Echo Creation: </strong> Each echo consists of a name,
            content, and optional links. When you create an echo, default
            repetition intervals of 1, 3, 10, 30, and 60 days are set, starting
            from the creation date.
          </p>
          <p>
            <strong>Repetition Intervals: </strong> Echoes are repeated at
            scheduled intervals to reinforce memory. As you complete
            repetitions, the echo's level increases, and new repetition dates
            are calculated based on the current level.
          </p>
          <p>
            <strong>Completing Echoes:</strong> When you complete a repetition
            for an echo, its level increases, and new repetition dates are
            scheduled. The goal is to complete all repetition intervals for each
            echo to reinforce memory effectively.
          </p>
        </div>
      </PageStructure>
    </>
  )
}

export default EchoSystemPage
