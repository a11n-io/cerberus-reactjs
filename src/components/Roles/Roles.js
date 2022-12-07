import React, { useContext, useEffect, useState } from 'react'
import useFetch from '../../hooks'
import {
  ListGroup,
  Badge,
  Container,
  Col,
  Row,
  Form,
  Button,
  Card,
  Tabs,
  Tab
} from 'react-bootstrap'
import { Loader } from '../../uikit'
import { CerberusContext } from '../CerberusContext'

export default function Roles(props) {
  const cerberusCtx = useContext(CerberusContext)
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)
  const { get, loading } = useFetch(
    cerberusCtx.apiHost + '/api/',
    cerberusCtx.apiTokenPair.accessToken,
    cerberusCtx.suffix
  )
  const { RoleSelectedComponent, NoRoleSelectedComponent, onError } = props

  useEffect(() => {
    get('roles')
      .then((r) => setRoles(r))
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.log(e)
      })
  }, [])

  function handleRoleClicked(e) {
    const roleId = e.target.getAttribute('data-val1')

    if (selectedRole !== null && selectedRole !== undefined) {
      if (selectedRole.id === roleId) {
        setSelectedRole(null)
        return
      }
    }

    setSelectedRole(roles.find((r) => r.id === roleId))
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
              {roles.map((role) => {
                return (
                  <ListGroup.Item
                    key={role.id}
                    action
                    active={selectedRole && selectedRole.id === role.id}
                    onClick={handleRoleClicked}
                    data-val1={role.id}
                    className='d-flex justify-content-between align-items-start'
                  >
                    <div className='ms-2 me-auto'>
                      <div className='fw-bold' data-val1={role.id}>
                        {role.displayName}
                      </div>
                    </div>
                    <Badge bg='primary' pill>
                      {role.userCount}
                    </Badge>
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          </Col>
          <Col>
            {selectedRole ? (
              <RoleSelected
                RoleSelectedComponent={RoleSelectedComponent}
                role={selectedRole}
                setSelectedRole={setSelectedRole}
                setRoles={setRoles}
                onError={onError}
              />
            ) : (
              <React.Fragment>
                {NoRoleSelectedComponent !== undefined ? (
                  <NoRoleSelectedComponent />
                ) : (
                  <NoRoleSelected setRoles={setRoles} onError={onError} />
                )}
              </React.Fragment>
            )}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

function RoleSelected(props) {
  const { role, setRoles, setSelectedRole, onError } = props

  return (
    <Card>
      <Card.Header>
        <h2>Role: {role.displayName}</h2>
      </Card.Header>
      <Card.Body>
        <Tabs defaultActiveKey='users' className='mb-3'>
          <Tab eventKey='users' title='Users'>
            <Users role={role} setRoles={setRoles} onError={onError} />
          </Tab>
          <Tab eventKey='details' title='Details'>
            <Details
              role={role}
              setSelectedRole={setSelectedRole}
              setRoles={setRoles}
              onError={onError}
            />
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  )
}

function Details(props) {
  const cerberusCtx = useContext(CerberusContext)
  const { put, del, loading } = useFetch(
    cerberusCtx.apiHost + '/api/',
    cerberusCtx.apiTokenPair.accessToken,
    cerberusCtx.suffix
  )
  const [name, setName] = useState('')
  const { role, setRoles, setSelectedRole, onError } = props

  useEffect(() => {
    setName(role.displayName)
  }, [role])

  function handleFormSubmit(e) {
    e.preventDefault()
    put(`roles/${role.id}`, {
      name: name
    })
      .then((r) => {
        if (r) {
          setRoles((prev) =>
            [...prev.filter((r) => r.id !== role.id), r].sort(
              (a, b) => a.displayName > b.displayName
            )
          )
        }
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }

  function handleNameChanged(e) {
    setName(e.target.value)
  }

  function handleRemoveClicked() {
    del(`roles/${role.id}`)
      .then((d) => {
        if (d) {
          setSelectedRole(null)
          setRoles((prev) => {
            return prev.filter((r) => r.id !== role.id)
          })
        }
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <Form.Group className='mb-3'>
        <Form.Label>Role name</Form.Label>
        <Form.Control
          type='text'
          value={name}
          placeholder='Enter role name'
          onChange={handleNameChanged}
        />
      </Form.Group>
      <Button variant='primary' type='submit'>
        Update
      </Button>
      <Button variant='danger' className='ms-1' onClick={handleRemoveClicked}>
        Remove
      </Button>
    </Form>
  )
}

function Users(props) {
  const cerberusCtx = useContext(CerberusContext)
  const { get, post, del, loading } = useFetch(
    cerberusCtx.apiHost + '/api/',
    cerberusCtx.apiTokenPair.accessToken,
    cerberusCtx.suffix
  )
  const [users, setUsers] = useState([])
  const { role, setRoles, onError } = props

  useEffect(() => {
    get(`roles/${role.id}/users`)
      .then((r) => setUsers(r))
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }, [role])

  function handleUserRoleToggled(e) {
    const selected = users.find((u) => u.id === e.target.value)
    if (!selected) {
      return
    }

    if (selected.inRole === false) {
      post(`roles/${role.id}/users/${selected.id}`)
        .then((d) => {
          setRoles((prev) => [
            ...prev.map((r) => {
              if (r.id === role.id) {
                return { ...r, userCount: r.userCount + 1 }
              }
              return r
            })
          ])
          setUsers((prev) =>
            prev.map((u) => {
              if (u.id === selected.id) {
                return { ...u, inRole: true }
              }
              return u
            })
          )
        })
        .catch((e) => {
          if (onError) {
            onError(e)
          }
          console.error(e)
        })
    } else {
      del(`roles/${role.id}/users/${selected.id}`)
        .then((d) => {
          setRoles((prev) =>
            prev.map((r) => {
              if (r.id === role.id) {
                return { ...r, userCount: r.userCount - 1 }
              }
              return r
            })
          )

          setUsers((prev) =>
            prev.map((u) => {
              if (u.id === selected.id) {
                return { ...u, inRole: false }
              }
              return u
            })
          )
        })
        .catch((e) => {
          if (onError) {
            onError(e)
          }
          console.error(e)
        })
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <ListGroup>
      {users.map((user) => {
        return (
          <ListGroup.Item
            key={user.id}
            className='d-flex justify-content-between align-items-start'
          >
            <div className='ms-2 me-auto'>
              <Form.Switch
                id={`role-switch-${user.id}`}
                label={user.displayName}
                checked={user.inRole}
                value={user.id}
                onChange={handleUserRoleToggled}
              />
            </div>
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )
}

function NoRoleSelected(props) {
  const cerberusCtx = useContext(CerberusContext)
  const { post, loading } = useFetch(
    cerberusCtx.apiHost + '/api/',
    cerberusCtx.apiTokenPair.accessToken,
    cerberusCtx.suffix
  )
  const [name, setName] = useState()
  const { setRoles, onError } = props

  function handleNameChanged(e) {
    setName(e.target.value)
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    post('roles', {
      name: name
    })
      .then((r) => {
        if (r) {
          setRoles((prev) =>
            [...prev, r].sort((a, b) => a.displayName > b.displayName)
          )
        }
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <React.Fragment>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label>Role name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter role name'
            onChange={handleNameChanged}
          />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Create
        </Button>
      </Form>
    </React.Fragment>
  )
}
