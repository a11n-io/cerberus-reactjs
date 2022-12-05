import React, { createContext, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import useSessionStorageState from 'use-session-storage-state'

const CerberusContext = createContext(null)

function CerberusProvider(props) {
  const { apiHost = null, socketHost = null, suffix = '' } = props
  const [socketUrl, setSocketUrl] = useState(null)
  const [apiAccessToken, setApiAccessToken] = useSessionStorageState(
    `a11n-cerberus-api-accesstoken`,
    {
      defaultValue: null
    }
  )
  const [apiRefreshToken, setApiRefreshToken] = useSessionStorageState(
    `a11n-cerberus-api-refreshtoken`,
    {
      defaultValue: null
    }
  )

  useEffect(() => {
    if (socketHost && apiAccessToken) {
      setSocketUrl(socketHost + '/api/token/' + apiAccessToken)
    }
  }, [apiAccessToken])

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    connect: socketUrl !== null,
    shouldReconnect: (closeEvent) => true
  })

  const value = {
    suffix: suffix,
    apiHost: apiHost,
    apiAccessToken: apiAccessToken,
    setApiAccessToken: setApiAccessToken,
    apiRefreshToken: apiRefreshToken,
    setApiRefreshToken: setApiRefreshToken,
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
