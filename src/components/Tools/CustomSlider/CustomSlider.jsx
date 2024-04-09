import React, { useEffect, useRef, useState } from 'react'
import { MdArrowForwardIos, MdArrowBackIos } from 'react-icons/md'
import Glider from 'react-glider'
import 'glider-js/glider.min.css'
import styles from './CustomSlider.module.css'
import ProgressBar from '../ProgressBar/ProgressBar'
const handleChildClick = (e) => {
  e.stopPropagation()
}
const CustomSlider = ({
  array,
  fullsize,
  children,
  showDots,
  onlyNext,
  isArrow,
  progress,
  currentSlide,
  setCurrentSlide,
}) => {
  const gliderRef = useRef()
  const [maxSlide, setMaxSlide] = useState(0)

  const [hideArrows, setHideArrows] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        // Move to the previous slide
        gliderRef.current.scrollItem('prev')
      } else if (e.key === 'ArrowRight') {
        // Move to the next slide
        gliderRef.current.scrollItem('next')
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [gliderRef])

  const leftArrowRef = useRef(null)
  const rightArrowRef = useRef(null)

  useEffect(() => {
    if (maxSlide == currentSlide) {
      setHideArrows(true)
    } else {
      setHideArrows(false)
    }
  }, [maxSlide, currentSlide])

  useEffect(() => {
    if (gliderRef.current) {
      if (array) {
        setMaxSlide(array.length - 1)
      } else {
        setMaxSlide(children.length - 1)
      }
    }
  }, [gliderRef])

  const handleSlideVisible = (obj) => {
    setCurrentSlide(obj.detail.slide)
  }

  return (
    <div className={styles.myvid}>
      <Glider
        ref={gliderRef}
        // draggable
        scrollLock
        hasArrows={isArrow}
        hasDots={showDots}
        slidesToShow={1}
        onSlideVisible={handleSlideVisible}
        slidesToScroll={1}
        arrows={{
          prev: leftArrowRef.current,
          next: rightArrowRef.current,
        }}
      >
        {array &&
          array.length &&
          array.map((item, id) => (
            <div
              onClick={handleChildClick}
              key={id}
              className={`${styles.autodiv} ${fullsize ? styles.fulldiv : ''}`}
            >
              {item}
            </div>
          ))}
        {children &&
          React.Children.map(children, (child) =>
            React.cloneElement(child, { onClick: handleChildClick })
          )}
      </Glider>
      {progress ? (
        <div className={styles.progressdiv}>
          {gliderRef.current ? (
            <ProgressBar round value={currentSlide} maxValue={maxSlide} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}

      {!hideArrows && isArrow ? (
        <div className={styles.arrowdiv}>
          <>
            {!onlyNext ? (
              <button
                onClick={() => gliderRef.current.scrollItem('prev')}
                // id="prev"
                // ref={leftArrowRef}
                className={styles.arrowButt}
              >
                <MdArrowBackIos />
              </button>
            ) : (
              <></>
            )}
          </>

          <button
            onClick={() => gliderRef.current.scrollItem('next')}
            // id="next"
            // ref={rightArrowRef}
            className={styles.arrowButt}
          >
            <MdArrowForwardIos />
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default CustomSlider
