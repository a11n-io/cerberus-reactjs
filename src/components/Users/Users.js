import React, { useContext, useEffect, useRef, useState } from 'react'
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
import Paginator from '../../uikit/Paginator'

export default function Users(props) {
  const cerberusCtx = useContext(CerberusContext)
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [curPage, setCurPage] = useState(0)
  const [filter, setFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const inputRef = useRef(null)
  const { get, loading } = useFetch(
    cerberusCtx.apiHost + '/api/',
    cerberusCtx.apiTokenPair,
    cerberusCtx.suffix
  )

  const { UserSelectedComponent, NoUserSelectedComponent, onError } = props

  useEffect(() => {
    get(`users?sort=displayName&order=asc&skip=${curPage * 10}&limit=10&filter=${filter}`)
      .then((r) => {
        if (r && r.page) {
          setUsers(r.page)
          setTotal(r.total)
        } else {
          setUsers([])
          setTotal(0)
        }
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }, [curPage, filter])

  useEffect(() => {
    inputRef.current.focus()
  }, [users])

  function handleUserClicked(e) {
    const userId = e.target.getAttribute('data-val1')

    if (selectedUser !== null && selectedUser !== undefined) {
      if (selectedUser.id === userId) {
        setSelectedUser(null)
        return
      }
    }

    setSelectedUser(users.find((u) => u.id === userId))
  }

  function handleFilterChange(e) {
    setFilter(e.target.value)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col>
            <Form.Control
              ref={inputRef}
              onChange={handleFilterChange}
              placeholder='filter'
              value={filter}
              className='m-1'
            />
            <ListGroup className='m-1'>
              {users.map((user) => {
                return (
                  <ListGroup.Item
                    key={user.id}
                    action
                    active={selectedUser && selectedUser.id === user.id}
                    onClick={handleUserClicked}
                    data-val1={user.id}
                    className='d-flex justify-content-between align-items-start'
                  >
                    <div className='ms-2 me-auto'>
                      <div className='fw-bold' data-val1={user.id}>
                        {user.displayName}
                      </div>
                    </div>
                    <Badge bg='primary' pill>
                      {user.roleCount}
                    </Badge>
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
            <Paginator
              curPage={curPage}
              setCurPage={setCurPage}
              pageSize={10}
              pageWindowSize={5}
              total={total}
            />
          </Col>
          <Col>
            {selectedUser ? (
              <UserSelected
                UserSelectedComponent={UserSelectedComponent}
                user={selectedUser}
                setSelectedUser={setSelectedUser}
                setUsers={setUsers}
                onError={onError}
              />
            ) : (
              <React.Fragment>
                {NoUserSelectedComponent !== undefined && (
                  <NoUserSelectedComponent onError={onError} />
                )}
              </React.Fragment>
            )}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

function UserSelected(props) {
  const { user, setUsers, setSelectedUser, UserSelectedComponent, onError } = props

  return (
    <Card>
      <Card.Header>
        <h2>User: {user.displayName}</h2>
      </Card.Header>
      <Card.Body>
        <Tabs defaultActiveKey='roles' className='mb-3'>
          <Tab eventKey='roles' title='Roles'>
            <Roles user={user} setUsers={setUsers} onError={onError} />
          </Tab>
          <Tab eventKey='details' title='Details'>
            {UserSelectedComponent !== undefined ? (
              <UserSelectedComponent userId={user.id} />
            ) : (
              <Details
                user={user}
                setSelectedUser={setSelectedUser}
                setUsers={setUsers}
                onError={onError}
              />
            )}
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
    cerberusCtx.apiTokenPair,
    cerberusCtx.suffix
  )
  const [userName, setUserName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const { user, setUsers, setSelectedUser, onError } = props

  useEffect(() => {
    setUserName(user.userName)
    setDisplayName(user.displayName)
  }, [user])

  function handleFormSubmit(e) {
    e.preventDefault()
    put(`users/${user.id}`, {
      name: userName
    })
      .then((r) => {
        if (r) {
          setUsers((prev) =>
            [...prev.filter((r) => r.id !== user.id), r].sort(
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

  function handleUserNameChanged(e) {
    setUserName(e.target.value)
  }

  function handleDisplayNameChanged(e) {
    setDisplayName(e.target.value)
  }

  function handleRemoveClicked() {
    del(`users/${user.id}`)
      .then((d) => {
        if (d) {
          setSelectedUser(null)
          setUsers((prev) => {
            return prev.filter((u) => u.id !== user.id)
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
        <Form.Label>Username</Form.Label>
        <Form.Control
          type='text'
          value={userName}
          placeholder='Enter username'
          onChange={handleUserNameChanged}
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Display name</Form.Label>
        <Form.Control
          type='text'
          value={displayName}
          placeholder='Enter display name'
          onChange={handleDisplayNameChanged}
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

function Roles(props) {
  const cerberusCtx = useContext(CerberusContext)
  const { get, post, del, loading } = useFetch(
    cerberusCtx.apiHost + '/api/',
    cerberusCtx.apiTokenPair,
    cerberusCtx.suffix
  )
  const [roles, setRoles] = useState([])
  const { user, setUsers, onError } = props

  useEffect(() => {
    get(`users/${user.id}/roles`)
      .then((r) => setRoles(r))
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }, [user])

  function handleRoleUserToggled(e) {
    const selected = roles.find((u) => u.id === e.target.value)
    if (!selected) {
      return
    }

    if (selected.hasUser === false) {
      post(`roles/${selected.id}/users/${user.id}`)
        .then((d) => {
          setUsers((prev) => [
            ...prev.map((r) => {
              if (r.id === user.id) {
                return { ...r, roleCount: r.roleCount + 1 }
              }
              return r
            })
          ])
          setRoles((prev) =>
            prev.map((r) => {
              if (r.id === selected.id) {
                return { ...r, hasUser: true }
              }
              return r
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
      del(`roles/${selected.id}/users/${user.id}`)
        .then((d) => {
          setUsers((prev) => [
            ...prev.map((r) => {
              if (r.id === user.id) {
                return { ...r, roleCount: r.roleCount - 1, hasUser: false }
              }
              return r
            })
          ])
          setRoles((prev) =>
            prev.map((r) => {
              if (r.id === selected.id) {
                return { ...r, hasUser: false }
              }
              return r
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
      {roles.map((role) => {
        return (
          <ListGroup.Item
            key={role.id}
            className='d-flex justify-content-between align-items-start'
          >
            <div className='ms-2 me-auto'>
              <Form.Switch
                id={`user-switch-${role.id}`}
                label={role.displayName}
                checked={role.hasUser}
                value={role.id}
                onChange={handleRoleUserToggled}
              />
            </div>
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )
}
