import styles from './NewEchoPage.module.css'
import { EchoCreator } from '@/components'
import { useMyGuide, useMyLogic } from '../../storage'
import { TourGuide } from '@/components/'

const NewEchoPage = () => {
  const { isTourGuideCache, createEchoGuide, uCreateEchoGuide } = useMyGuide()

  const { platformCheck } = useMyLogic()

  const newSteps = [
    {
      id: 'step-1',
      canClickTarget: false,
      attachTo: { element: '.newinput', on: 'bottom' },
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
          localStorage.setItem('createtour', 'true')
          uCreateEchoGuide(true)
        },
      },
      buttons: [
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          type: 'next',
        },
      ],
      title: '1/5 Name your echo',
      text: `You can write any name you want to display for this particular materials you want to learn \n\n <strong>Example:</strong> Introduction to Logarithms`,
    },
    {
      id: 'step-2',
      canClickTarget: false,
      attachTo: { element: '.newtextarea', on: 'bottom' },

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
      title: '2/5 Content ',
      text: `Add all of the information, that you want to repeat using spaced repetition. \n\n <strong>Example:</strong> Any relative information for this topic. Recipes, formulas, paragraphs, code lines, etc `,
    },
    {
      id: 'step-3',
      canClickTarget: false,
      attachTo: { element: '.newlinks', on: 'top' },
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
      title: '3/5 Link block',
      text: `You can attach few links for  echo, that will help you repeat this information <strong>Example: </strong> <a target='_blank' href='https://en.wikipedia.org/wiki/Henry_Ford'>https://en.wikipedia.org/wiki/Henry_Ford</a>`,
    },
    {
      id: 'step-4',
      canClickTarget: false,
      attachTo: {
        element: '.newdates',
        on: 'top',
      },
      buttons: [
        // {
        //   classes: 'shepherd-button-secondary',
        //   text: 'Exit',
        //   type: 'cancel',
        // },
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
      when: {
        show: () => {},
      },
      title: `4/5 Next step`,
      text: `After creating echo you need to repeat materials from this one at next day first. 
      \n\n
      <strong>Dont forget:</strong> Mark completed repetition. Each of them will extend range of spaced repetition interval`,
    },
    {
      id: 'step-5',
      attachTo: {
        element: platformCheck == 'unknown' ? '.guidecreate' : '.onepix',
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
        show: () => {},
      },
      title: '5/5 Finnaly create echo',
      text: 'After you fill the form - click <strong>Create</strong> to add this echo into your list. \n\n We will remind you to repeat all of your added echoes on picked time',
    },
  ]

  return (
    <div className={styles.echonew}>
      {isTourGuideCache && !createEchoGuide ? (
        <TourGuide steps={newSteps} />
      ) : (
        <></>
      )}
      <EchoCreator />
    </div>
  )
}

export default NewEchoPage
