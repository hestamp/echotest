import React from 'react'
import styles from './MyToggle.module.css'

import * as Switch from '@radix-ui/react-switch'

const MyToggle = ({ toggleId, toggleName, toggleChange, toggleStatus }) => {
  return (
    <form>
      <div className={styles.fullBlock}>
        <label className={styles.Label} htmlFor={toggleId}>
          {toggleName}
        </label>
        <Switch.Root
          onCheckedChange={toggleChange}
          checked={toggleStatus}
          className={styles.SwitchRoot}
          id={toggleId}
        >
          <Switch.Thumb className={styles.SwitchThumb} />
        </Switch.Root>
      </div>
    </form>
  )
}

export default MyToggle
