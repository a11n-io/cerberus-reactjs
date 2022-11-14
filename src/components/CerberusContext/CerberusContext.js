import React, { createContext, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'

const CerberusContext = createContext(null)

function CerberusProvider(props) {
  const { cerberusUrl, socketUrl, suffix } = props
  const [cerberusToken, setCerberusToken] = useState()
  const [sendMessage, setSendMessage] = useState(null)
  const [lastMessage, setLastMessage] = useState(null)
  const [readyState, setReadyState] = useState(null)

  useEffect(() => {
    if (socketUrl !== undefined) {
      const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        share: true,
        shouldReconnect: (closeEvent) => true
      })
      setSendMessage(sendMessage)
      setLastMessage(lastMessage)
      setReadyState(readyState)
    }
  }, [socketUrl])

  const value = {
    suffix: suffix,
    cerberusUrl: cerberusUrl,
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
