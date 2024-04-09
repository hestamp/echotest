import React from 'react'
import styles from './SurveyComponent.module.css'

const SurveyComponent = ({
  question,
  options,
  selectedOption,
  setSelectedOption,
}) => {
  const handleOptionChange = (e) => {
    e.stopPropagation()
    setSelectedOption(e.target.value)
  }

  return (
    <div className={styles.surveyContainer}>
      <h2 className={styles.surveyQuestion}>{question}</h2>

      <div className={styles.surveyArray}>
        {options.map((option, index) => (
          <label key={index} className={styles.surveyOption}>
            <input
              type="radio"
              value={option}
              checked={selectedOption == option}
              onChange={handleOptionChange}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  )
}

export default SurveyComponent
