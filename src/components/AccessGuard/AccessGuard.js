import React, { useEffect, useState } from 'react'
import { ReadyState } from 'react-use-websocket'

export default function AccessGuard(props) {
  const { wsContext, resourceId, action, children, otherwise } = props
  const [hasAccess, setHasAccess] = useState(false)
  const [messageId, setMessageId] = useState('')

  useEffect(() => {
    if (wsContext.readyState === ReadyState.OPEN) {
      // eslint-disable-next-line no-undef
      const msgId = crypto.randomUUID()
      setMessageId(msgId)

      wsContext.sendMessage(
        JSON.stringify({
          messageId: msgId,
          hasAccessRequest: {
            resourceId: resourceId,
            actionName: action
          }
        })
      )
    }
  }, [wsContext.sendMessage, wsContext.readyState])

  useEffect(() => {
    if (wsContext.lastMessage && wsContext.lastMessage.data) {
      const msg = JSON.parse(wsContext.lastMessage.data)
      if (msg && msg.messageId === messageId) {
        setHasAccess(msg.granted)
      }
    }
  }, [wsContext.lastMessage])

  return <React.Fragment>{hasAccess ? children : otherwise}</React.Fragment>
}
