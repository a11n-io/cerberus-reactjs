import React, { createContext, useState } from 'react'
import useWebSocket from 'react-use-websocket'

const CerberusContext = createContext(null)

function CerberusProvider(props) {
  const [cerberusUrl, setCerberusUrl] = useState()
  const [cerberusToken, setCerberusToken] = useState()

  const { socketUrl } = props
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: (closeEvent) => true
  })

  const value = {
    cerberusUrl: cerberusUrl,
    setCerberusUrl: setCerberusUrl,
    cerberusToken: cerberusToken,
    setCerberusToken: setCerberusToken,
    sendMessage: sendMessage,
    lastMessage: lastMessage,
    readyState: readyState
  }

  return (
    <CerberusContext.Provider value={value}>
      {props.children}
    </CerberusContext.Provider>
  )
}

export { CerberusContext, CerberusProvider }
