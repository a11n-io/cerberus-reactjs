import { useState } from 'react'

const useFetch = (baseUrl, tokenPair = null, suffix = '') => {
  const [loading, setLoading] = useState(false)

  let hdrs = {
    'Content-Type': 'application/json'
  }
  if (tokenPair) {
    hdrs = { ...hdrs, CerberusAccessToken: tokenPair.accessToken }
  }

  function get(url, headers) {
    hdrs = { ...hdrs, ...headers }

    // remove query parameters if we have a suffix (for testing)
    if (suffix !== '' && url.indexOf('?') >= 0) {
      url = url.substring(0, url.indexOf('?'))
    }

    return new Promise((resolve, reject) => {
      setLoading(true)

      // eslint-disable-next-line no-undef
      fetch(baseUrl + url + suffix, {
        credentials: 'omit',
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

    // remove query parameters if we have a suffix (for testing)
    if (suffix !== '' && url.indexOf('?') >= 0) {
      url = url.substring(0, url.indexOf('?'))
    }

    return new Promise((resolve, reject) => {
      setLoading(true)
      // eslint-disable-next-line no-undef
      fetch(baseUrl + url + suffix, {
        credentials: 'omit',
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

    // remove query parameters if we have a suffix (for testing)
    if (suffix !== '' && url.indexOf('?') >= 0) {
      url = url.substring(0, url.indexOf('?'))
    }

    return new Promise((resolve, reject) => {
      setLoading(true)
      // eslint-disable-next-line no-undef
      fetch(baseUrl + url + suffix, {
        credentials: 'omit',
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

    // remove query parameters if we have a suffix (for testing)
    if (suffix !== '' && url.indexOf('?') >= 0) {
      url = url.substring(0, url.indexOf('?'))
    }

    return new Promise((resolve, reject) => {
      setLoading(true)
      // eslint-disable-next-line no-undef
      fetch(baseUrl + url + suffix, {
        credentials: 'omit',
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
