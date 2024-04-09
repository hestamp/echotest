import React from 'react'
import styles from './MenuDropdown.module.css'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

const MenuDropdown = ({ selected, array, itemobj, myalign, ...rest }) => {
  return (
    <DropdownMenu.Root className={styles.mainDrop} {...rest}>
      <DropdownMenu.Trigger
        // style={{
        //   marginLeft: '5px',
        //   marginRight: '5px',
        // }}
        asChild
      >
        <div className={styles.mainDrop} aria-label="Picker">
          <div className={styles.pickedDate}>{selected}</div>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={myalign}
          className={styles.DropdownMenuContent}
        >
          {array.map((item) => {
            const personFunc = (e) => {
              e.stopPropagation()
              item.func(itemobj)
            }
            return (
              <DropdownMenu.Item
                key={item.name}
                onClick={personFunc}
                className={styles.DropdownMenuItem}
              >
                {item.name}
              </DropdownMenu.Item>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default MenuDropdown
