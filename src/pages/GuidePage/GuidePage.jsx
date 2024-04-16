import { useEffect, useState } from 'react'
import styles from './GuidePage.module.css'
import { useNavigate } from 'react-router-dom'
import { CustomSlider, SurveyComponent } from '@/components/'
import { useMyLogic, useMyUser } from '@/storage'
import { telegramApp } from '@/hooks/useTelegram'

const GuidePage = () => {
  const navigate = useNavigate()
  const { myUserData, getUserData } = useMyUser()
  const { WEBAPP_URL } = useMyLogic()
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleGuideCompletion = async () => {
    localStorage.setItem('guide', 'true')
    navigate('/main')
    await sendGoal()
  }

  useEffect(() => {
    const newGuide = localStorage.getItem('guide')
    if (newGuide == 'true') {
      navigate('/main')
    }
  }, [])

  const arr = [
    'Master a new skill or subject',
    'Enhance academic performance',
    'Boost professional knowledge',
    'Personal growth and lifelong learning',
    'Other',
  ]

  const [selectedOption, setSelectedOption] = useState('')

  const sendGoal = async () => {
    try {
      const response = await fetch(`${WEBAPP_URL}/api/auth/goal/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authId: myUserData.authId,
          goal: selectedOption,
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok.')
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response not JSON')
      }

      await response.json()
    } catch (error) {
      // console.error()
    }
  }

  useEffect(() => {
    telegramApp.BackButton.hide()
  }, [])

  return (
    <>
      {getUserData == false || getUserData == null ? (
        <div></div>
      ) : (
        <div className={styles.mainguide}>
          <CustomSlider
            setCurrentSlide={setCurrentSlide}
            fullsize
            onlyNext
            progress
            isArrow
            showDots={false}
            currentSlide={currentSlide}
          >
            <div className={styles.slide}>
              <h2>Welcome to MindEcho</h2>
              <img className={styles.logoimg} src="/logo.webp" />
              <p>
                Unlock the power of your mind with spaced repetition. Just like
                an echo, each piece of information in your learning journey will
                resound and be reinforced.
              </p>
            </div>
            <div className={styles.slide}>
              <h2>How it works?</h2>
              <img className={styles.logoimg} src="/guide/guide.graph.webp" />
              <p>
                Learning technique where information is reviewed at increasing
                intervals to reinforce memory retention and enhance long-term
                learning
              </p>
            </div>
            <div className={styles.slide}>
              <SurveyComponent
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                question="What's your main goal with learning?"
                options={arr}
              />
            </div>
            <div className={styles.slide}>
              <h2>Keep it in mind</h2>
              <img className={styles.logoimg} src="/guide/guide.days.webp" />
              <p>
                Interval timing in spaced repetition optimizes memory retention.
                Longer intervals ensure material is revisited just before it&apos;s
                forgotten, strengthening recall and promoting durable learning.
              </p>
            </div>
            <div className={styles.slide}>
              <h2>Plan and track each echo</h2>
              <img
                className={styles.logoimg}
                src="/guide/guide.calendar.webp"
              />
              <p>
                Create a new echo and segment it for intervals of repetition.
                Your echoes will fill a calendar, sparing you the effort of
                remembering when to revisit each one
              </p>
            </div>
            <div className={styles.slide}>
              <h2>Get notifications</h2>
              <img className={styles.logoimg} src="/guide/guide.notif.webp" />
              <p>
                Choose a convenient time for you, and we&apos;ll send reminders to
                review all your echoes scheduled for that day.
              </p>
            </div>
            <div className={styles.slide}>
              <h2>Explore new way to learning!</h2>

              <button
                className={styles.bigButt}
                onClick={handleGuideCompletion}
              >
                Get ready!
              </button>
            </div>
          </CustomSlider>
          {/* <button onClick={handleNextSlide}>Next</button> */}
        </div>
      )}
    </>
  )
}

export default GuidePage
