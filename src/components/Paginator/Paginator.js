import React from 'react'
import { Pagination } from 'react-bootstrap'

export default function Paginator(props) {
  const { curPage, setCurPage, pageSize, pageWindowSize, total } = props

  const numPages = Math.ceil(total / pageSize)
  const halfWindowSize = Math.ceil(pageWindowSize / 2)

  const preArr = []
  const postArr = []

  for (let i = curPage - halfWindowSize; i < curPage; i++) {
    if (i >= 0) {
      preArr.push(i)
    }
  }
  for (let i = curPage + 1; i < curPage + halfWindowSize; i++) {
    if (i < numPages) {
      postArr.push(i)
    }
  }

  while (true) {
    if (preArr.length < halfWindowSize) {
      if (preArr[0] > 0) {
        preArr.unshift(preArr[0] - 1)
      } else {
        break
      }
    } else {
      break
    }
  }
  while (true) {
    if (preArr.length + postArr.length < halfWindowSize * 2) {
      if (postArr[postArr.length - 1] < numPages - 1) {
        postArr.push(postArr[postArr.length - 1] + 1)
      } else {
        break
      }
    } else {
      break
    }
  }

  return (
    <Pagination>
      <Pagination.First
        disabled={curPage === 0}
        onClick={() => setCurPage(0)}
      />
      <Pagination.Prev
        disabled={curPage === 0}
        onClick={() => setCurPage(curPage - 1)}
      />
      {curPage - halfWindowSize > 0 && (
        <Pagination.Ellipsis
          onClick={() => setCurPage(curPage - halfWindowSize)}
        />
      )}
      {preArr.map((idx) => {
        return (
          <Pagination.Item key={idx} onClick={() => setCurPage(idx)}>
            {idx + 1}
          </Pagination.Item>
        )
      })}
      <Pagination.Item active>{curPage + 1}</Pagination.Item>
      {postArr.map((idx) => {
        return (
          <Pagination.Item key={idx} onClick={() => setCurPage(idx)}>
            {idx + 1}
          </Pagination.Item>
        )
      })}
      {curPage + halfWindowSize < numPages - 1 && (
        <Pagination.Ellipsis
          onClick={() => setCurPage(curPage + halfWindowSize)}
        />
      )}
      <Pagination.Next
        disabled={curPage === numPages - 1}
        onClick={() => setCurPage(curPage + 1)}
      />
      <Pagination.Last
        disabled={curPage === numPages - 1}
        onClick={() => setCurPage(numPages - 1)}
      />
    </Pagination>
  )
}
