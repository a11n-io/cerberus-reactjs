import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

export default function Confirmation(props) {
  const [answer, setAnswer] = useState('')
  const { show, onConfirm, onDeny, header, body, test } = props

  return (
    <Modal show={show} onHide={onDeny}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
        {test && (
          <Form.Control
            onChange={(e) => setAnswer(e.target.value)}
            className='m-2'
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' size='lg' onClick={onDeny}>
          No
        </Button>
        <Button
          disabled={test && answer !== test}
          variant='danger'
          size='sm'
          onClick={onConfirm}
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
