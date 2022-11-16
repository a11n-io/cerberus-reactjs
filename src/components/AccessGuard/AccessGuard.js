import React, { useContext, useEffect, useState } from 'react'
import { ReadyState } from 'react-use-websocket'
import { CerberusContext } from '../CerberusContext'

export default function AccessGuard(props) {
  const { resourceId, action, children, otherwise } = props
  const [hasAccess, setHasAccess] = useState(false)
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
        setHasAccess(msg.granted)
      }
    }
  }, [cerberusCtx.lastMessage])

  return <React.Fragment>{hasAccess ? children : otherwise}</React.Fragment>
}
