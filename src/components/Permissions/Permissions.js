import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './Permissions.module.css'
import useFetch from '../hooks/useFetch'
import Loader from '../../uikit/Loader'
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Table,
  Toast,
  Popover,
  Overlay
} from 'react-bootstrap'
import { CerberusContext } from '../CerberusContext'
import useAccess from '../hooks/useAccess'
import Paginator from '../Paginator'
import Confirmation from '../Confirmation'

export default function Permissions(props) {
  const { resourceId, changeAction, onError } = props
  const cerberusCtx = useContext(CerberusContext)
  const { get, post, del, loading } = useFetch(
    cerberusCtx.apiHost + '/',
    cerberusCtx.apiTokenPair,
    cerberusCtx.suffix
  )
  const [permissions, setPermissions] = useState([])
  const [newPermittee, setNewPermittee] = useState()
  const [newPermitteeName, setNewPermitteeName] = useState()
  const [newPolicies, setNewPolicies] = useState([])
  const [activeInherit, setActiveInherit] = useState(false)
  const [hasParent, setHasParent] = useState(false)
  const [canChangePermissions, setCanChangePermissions] = useState(true)
  const [deletingPermission, setDeletingPermission] = useState('')

  useAccess(resourceId, changeAction, setCanChangePermissions)

  useEffect(() => {
    getPermissions()
  }, [resourceId])

  function getPermissions() {
    get(`resources/${resourceId}/permissions`)
      .then((r) => {
        if (r) {
          setPermissions(r)
          if (r.length > 0) {
            setActiveInherit(r[0].activeInherit)
            setHasParent(r[0].hasParent)
          }
        }
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }

  function handleInheritToggled(e) {
    post(`resources/${resourceId}/inheritance`, {
      activeInherit: !activeInherit
    })
      .then(() => {
        getPermissions()
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }

  function handlePolicyRemoveClicked(e) {
    const permissionId = e.target.getAttribute('data-val1')
    const policyId = e.target.getAttribute('data-val2')

    if (!permissionId || !policyId) {
      return
    }

    del(`permissions/${permissionId}/policies/${policyId}`)
      .then((r) => {
        setPermissions((prev) => [
          ...prev.filter((p) => p.id !== permissionId),
          r
        ])
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }

  function handlePolicySelected(e) {
    const policyId = e.target.getAttribute('data-val1')
    const policyName = e.target.getAttribute('data-val2')
    const policyDesc = e.target.getAttribute('data-val3')

    const permissionId = e.target.getAttribute('data-val4')
    if (!permissionId || !policyId) {
      return
    }

    const policy = {
      id: policyId,
      name: policyName,
      description: policyDesc
    }

    post(`permissions/${permissionId}/policies/${policyId}`)
      .then((r) => {
        const permission = permissions.find((p) => p.id === permissionId)

        if (permission && policy) {
          permission.policies = [...permission.policies, policy]
          setPermissions((prev) => [
            ...prev.filter((p) => p.id !== permissionId),
            permission
          ])
        }
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }

  function handlePermissionRemoveClicked(e) {
    const permissionId = e.target.getAttribute('data-val1')
    if (!permissionId) {
      return
    }

    setDeletingPermission(permissionId)
  }

  function handleDenyDelete() {
    setDeletingPermission('')
  }

  function handleConfirmDelete() {
    del(`permissions/${deletingPermission}`)
      .then((r) => {
        setPermissions((prev) =>
          prev.filter((perm) => perm.id !== deletingPermission)
        )
        setDeletingPermission('')
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }

  function handlePermissionAddClicked(e) {
    if (!newPermittee || newPolicies.length === 0) {
      return
    }

    post(`permissions`, {
      permitteeId: newPermittee,
      resourceId: resourceId,
      policyIds: newPolicies.map((p) => p.id)
    })
      .then((r) =>
        setPermissions((prev) =>
          [...prev.filter((p) => p.id !== r.id), r].sort(
            (a, b) => a.displayName > b.displayName
          )
        )
      )
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
      .finally(() => {
        setNewPermittee(null)
        setNewPolicies([])
      })
  }

  function handleNewPermitteeSelected(e) {
    const permitteeId = e.target.getAttribute('data-val1')
    const permitteeName = e.target.getAttribute('data-val2')
    setNewPermittee(permitteeId)
    setNewPermitteeName(permitteeName)
  }

  function handleNewPolicySelected(e) {
    const policyId = e.target.getAttribute('data-val1')
    const policyName = e.target.getAttribute('data-val2')
    const policyDesc = e.target.getAttribute('data-val3')

    const policy = {
      id: policyId,
      name: policyName,
      description: policyDesc
    }

    if (!newPolicies.find((p) => p.id === policyId)) {
      setNewPolicies((prev) => [...prev, policy])
    }
  }

  function handleNewPolicyRemoveClicked(e) {
    const policyId = e.target.getAttribute('data-val2')
    if (!policyId) {
      return
    }

    setNewPolicies((prev) => prev.filter((p) => p.id !== policyId))
  }

  if (loading) {
    return <Loader />
  }

  return (
    <React.Fragment>
      <Confirmation
        onConfirm={handleConfirmDelete}
        onDeny={handleDenyDelete}
        show={deletingPermission !== ''}
        header='Delete Permission'
        body='This cannot be undone. Delete?'
      />
      <Table striped className='cerberus-permissions'>
        <thead>
          <tr>
            <th>Who</th>
            <th>How</th>
            <th>
              {hasParent && (
                <PrivateSwitch
                  disabled={!canChangePermissions}
                  activeInherit={activeInherit}
                  onInheritToggled={handleInheritToggled}
                />
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => {
            return (
              <tr key={permission.id}>
                <td>
                  {permission.permittee.displayName}
                  {permission.inherited && (
                    <p>
                      <small>(shared)</small>
                    </p>
                  )}
                </td>
                <td>
                  {permission.policies.map((policy) => {
                    return (
                      <PolicyCard
                        disabled={!canChangePermissions}
                        key={policy.id}
                        permission={permission}
                        policy={policy}
                        onDeleteClicked={handlePolicyRemoveClicked}
                      />
                    )
                  })}
                  <span>
                    <PolicySelect
                      resourceId={resourceId}
                      permissionId={permission.id}
                      onError={onError}
                      disabled={!canChangePermissions || permission.inherited}
                      onNewPolicySelected={handlePolicySelected}
                    />
                  </span>
                </td>
                <td>
                  <Button
                    disabled={!canChangePermissions || permission.inherited}
                    variant='danger'
                    onClick={handlePermissionRemoveClicked}
                    data-val1={permission.id}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            )
          })}
          <tr>
            <td>
              <PermitteeSelect
                permitteeName={newPermitteeName}
                onError={onError}
                disabled={!canChangePermissions}
                onNewPermitteeSelected={handleNewPermitteeSelected}
              />
            </td>
            <td>
              {newPolicies.map((policy) => {
                return (
                  <PolicyCard
                    key={policy.id}
                    policy={policy}
                    onDeleteClicked={handleNewPolicyRemoveClicked}
                  />
                )
              })}
              <span>
                <PolicySelect
                  resourceId={resourceId}
                  permissionId=''
                  onError={onError}
                  disabled={!canChangePermissions}
                  onNewPolicySelected={handleNewPolicySelected}
                />
              </span>
            </td>
            <td>
              <Button
                variant='primary'
                disabled={
                  !canChangePermissions ||
                  !newPermittee ||
                  newPolicies.length === 0
                }
                onClick={handlePermissionAddClicked}
              >
                Add
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </React.Fragment>
  )
}

function PolicyCard(props) {
  const { onDeleteClicked, permission, policy, disabled } = props

  const collapseId = permission ? permission.id + policy.id : policy.id
  const deleteDisabled = disabled || (permission ? permission.inherited : false)
  const permissionId = permission ? permission.id : ''

  function handleCollapseToggled(e) {
    // const id = e.target.getAttribute('id')

    e.target.classList.toggle(styles.active)
    const content = e.target.nextElementSibling
    if (content.style.maxHeight) {
      content.style.maxHeight = null
    } else {
      content.style.maxHeight = content.scrollHeight + 'px'
    }
  }

  return (
    <Toast className='d-inline-block'>
      <Toast.Body>
        <button className={styles.collapsible} onClick={handleCollapseToggled}>
          {policy.name}
        </button>
        <div className={styles.content}>
          <Container>
            <Row>
              <Col sm={10}>{policy.description}</Col>
              <Col sm={2}>
                <Button
                  disabled={deleteDisabled}
                  data-val1={permissionId}
                  data-val2={policy.id}
                  onClick={onDeleteClicked}
                  variant='outline-danger'
                  size='sm'
                >
                  x
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      </Toast.Body>
    </Toast>
  )
}

function PrivateSwitch(props) {
  const { activeInherit, onInheritToggled, disabled } = props

  return (
    <Form.Switch
      disabled={disabled}
      label={activeInherit ? 'shared custody' : 'self custody'}
      checked={activeInherit}
      onChange={onInheritToggled}
    />
  )
}

const PermitteeSelect = (props) => {
  const [target, setTarget] = useState(null)
  const ref = useRef(null)
  const [show, setShow] = useState(false)
  const [users, setUsers] = useState([])
  const [usersTotal, setUsersTotal] = useState(0)
  const [roles, setRoles] = useState([])
  const [rolesTotal, setRolesTotal] = useState(0)
  const [curPage, setCurPage] = useState(0)
  const [filter, setFilter] = useState('')
  const cerberusCtx = useContext(CerberusContext)
  const { get } = useFetch(
    cerberusCtx.apiHost + '/',
    cerberusCtx.apiTokenPair,
    cerberusCtx.suffix
  )

  const { permitteeName, onError, disabled, onNewPermitteeSelected } = props

  // empty so the popover stays the same size
  const emptyPermittees = []
  for (let i = 0; i < 10 - roles.length + users.length; i++) {
    emptyPermittees.push({ id: 'empty' + i })
  }

  useEffect(() => {
    get(
      `users?sort=displayName&order=asc&skip=${
        curPage * 5
      }&limit=5&filter=${filter}`
    )
      .then((r) => {
        if (r && r.page) {
          setUsers(r.page)
          setUsersTotal(r.total)
        } else {
          setUsers([])
          setUsersTotal(0)
        }
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })

    get(
      `roles?sort=displayName&order=asc&skip=${
        curPage * 5
      }&limit=5&filter=${filter}`
    )
      .then((r) => {
        if (r && r.page) {
          setRoles(r.page)
          setRolesTotal(r.total)
        } else {
          setRoles([])
          setRolesTotal(0)
        }
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }, [curPage, filter])

  function handleFilterChange(e) {
    setFilter(e.target.value)
  }

  const handleClick = (event) => {
    setShow(!show)
    setTarget(event.target)
  }

  return (
    <div ref={ref}>
      <Button disabled={disabled} variant='success' onClick={handleClick}>
        {permitteeName || 'Select User or Role'}
      </Button>

      <Overlay
        rootClose
        show={show}
        target={target}
        placement='bottom'
        container={ref}
        containerPadding={20}
        onHide={(e) => setShow(false)}
      >
        <Popover className={styles.permission_popover}>
          <Popover.Header as='h3'>Select a user or role</Popover.Header>
          <Popover.Body>
            <Table borderless hover size='sm'>
              <thead>
                <tr>
                  <th>User/Role name</th>
                  <th>Display name</th>
                </tr>
                <tr>
                  <th colSpan='2'>
                    <Form.Control
                      onChange={handleFilterChange}
                      placeholder='filter'
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th colSpan='2'>Roles</th>
                </tr>
                {roles.map((role) => {
                  return (
                    <tr key={role.id} onClick={onNewPermitteeSelected}>
                      <td data-val1={role.id} data-val2={role.displayName}>
                        {role.name}
                      </td>
                      <td data-val1={role.id} data-val2={role.displayName}>
                        {role.displayName}
                      </td>
                    </tr>
                  )
                })}
                <tr>
                  <th colSpan='2'>Users</th>
                </tr>
                {users.map((user) => {
                  return (
                    <tr key={user.id} onClick={onNewPermitteeSelected}>
                      <td data-val1={user.id} data-val2={user.displayName}>
                        {user.userName}
                      </td>
                      <td data-val1={user.id} data-val2={user.displayName}>
                        {user.displayName}
                      </td>
                    </tr>
                  )
                })}
                {emptyPermittees.map((permittee) => {
                  return (
                    <tr key={permittee.id}>
                      <td>&nbsp;</td>
                      <td />
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            <Paginator
              curPage={curPage}
              setCurPage={setCurPage}
              pageSize={5}
              pageWindowSize={3}
              total={rolesTotal + usersTotal}
            />
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  )
}

const PolicySelect = (props) => {
  const [target, setTarget] = useState(null)
  const ref = useRef(null)
  const [show, setShow] = useState(false)
  const [policies, setPolicies] = useState([])
  const [policiesTotal, setPoliciesTotal] = useState(0)
  const [curPage, setCurPage] = useState(0)
  const [filter, setFilter] = useState('')
  const cerberusCtx = useContext(CerberusContext)
  const { get } = useFetch(
    cerberusCtx.apiHost + '/',
    cerberusCtx.apiTokenPair,
    cerberusCtx.suffix
  )

  const { resourceId, permissionId, onError, disabled, onNewPolicySelected } =
    props

  // empty so the popover stays the same size
  const emptyPolicies = []
  for (let i = 0; i < 10 - policies.length; i++) {
    emptyPolicies.push({ id: 'empty' + i })
  }

  useEffect(() => {
    get(
      `resources/${resourceId}/policies?sort=name&order=asc&skip=${
        curPage * 10
      }&limit=10&filter=${filter}`
    )
      .then((r) => {
        if (r && r.page) {
          setPolicies(r.page)
          setPoliciesTotal(r.total)
        } else {
          setPolicies([])
          setPoliciesTotal(0)
        }
      })
      .catch((e) => {
        if (onError) {
          onError(e)
        }
        console.error(e)
      })
  }, [resourceId, curPage, filter])

  function handleFilterChange(e) {
    setFilter(e.target.value)
  }

  const handleClick = (event) => {
    setShow(!show)
    setTarget(event.target)
  }

  return (
    <div ref={ref}>
      <Button disabled={disabled} variant='success' onClick={handleClick}>
        Select Policy
      </Button>

      <Overlay
        rootClose
        show={show}
        target={target}
        placement='bottom'
        container={ref}
        containerPadding={20}
        onHide={(e) => setShow(false)}
      >
        <Popover className={styles.permission_popover}>
          <Popover.Header as='h3'>Select a policy</Popover.Header>
          <Popover.Body>
            <Table borderless hover size='sm'>
              <thead>
                <tr>
                  <th>Policy name</th>
                  <th>Description</th>
                </tr>
                <tr>
                  <th colSpan='2'>
                    <Form.Control
                      onChange={handleFilterChange}
                      placeholder='filter'
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => {
                  return (
                    <tr key={policy.id} onClick={onNewPolicySelected}>
                      <td
                        data-val1={policy.id}
                        data-val2={policy.name}
                        data-val3={policy.description}
                        data-val4={permissionId}
                      >
                        {policy.name}
                      </td>
                      <td
                        data-val1={policy.id}
                        data-val2={policy.name}
                        data-val3={policy.description}
                        data-val4={permissionId}
                      >
                        {policy.description}
                      </td>
                    </tr>
                  )
                })}
                {emptyPolicies.map((policy) => {
                  return (
                    <tr key={policy.id}>
                      <td>&nbsp;</td>
                      <td />
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            <Paginator
              curPage={curPage}
              setCurPage={setCurPage}
              pageSize={10}
              pageWindowSize={3}
              total={policiesTotal}
            />
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  )
}
