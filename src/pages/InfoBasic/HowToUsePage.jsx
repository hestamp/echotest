import React, { useEffect } from 'react'
import styles from './HowToUsePage.module.css'
import { PageStructure } from '@/components/'
import { useNavigate } from 'react-router-dom'
import { useTelegram } from '@/hooks/useTelegram'

const HowToUsePage = () => {
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
      <PageStructure name={'How to use'}>
        <div className={styles.textblock}>
          <img className={styles.logoimg} src="/guide/guide.days.webp" />
          <p className={styles.gray}>
            Welcome to MindEcho, your personal spaced repetition web app
            designed to help you learn and remember important information
            efficiently. Here's a simple guide on how to use it:{' '}
          </p>
          <p>
            <strong>Creating Echoes:</strong> To get started, create your first
            echo by clicking on the "Create Echo" button. Fill in the name,
            content (description of what you want to learn or remember), and
            optionally add any relevant links. Click "Create" to create your
            echo.
          </p>
          <p>
            <strong>Viewing Echoes:</strong> On the main page, you'll see a
            calendar visualization with wave icons indicating days where you
            have tasks to repeat. Under the calendar, you'll find a filter
            section where you can view echoes based on selected day, active
            echoes, or completed echoes.
          </p>
          <p>
            <strong>Repeating Echoes:</strong> Click on a day in the calendar to
            view echoes scheduled for repetition on that day. Simply click on
            the echo to mark it as completed for the day. The app will
            automatically adjust the repetition intervals based on your
            progress.
          </p>
          <p>
            <strong>Completing Echoes:</strong>
            When you complete a repetition, the echo's level will increase, and
            new repetition dates will be scheduled. Your goal is to complete all
            repetition intervals for each echo.
          </p>
          <p>
            <strong>Notifications:</strong>
            MindEcho sends you notifications to remind you to repeat echoes. You
            can set your preferred notification time during your first use of
            the app. If there are echoes to repeat for the day, you'll receive a
            notification with a list of echoes. Otherwise, you'll receive a
            reminder to learn something new and create a new echo.
          </p>
        </div>
      </PageStructure>
    </>
  )
}

export default HowToUsePage
