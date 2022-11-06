import React, { useEffect, useState } from 'react'
import useFetch from '../../hooks'

export default function AccessGuard(props) {
  const { cerberusUrl, cerberusToken, accountId, userId, resourceId, action } =
    props
  const { get } = useFetch(cerberusUrl, cerberusToken)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    get(
      `accounts/${accountId}/access/permitteeid/${userId}/resourceid/${resourceId}/actionname/${action}`
    )
      .then((r) => {
        if (r) {
          setHasAccess(r)
        }
      })
      .catch((e) => console.log(e))
  }, [])
  return <>{hasAccess && props.children}</>
}
