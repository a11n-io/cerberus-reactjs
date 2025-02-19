import React, { useContext, useEffect, useState } from 'react'
import { ReadyState } from 'react-use-websocket'
import { CerberusContext } from '../CerberusContext'

export default function AccessGuard(props) {
  const { resourceId, action, children, otherwise } = props
  const [hasAccess, setHasAccess] = useState(false)
  const [messageId, setMessageId] = useState('')
  const cerberusCtx = useContext(CerberusContext)

  useEffect(() => {
    console.log('socket state:', cerberusCtx.readyState)
    if (cerberusCtx.readyState === ReadyState.OPEN) {
      // eslint-disable-next-line no-undef
      const msgId = crypto.randomUUID()
      setMessageId(msgId)
      const req = {
        messageId: msgId,
        hasAccessRequest: {
          resourceId: resourceId,
          actionName: action
        }
      }
      console.log('hasAccess req', req)
      cerberusCtx.sendMessage(req)
    }
  }, [cerberusCtx.readyState])

  useEffect(() => {
    console.log('permission for resource', resourceId, 'action', action, 'message id', messageId, cerberusCtx.lastMessage)
    if (cerberusCtx.lastMessage !== null) {
      const msg = cerberusCtx.lastMessage
      if (msg && msg.messageId === messageId) {
        setHasAccess(msg.granted)
      }
    }
  }, [cerberusCtx.lastMessage])

  return <React.Fragment>{hasAccess ? children : otherwise}</React.Fragment>
}
