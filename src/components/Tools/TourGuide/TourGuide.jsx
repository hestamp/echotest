import React, { useContext, useEffect, useState } from 'react'
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd'
import 'shepherd.js/dist/css/shepherd.css'

const TourGuide = ({ steps, onExit, isActiveTour = false }) => {
  const [isMounted, setIsMounted] = useState(false)

  const stepsEnabled = isActiveTour

  const newSteps = steps || []

  const tourOptions = {
    defaultStepOptions: {
      cancelIcon: {
        enabled: true,
      },
      scrollTo: { behavior: 'smooth', block: 'center' },
    },
    useModalOverlay: true,
  }

  function TourInstance() {
    const tour = useContext(ShepherdTourContext)

    useEffect(() => {
      if (tour && !isMounted) {
        tour.start()
        setIsMounted(true)
      }
    }, [tour, isMounted])

    return <></>
  }

  return (
    <>
      <ShepherdTour steps={newSteps} tourOptions={tourOptions}>
        <TourInstance />
      </ShepherdTour>
    </>
  )
}

export { TourGuide }
