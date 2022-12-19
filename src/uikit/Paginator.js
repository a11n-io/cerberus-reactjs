import { Pagination } from 'react-bootstrap'
import React from 'react'

export default function Paginator(props) {
  const { curPage, setCurPage, pageSize, pageWindowSize, total } = props

  const numPages = Math.ceil(total / pageSize)
  const halfWindowSize = Math.ceil(pageWindowSize / 2)

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
      {curPage - halfWindowSize >= 0 && (
        <Pagination.Ellipsis
          onClick={() => setCurPage(curPage - halfWindowSize)}
        />
      )}
      {[...Array(halfWindowSize - 1)].map((page, index) => {
        return (
          <Pagination.Item key={curPage - halfWindowSize + index} onClick={setCurPage(curPage - halfWindowSize + index)}>
            {curPage - halfWindowSize + index + 1}
          </Pagination.Item>
        )
      })}
      <Pagination.Item>{curPage + 1}</Pagination.Item>
      {[...Array(halfWindowSize - 1)].map((page, index) => {
        return (
          <Pagination.Item key={curPage + index + 1} onClick={setCurPage(curPage + index + 1)}>
            {curPage + index + 2}
          </Pagination.Item>
        )
      })}
      {curPage + halfWindowSize <= numPages && (
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
