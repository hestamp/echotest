import styles from './MyLoader.module.css'
import MySpinner from '../MySpinner'

const MyLoader = ({ isLoading }) => {
  return (
    <div
      style={{ display: `${isLoading ? '' : 'none'}` }}
      className={styles.mainLoad}
    >
      <MySpinner />
    </div>
  )
}

export default MyLoader
