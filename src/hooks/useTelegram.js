export const telegramApp = window.Telegram.WebApp

export function useTelegram() {
  const checkrunAndExpand = () => {
    telegramApp.ready()
    telegramApp.expand()
  }

  const onClose = () => {
    telegramApp.close()
  }

  const setMainBtnText = (text) => {
    if (telegramApp?.MainButton) {
      telegramApp.MainButton.setText(text)
    }
  }

  const mountBtn = (callback, name) => {
    if (telegramApp.platform != 'unknown') {
      if (window.mainButtonFunction) {
        telegramApp.MainButton.offClick(window.mainButtonFunction)
      }

      telegramApp.MainButton.onClick(callback)
      window.mainButtonFunction = callback
      telegramApp.MainButton.show()
      telegramApp.MainButton.enable()
    }

    setMainBtnText(`${name}`)
  }

  return {
    onClose,
    mountBtn,
    setMainBtnText,
    checkrunAndExpand,
    user: telegramApp?.initData,
    userUnsafe: telegramApp?.initDataUnsafe,
    queryId: telegramApp.initDataUnsafe?.query_id,
  }
}
