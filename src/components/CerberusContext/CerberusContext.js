import React, { createContext } from 'react'
import useWebSocket from 'react-use-websocket'
import useLocalStorageState from 'use-local-storage-state'

const CerberusContext = createContext(null)

function CerberusProvider(props) {
  const { cerberusUrl, socketUrl, suffix = '' } = props
  const [cerberusToken, setCerberusToken] = useLocalStorageState(
    `a11n-cerberus-api-token`,
    {
      defaultValue: null
    }
  )

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: (closeEvent) => true
  })

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
