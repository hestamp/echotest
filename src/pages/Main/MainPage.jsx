import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './MainPage.module.css'

import { useNavigate } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'
import { MyCalendar, MenuDropdown, QuoteDay, SlugDiv } from '@/components/'
import { GoDotFill } from 'react-icons/go'
import { MdEventRepeat, MdDone, MdOutlineLink } from 'react-icons/md'
import { FaRegCalendarCheck } from 'react-icons/fa6'
import { useMyLogic, useMyMainContext, useMyUser } from '@/storage'

import { renderContentWithLineBreaks } from '@/utils/textUtils'

import { telegramApp, useTelegram } from '@/hooks/useTelegram'

import { isTodayMatchingLevelDate } from '@/utils/objUtils'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { TourGuide } from '@/components/Tools/TourGuide/TourGuide'
import { useMyGuide } from '../../storage'
import ToggleManu from './ToggleManu'

dayjs.extend(utc)
dayjs.extend(timezone)

const MainPage = () => {
  const navigate = useNavigate()

  const { getUserData } = useMyUser()

  const {
    taskArr,
    uTaskArr,
    uActiveEcho,
    todayMode,
    setTodayMode,
    pickedDateEchos,
    setPickedDateEchos,
    selectedDate,
    setSelectedDate,
  } = useMyMainContext()

  const { uCrudMode, echoModal, uEchoModal, platformCheck } = useMyLogic()
  const { isTourGuideCache, mainPageGuide, uMainPageGuide } = useMyGuide()

  const [activeTask, setActiveTask] = useState(null)
  const { mountBtn } = useTelegram()

  const formatDate = (date) => {
    const userLocalTz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return dayjs(date).tz(userLocalTz).format('YYYY-MM-DD')
  }

  // const stringDate = formatDate(Date.now())
  const stringDate = useCallback(() => {
    console.log('triggered stringDate')
    return formatDate(Date.now())
  }, [])

  const [activeTaskDates, setActiveTaskDates] = useState([])
  const [activeTaskDay, setActiveTaskDay] = useState(null)

  const isDateInTaskDates = () => {
    return (taskDate, clickedDate) => {
      const formattedTaskDate = formatDate(taskDate)
      const formattedClickedDate = formatDate(clickedDate)
      return formattedTaskDate === formattedClickedDate
    }
  }

  const goActiveTask = (index) => {
    const selectedTask = filteredTasks[index]

    if (index == activeTask) {
      readfunc(selectedTask)
    } else {
      setActiveTask(index)
      setActiveTaskDates(selectedTask.dates)
    }
  }
  const goActiveTaskDay = (index) => {
    const selectedTaskDay = sortedArray[index]
    if (index == activeTaskDay) {
      readfunc(selectedTaskDay)
    } else {
      setActiveTaskDay(index)

      setActiveTaskDates(selectedTaskDay.dates)
    }
  }

  const toggleMode = (param) => {
    if (param) {
      setTodayMode(param)
      setActiveTaskDay(null)
      setActiveTask(null)
    }
  }

  const sortedArray = useMemo(() => {
    const today = new Date()
    const userLocalTz = Intl.DateTimeFormat().resolvedOptions().timeZone
    console.log('sortedTz', userLocalTz)

    const calculateLocalState = (task) => {
      return isTodayMatchingLevelDate(task, today, userLocalTz)
    }

    const mappedArray = pickedDateEchos.map((task) => {
      // Calculate local state for the current task
      const localState = calculateLocalState(task)

      // Return the task object along with its local state
      return {
        ...task,
        localState: localState,
      }
    })

    // Sort the mapped array based on the local state
    return mappedArray.sort((a, b) => {
      const isAToComplete = a.localState === 'tocomplite'
      const isBToComplete = b.localState === 'tocomplite'

      if (isAToComplete === isBToComplete) return 0
      else if (isAToComplete) return -1
      else return 1
    })
  }, [pickedDateEchos])

  const mappedTasks = useMemo(() => {
    console.log('mappedTask rerendder')
    const userLocalTz = Intl.DateTimeFormat().resolvedOptions().timeZone
    console.log(userLocalTz)
    const today = new Date()

    // Function to calculate local state for a task
    const calculateLocalState = (task) => {
      return isTodayMatchingLevelDate(task, today, userLocalTz)
    }

    // Map through taskArr and calculate local state for each task
    return taskArr.map((task) => {
      // Calculate local state for the current task
      const localState = calculateLocalState(task)

      // Return the task object along with its local state
      return {
        ...task,
        localState: localState,
      }
    })
  }, [taskArr])

  const filteredTasks = useMemo(() => {
    // Filter tasks based on todayMode and local state
    console.log('filterTask rerender')
    if (todayMode === 'all') {
      console.log('filter task all')
      mappedTasks.reverse()
      mappedTasks.sort((a, b) => {
        const isAToComplete = a.localState === 'tocomplite'
        const isBToComplete = b.localState === 'tocomplite'
        if (isAToComplete === isBToComplete) return 0
        else if (isAToComplete) return -1
        else return 1
      })
      let mappedTasks2 = mappedTasks.filter((task) => !task.completed)
      return mappedTasks2
    } else if (todayMode === 'completed') {
      console.log('completed')
      let tasks2 = mappedTasks.filter((task) => task.completed)
      return tasks2
    }

    // Return original tasks array if todayMode is not 'all' or 'completed'
    // return mappedTasks
  }, [todayMode, mappedTasks])

  const createFunc = () => {
    navigate('/echo/create')
    uEchoModal(false)
  }

  const readfunc = (obj) => {
    uActiveEcho(obj)
    uCrudMode('read')
    uEchoModal(true)
  }
  const updateFunc = (obj) => {
    uActiveEcho(obj)
    uEchoModal(false)
    navigate('/echo/edit')
  }

  const delfunc = (obj) => {
    uCrudMode('remove')
    uEchoModal(true)
    uActiveEcho(obj)
  }

  const arrFunc = [
    { name: 'Open', func: readfunc },
    { name: 'Edit', func: updateFunc },
    { name: 'Remove', func: delfunc },
  ]

  const activeDateFunc = (activedate) => {
    console.log('33333333333333')
    setActiveTask(null)
    toggleMode('day')
    setActiveTaskDates([])
    const filteredTasks = taskArr.filter((task) =>
      task.dates.some((date) => isDateInTaskDates(date, activedate))
    )

    setPickedDateEchos(filteredTasks)
  }

  useEffect(() => {
    const isTourGuideMain = localStorage.getItem('maintour')
    if (isTourGuideMain) {
      telegramApp.MainButton.show()
    }
    mountBtn(createFunc, 'Create echo')
    telegramApp.BackButton.hide()

    if (selectedDate == null) {
      setSelectedDate(stringDate)
    }
  }, [])

  useEffect(() => {
    if (taskArr && taskArr.length && selectedDate) {
      activeDateFunc(selectedDate)
    }
  }, [taskArr, selectedDate])

  const pushFakeEcho = () => {
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - 1)
    const intervals = [0, 1, 3, 10, 30, 60]

    const dates = intervals.map((interval) => {
      const date = new Date(currentDate)
      date.setDate(currentDate.getDate() + interval)
      return date.toISOString()
    })

    const newEchoName = 'First echo. What is spaced repetition?'
    const newEchoContext = `
    The method of spaced repetition was first conceived of in the 1880s by German scientist Hermann Ebbinghaus. Ebbinghaus created the forgetting curve - a graph portraying the loss of learned information over time - and postulated that it can be curbed by reviewing such information at several intervals over a period of time.`

    const iddate = new Date().toISOString()

    const newTask = {
      name: newEchoName,
      lvl: 1,
      dates: dates,
      links: [],
      content: newEchoContext,
      active: true,
      next: dates[1],
      completed: false,
      id: iddate,
    }

    const newArrEcho = []
    newArrEcho.push(newTask)
    uTaskArr(newArrEcho)

    activeDateFunc(selectedDate)
    setActiveTaskDay(0)

    setActiveTaskDates(dates)
  }

  const newSteps = [
    {
      id: 'step-1',
      canClickTarget: false,

      beforeShowPromise: function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            window.scrollTo(0, 0)
            resolve()
          }, 500)
        })
      },
      when: {
        show: () => {
          localStorage.setItem('maintour', 'true')
          uMainPageGuide(true)
          pushFakeEcho()
        },
      },
      buttons: [
        {
          classes: 'shepherd-button-primary',
          text: 'Start',
          type: 'next',
        },
      ],
      title: '1/4 Quick tour',
      text: 'Let me guide you with main functionality',
    },
    {
      id: 'step-2',
      canClickTarget: false,
      attachTo: { element: '.tasklist', on: 'top' },

      buttons: [
        {
          classes: 'shepherd-button-secondary',
          text: 'Back',
          type: 'back',
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          type: 'next',
        },
      ],
      title: '2/4 Echo list',
      text: 'Here will be all of your created echoes. \n \nYou can track if there is something to repeat for today or visit rest of them.',
    },
    {
      id: 'step-3',
      canClickTarget: false,
      attachTo: { element: '.mycalendar', on: 'top' },
      buttons: [
        {
          classes: 'shepherd-button-secondary',
          text: 'Back',
          type: 'back',
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          type: 'next',
        },
      ],
      title: '3/4 Learning plan',
      text: 'All of your created echoes have repetitions intervals and will be displayed on a calendar plan',
    },
    {
      id: 'step-4',
      canClickTarget: false,
      attachTo: {
        element: platformCheck == 'unknown' ? '.createchobutt' : '.onepix',
        on: 'top',
      },
      buttons: [
        {
          classes: 'shepherd-button-secondary',
          text: 'Back',
          type: 'back',
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Finish',
          type: 'next',
        },
      ],
      when: {
        show: () => {
          telegramApp.MainButton.show()
        },
      },
      title: '4/4 First step',
      text: 'Simply click Create echo and  add some information you want to learn with spaced repetition.',
    },
  ]

  console.log('main comp RERENDER!')

  return (
    <div className={styles.mainPage}>
      {isTourGuideCache && !mainPageGuide ? (
        <TourGuide steps={newSteps} />
      ) : (
        <></>
      )}

      <div
        id="foo"
        className={`mycalendar ${styles.miniblock} ${styles.margintop}`}
      >
        <MyCalendar
          // maxPlus={maxDate}
          valueDate={selectedDate}
          setDate={setSelectedDate}
          format="dd-MM-yyyy"
          sunOrMon="iso8601"
          activeTask={activeDateFunc}
          startDate={null}
          highlightDates={
            activeTask != null || activeTaskDay != null ? activeTaskDates : null
          }
        />
      </div>
      <div className={`tasklist ${styles.miniblock} ${styles.justask}`}>
        <div className={styles.paddingblock}>
          <ToggleManu
            formatDate={formatDate}
            selectedDate={selectedDate}
            todayMode={todayMode}
            toggleMode={toggleMode}
            stringDate={stringDate}
          />

          {getUserData == false || getUserData == null ? (
            <div className={styles.taskblock}>
              <SlugDiv />
              <SlugDiv />
              <SlugDiv />
            </div>
          ) : (
            <>
              {todayMode == 'day' ? (
                <>
                  {selectedDate ? (
                    <>
                      <div className={styles.taskblock}>
                        {sortedArray.length > 0 ? (
                          sortedArray.map((item, index) => {
                            const maxChar = 300
                            let truncatedContent = item.content

                            const isContentTooLong =
                              item.content.length > maxChar

                            if (item.content.length > maxChar) {
                              truncatedContent =
                                item.content.substring(0, maxChar) + '...'
                            }

                            const localState = item.localState

                            return (
                              <div
                                onClick={() => goActiveTaskDay(index)}
                                className={`${styles.fullitem} ${
                                  activeTaskDay == index
                                    ? styles.activetask
                                    : styles.notactive
                                } `}
                                key={index}
                              >
                                <div className={styles.taskItem}>
                                  {' '}
                                  <div className={styles.repeat}>
                                    <h4 className={`${styles.waves} `}>
                                      {localState == 'tocomplite' ? (
                                        <MdEventRepeat />
                                      ) : (
                                        <FaRegCalendarCheck
                                          className={styles.icomode}
                                        />
                                      )}
                                    </h4>
                                    <h4>{item.name}</h4>
                                  </div>
                                  {item.completed ? (
                                    <button
                                      className={` ${styles.funcButtActive}`}
                                    >
                                      <MdDone />
                                    </button>
                                  ) : (
                                    <MenuDropdown
                                      itemobj={item}
                                      myalign="end"
                                      array={arrFunc}
                                      selected={
                                        <BsThreeDots
                                          className={styles.funcButt}
                                        />
                                      }
                                    />
                                  )}
                                </div>
                                {activeTaskDay == index && (
                                  <div className={styles.text}>
                                    {renderContentWithLineBreaks(
                                      truncatedContent
                                    )}
                                  </div>
                                )}
                                {activeTaskDay == index && (
                                  <div className={styles.openlinks}>
                                    {item.links && item.links != 0 ? (
                                      <div className={styles.linkblock}>
                                        <MdOutlineLink
                                          className={styles.linksvg}
                                        />
                                        <p>
                                          {item.links.length}{' '}
                                          {item.links.length == 1
                                            ? 'link'
                                            : 'links'}{' '}
                                        </p>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                    {activeTaskDay == index &&
                                    isContentTooLong ? (
                                      <button
                                        className={styles.readmore}
                                        onClick={() => readfunc(item)}
                                      >
                                        Read more
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })
                        ) : (
                          <p>
                            You don’t have echos for{' '}
                            {formatDate(selectedDate) == stringDate
                              ? 'today'
                              : 'this day'}
                            .
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <div className={styles.taskblock}>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((item, index) => {
                      const maxChar = 300
                      let truncatedContent = item.content

                      const isContentTooLong = item.content.length > maxChar

                      if (item.content.length > maxChar) {
                        truncatedContent =
                          item.content.substring(0, maxChar) + '...'
                      }

                      const localState = item.localState

                      return (
                        <div
                          onClick={() => goActiveTask(index)}
                          className={`${styles.fullitem} ${
                            activeTask == index
                              ? styles.activetask
                              : styles.notactive
                          } `}
                          key={index}
                        >
                          <div className={styles.taskItem}>
                            {' '}
                            <div className={styles.repeat}>
                              <h4 className={`${styles.waves} `}>
                                {localState == 'tocomplite' ? (
                                  <MdEventRepeat />
                                ) : (
                                  <GoDotFill className={styles.icomode} />
                                )}
                              </h4>
                              <h4>{item.name}</h4>
                            </div>
                            {item.completed ? (
                              <button className={` ${styles.funcButtActive}`}>
                                <MdDone />
                              </button>
                            ) : (
                              <MenuDropdown
                                itemobj={item}
                                myalign="end"
                                array={arrFunc}
                                selected={
                                  <BsThreeDots className={styles.funcButt} />
                                }
                              />
                            )}
                          </div>
                          {activeTask == index && (
                            <div className={styles.text}>
                              {renderContentWithLineBreaks(truncatedContent)}
                            </div>
                          )}
                          {activeTask == index && (
                            <div className={styles.openlinks}>
                              {item.links && item.links != 0 ? (
                                <div className={styles.linkblock}>
                                  <MdOutlineLink className={styles.linksvg} />
                                  <p>{item.links.length} links</p>
                                </div>
                              ) : (
                                <></>
                              )}
                              {activeTask == index && isContentTooLong && (
                                <button
                                  className={styles.readmore}
                                  onClick={() => readfunc(item)}
                                >
                                  Read more
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <p className={styles.somep}>
                      {todayMode == 'all' &&
                        'You don’t have echos now. \n Click "Create echo" to start.'}
                      {todayMode == 'today' &&
                        'You don’t have echos for today. \n\n Learn something new and then Create echo'}
                      {todayMode == 'completed' &&
                        'You don’t have completed echos yet.'}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <QuoteDay />

      {!echoModal && platformCheck == 'unknown' ? (
        <div className={styles.createDiv}>
          <button
            onClick={createFunc}
            className={`createchobutt ${styles.addbutt}`}
          >
            <span> Create echo</span>
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default MainPage
