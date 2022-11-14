import { useContext, useState } from 'react'
import { CerberusContext } from '../components/CerberusContext/CerberusContext'

const useFetch = (baseUrl, token) => {
  const [loading, setLoading] = useState(false)
  const cerberusCtx = useContext(CerberusContext)

  const defaultHeaders = {
    'Content-Type': 'application/json'
  }
  let hdrs = defaultHeaders
  if (token) {
    hdrs = { ...hdrs, Authorization: 'Bearer ' + token }
  }

  function get(url, headers) {
    hdrs = { ...hdrs, ...headers }

    return new Promise((resolve, reject) => {
      setLoading(true)

      console.log('GET ' + baseUrl + url, hdrs)

      fetch(baseUrl + url + cerberusCtx.suffix, {
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
      fetch(baseUrl + url + cerberusCtx.suffix, {
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
      fetch(baseUrl + url + cerberusCtx.suffix, {
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
      fetch(baseUrl + url + cerberusCtx.suffix, {
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
