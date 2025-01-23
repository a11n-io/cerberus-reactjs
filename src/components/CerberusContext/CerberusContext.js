import React, { createContext, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import useSessionStorageState from 'use-session-storage-state'
import useFetch from '../../hooks'

const CerberusContext = createContext(null)

function CerberusProvider(props) {
  const { apiHost = '', socketHost = '', suffix = '' } = props
  const { post } = useFetch(apiHost + '/', null, suffix)
  const [socketUrl, setSocketUrl] = useState(null)
  const [apiTokenPair, setApiTokenPair] = useSessionStorageState(
    `a11n-cerberus-api-tokenpair`,
    {
      defaultValue: null
    }
  )

  useEffect(() => {
    if (socketHost !== '' && apiTokenPair && apiTokenPair.accessToken) {
      setSocketUrl(socketHost + '/token/' + apiTokenPair.accessToken)
    }
    const interval = setInterval(() => refreshToken(), 5000 * 60)
    return () => clearInterval(interval)
  }, [apiTokenPair])

  const refreshToken = () => {
    if (apiTokenPair && apiTokenPair.accessToken) {
      post('auth/refreshtoken', {
        refreshToken: apiTokenPair.refreshToken
      })
        .then((r) => {
          setApiTokenPair(r)
        })
        .catch((e) => console.error('refresh token', e.message))
    }
  }

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    connect: socketUrl !== null,
    shouldReconnect: (closeEvent) => true
  })

  const value = {
    suffix: suffix,
    apiHost: apiHost,
    apiTokenPair: apiTokenPair,
    setApiTokenPair: setApiTokenPair,
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
