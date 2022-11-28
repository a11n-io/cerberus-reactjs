import React, { createContext, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import useLocalStorageState from 'use-local-storage-state'

const CerberusContext = createContext(null)

function CerberusProvider(props) {
  const { apiHost = null, socketHost = null, suffix = '' } = props
  const [apiToken, setApiToken] = useLocalStorageState(
    `a11n-cerberus-api-token`,
    {
      defaultValue: null
    }
  )

  let socketUrl = null

  useEffect(() => {
    if (socketHost && apiToken) {
      socketUrl = socketHost + '/api/token/' + apiToken
    }
  }, [apiToken])

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    connect: socketUrl !== null && apiToken !== null,
    shouldReconnect: (closeEvent) => true
  })

  const value = {
    suffix: suffix,
    apiHost: apiHost,
    apiToken: apiToken,
    setApiToken: setApiToken,
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
