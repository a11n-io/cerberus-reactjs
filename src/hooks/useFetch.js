import { useContext, useState } from 'react'
import { CerberusContext } from '../components'

const useFetch = (baseUrl, token) => {
  const [loading, setLoading] = useState(false)
  const cerberusCtx = useContext(CerberusContext)

  let hdrs = {
    'Content-Type': 'application/json'
  }
  if (token) {
    hdrs = { ...hdrs, Authorization: 'Bearer ' + token }
  }

  function get(url, headers) {
    hdrs = { ...hdrs, ...headers }

    return new Promise((resolve, reject) => {
      setLoading(true)

      console.log('GET ' + baseUrl + url, hdrs)

      // eslint-disable-next-line no-undef
      fetch(baseUrl + url + cerberusCtx.suffix, {
        credentials: 'include',
        method: 'get',
        headers: hdrs
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false)
          if (!data || !data.data) {
            return reject(data)
          }
          resolve(data.data)
        })
        .catch((error) => {
          setLoading(false)
          reject(error)
        })
    })
  }

  function post(url, body, headers) {
    hdrs = { ...hdrs, ...headers }

    return new Promise((resolve, reject) => {
      setLoading(true)
      // eslint-disable-next-line no-undef
      fetch(baseUrl + url + cerberusCtx.suffix, {
        credentials: 'include',
        method: 'post',
        headers: hdrs,
        body: JSON.stringify(body)
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false)
          if (!data || !data.data) {
            return reject(data)
          }
          resolve(data.data)
        })
        .catch((error) => {
          setLoading(false)
          reject(error)
        })
    })
  }

  function put(url, body, headers) {
    hdrs = { ...hdrs, ...headers }

    return new Promise((resolve, reject) => {
      setLoading(true)
      // eslint-disable-next-line no-undef
      fetch(baseUrl + url + cerberusCtx.suffix, {
        credentials: 'include',
        method: 'put',
        headers: hdrs,
        body: JSON.stringify(body)
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false)
          if (!data || !data.data) {
            return reject(data)
          }
          resolve(data.data)
        })
        .catch((error) => {
          setLoading(false)
          reject(error)
        })
    })
  }

  function del(url, headers) {
    hdrs = { ...hdrs, ...headers }

    return new Promise((resolve, reject) => {
      setLoading(true)
      // eslint-disable-next-line no-undef
      fetch(baseUrl + url + cerberusCtx.suffix, {
        credentials: 'include',
        method: 'delete',
        headers: hdrs
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false)
          if (!data || !data.data) {
            return reject(data)
          }
          resolve(data.data)
        })
        .catch((error) => {
          setLoading(false)
          reject(error)
        })
    })
  }

  return { get, post, put, del, loading }
}

export default useFetch
