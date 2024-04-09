import React from 'react'
import styles from './MyDropdown.module.css'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

const ItemDropdown = ({ trigger, content, myalign }) => {
  return (
    <DropdownMenu.Root className={styles.mainDrop}>
      <DropdownMenu.Trigger asChild>
        <div className={styles.mainDrop} aria-label="Picker">
          <div className={styles.pickedDate}>{trigger}</div>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={myalign}
          className={styles.DropdownMenuContent}
        >
          <DropdownMenu.Item>{content}</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default ItemDropdown
