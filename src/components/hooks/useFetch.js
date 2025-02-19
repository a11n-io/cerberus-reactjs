import { useState } from 'react'

const useFetch = (baseUrl, tokenPair = null, suffix = '') => {
  const [loading, setLoading] = useState(false)

  let hdrs = {
    'Content-Type': 'application/json'
  }
  if (tokenPair) {
    hdrs = { ...hdrs, Authorization: 'Bearer ' + tokenPair.accessToken }
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
        .then((response) => {
          setLoading(false)
          if (response.ok) {
            return response.json()
          }
          return Promise.reject(response)
        })
        .then((data) => {
          if (data === null) {
            data = []
          }
          resolve(data)
        })
        .catch((response) => {
          console.log(response.status, response.statusText)
          // 3. get error messages, if any
          response.json().then((json) => {
            if (typeof json !== 'string' && json.hasOwn('message')) {
              reject(json.message)
            }
            reject(json)
          })
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
        .then((response) => {
          setLoading(false)
          if (response.ok) {
            return response.json()
          }
          return Promise.reject(response)
        })
        .then((data) => {
          if (data === null) {
            data = []
          }
          resolve(data)
        })
        .catch((response) => {
          console.log(response.status, response.statusText)
          // 3. get error messages, if any
          response.json().then((json) => {
            if (typeof json !== 'string' && json.hasOwn('message')) {
              reject(json.message)
            }
            reject(json)
          })
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
        .then((response) => {
          setLoading(false)
          if (response.ok) {
            return response.json()
          }
          return Promise.reject(response)
        })
        .then((data) => {
          if (data === null) {
            data = []
          }
          resolve(data)
        })
        .catch((response) => {
          console.log(response.status, response.statusText)
          // 3. get error messages, if any
          response.json().then((json) => {
            if (typeof json !== 'string' && json.hasOwn('message')) {
              reject(json.message)
            }
            reject(json)
          })
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
        .then((response) => {
          setLoading(false)
          if (response.ok) {
            return response.json()
          }
          return Promise.reject(response)
        })
        .then((data) => {
          if (data === null) {
            data = []
          }
          resolve(data)
        })
        .catch((response) => {
          console.log(response.status, response.statusText)
          // 3. get error messages, if any
          response.json().then((json) => {
            if (typeof json !== 'string' && json.hasOwn('message')) {
              reject(json.message)
            }
            reject(json)
          })
        })
    })
  }

  return { get, post, put, del, loading }
}

export default useFetch
