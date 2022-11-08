import React, { createContext } from 'react'
import useWebSocket from 'react-use-websocket'

const WsContext = createContext(null)

function WsProvider(props) {
  const { socketUrl } = props
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: (closeEvent) => true
  })

  const value = {
    sendMessage: sendMessage,
    lastMessage: lastMessage,
    readyState: readyState
  }

  return <WsContext.Provider value={value}>{props.children}</WsContext.Provider>
}

export { WsContext, WsProvider }
