import React, { useContext, useEffect, useState } from 'react'
import { CerberusContext } from '../CerberusContext'
import useFetch from '../../hooks'
import { Loader } from '../../uikit'
import { Card, Col, Container, Form, ListGroup, Row } from 'react-bootstrap'

export default function RequiredRoles() {
  const cerberusCtx = useContext(CerberusContext)
  const [resourceTypes, setResourceTypes] = useState([])
  const [selectedRT, setSelectedRT] = useState(null)
  const { get, loading } = useFetch(
    cerberusCtx.apiHost + '/api/',
    cerberusCtx.apiAccessToken
  )

  useEffect(() => {
    get('resourcetypes')
      .then((r) => setResourceTypes(r))
      .catch((e) => console.error(e))
  }, [])

  function handleRTClicked(e) {
    const rtId = e.target.getAttribute('data-val1')

    if (selectedRT !== null && selectedRT !== undefined) {
      if (selectedRT.id === rtId) {
        setSelectedRT(null)
        return
      }
    }

    setSelectedRT(resourceTypes.find((r) => r.id === rtId))
  }

  if (loading) {
    return <Loader />
  }

  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col>
            <ListGroup>
              {resourceTypes.map((rt) => {
                return (
                  <ListGroup.Item
                    key={rt.id}
                    action
                    active={selectedRT && selectedRT.id === rt.id}
                    onClick={handleRTClicked}
                    data-val1={rt.id}
                    className='d-flex justify-content-between align-items-start'
                  >
                    <div className='ms-2 me-auto'>
                      <div className='fw-bold' data-val1={rt.id}>
                        {rt.name}
                      </div>
                    </div>
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          </Col>
          <Col>{selectedRT && <RTSelected rt={selectedRT} />}</Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

function RTSelected(props) {
  const { rt } = props

  return (
    <Card>
      <Card.Header>
        <h2>Required roles for {rt.name}</h2>
      </Card.Header>
      <Card.Body>
        <Roles rt={rt} />
      </Card.Body>
    </Card>
  )
}

function Roles(props) {
  const cerberusCtx = useContext(CerberusContext)
  const { get, post, del, loading } = useFetch(
    cerberusCtx.apiHost + '/api/',
    cerberusCtx.apiAccessToken
  )
  const [roles, setRoles] = useState([])
  const { rt } = props

  useEffect(() => {
    get(`resourcetypes/${rt.id}/roles`)
      .then((r) => setRoles(r))
      .catch((e) => console.error(e))
  }, [rt])

  function handleRoleToggled(e) {
    const selected = roles.find((r) => r.id === e.target.value)
    if (!selected) {
      return
    }

    if (selected.isRequired === false) {
      post(`resourcetypes/${rt.id}/roles/${selected.id}`)
        .then((d) => {
          setRoles((prev) =>
            prev.map((r) => {
              if (r.id === selected.id) {
                return { ...r, isRequired: true }
              }
              return r
            })
          )
        })
        .catch((e) => console.error(e))
    } else {
      del(`resourcetypes/${rt.id}/roles/${selected.id}`)
        .then((d) => {
          setRoles((prev) =>
            prev.map((r) => {
              if (r.id === selected.id) {
                return { ...r, isRequired: false }
              }
              return r
            })
          )
        })
        .catch((e) => console.error(e))
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <ListGroup>
      {roles.map((role) => {
        return (
          <ListGroup.Item
            key={role.id}
            className='d-flex justify-content-between align-items-start'
          >
            <div className='ms-2 me-auto'>
              <Form.Switch
                label={role.displayName}
                checked={role.isRequired}
                value={role.id}
                onChange={handleRoleToggled}
              />
            </div>
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )
}
