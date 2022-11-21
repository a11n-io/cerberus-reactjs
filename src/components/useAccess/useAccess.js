import { useContext, useEffect, useState } from 'react'
import { CerberusContext } from '../CerberusContext'
import { ReadyState } from 'react-use-websocket'

const useAccess = (resourceId, action, setGranted) => {
  const [messageId, setMessageId] = useState('')
  const cerberusCtx = useContext(CerberusContext)

  useEffect(() => {
    if (cerberusCtx.readyState === ReadyState.OPEN) {
      // eslint-disable-next-line no-undef
      const msgId = crypto.randomUUID()
      setMessageId(msgId)

      cerberusCtx.sendMessage(
        JSON.stringify({
          messageId: msgId,
          hasAccessRequest: {
            resourceId: resourceId,
            actionName: action
          }
        })
      )
    }
  }, [cerberusCtx.sendMessage, cerberusCtx.readyState])

  useEffect(() => {
    if (cerberusCtx.lastMessage && cerberusCtx.lastMessage.data) {
      const msg = JSON.parse(cerberusCtx.lastMessage.data)
      if (msg && msg.messageId === messageId) {
        setGranted(msg.granted)
      }
    }
  }, [cerberusCtx.lastMessage])
}

export default useAccess
