import React, { useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import Loader from '../../uikit/Loader'
import Button from '../../uikit/Button'

export default function Permissions(props) {
  const { cerberusUrl, cerberusToken, accountId, resourceId } = props
  const { get, post, del, loading } = useFetch(cerberusUrl, cerberusToken)
  const [permissions, setPermissions] = useState([])
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [policies, setPolicies] = useState([])
  const [newPermittee, setNewPermittee] = useState()
  const [newPolicies, setNewPolicies] = useState([])

  useEffect(() => {
    get(`accounts/${accountId}/resources/${resourceId}/permissions`)
      .then((r) => {
        if (r) {
          setPermissions(r)
        }
      })
      .catch((e) => console.log(e))

    get(`accounts/${accountId}/users`)
      .then((r) => {
        if (r) {
          setUsers(r)
        }
      })
      .catch((e) => console.log(e))

    get(`accounts/${accountId}/roles`)
      .then((r) => {
        if (r) {
          setRoles(r)
        }
      })
      .catch((e) => console.log(e))

    get(`accounts/${accountId}/resources/${resourceId}/policies`)
      .then((r) => {
        if (r) {
          setPolicies(r)
        }
      })
      .catch((e) => console.log(e))
  }, [])

  function handlePolicyRemoveClicked(e) {
    const permissionId = e.target.getAttribute('data-val1')
    const policyId = e.target.getAttribute('data-val2')

    if (!permissionId || !policyId) {
      return
    }

    del(
      `accounts/${accountId}/permissions/${permissionId}/policies/${policyId}`
    )
      .then((r) => {
        setPermissions((prev) => [
          ...prev.filter((p) => p.id !== permissionId),
          r
        ])
      })
      .catch((e) => console.log(e))
  }

  function handlePolicySelected(e) {
    const permissionId = e.target.getAttribute('data-val1')
    const policyId = e.target.value
    if (!permissionId || !policyId) {
      return
    }

    post(
      `accounts/${accountId}/permissions/${permissionId}/policies/${policyId}`
    )
      .then((r) => {
        const permission = permissions.find((p) => p.id === permissionId)
        const policy = policies.find((p) => p.id === policyId)

        if (permission && policy) {
          permission.policies = [...permission.policies, policy]
          setPermissions((prev) => [
            ...prev.filter((p) => p.id !== permissionId),
            permission
          ])
        }
      })
      .catch((e) => console.log(e))
  }

  function handlePermissionRemoveClicked(e) {
    const permissionId = e.target.getAttribute('data-val1')
    if (!permissionId) {
      return
    }

    del(`accounts/${accountId}/permissions/${permissionId}`)
      .then((r) => {
        setPermissions((prev) =>
          prev.filter((perm) => perm.id !== permissionId)
        )
      })
      .catch((e) => console.log(e))
  }

  function handlePermissionAddClicked(e) {
    if (!newPermittee || newPolicies.length === 0) {
      return
    }

    post(`accounts/${accountId}/permissions`, {
      permitteeId: newPermittee,
      resourceId: resourceId,
      policyIds: newPolicies.map((p) => p.id)
    })
      .then((r) => setPermissions((prev) => [...prev, r]))
      .catch((e) => console.log(e))
      .finally(() => {
        setNewPermittee(null)
        setNewPolicies([])
      })
  }

  function handleNewPermitteeSelected(e) {
    setNewPermittee(e.target.value)
  }

  function handleNewPolicySelected(e) {
    const newPolicyId = e.target.value
    if (!newPolicies.find((p) => p.id === newPolicyId)) {
      const policy = policies.find((p) => p.id === newPolicyId)
      if (policy) {
        setNewPolicies((prev) => [...prev, policy])
      }
    }
  }

  function handleNewPolicyRemoveClicked(e) {
    const policyId = e.target.getAttribute('data-val1')
    if (!policyId) {
      return
    }

    setNewPolicies((prev) => prev.filter((p) => p.id !== policyId))
  }

  if (loading) {
    return <Loader />
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Permittee</th>
          <th>Policies</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {permissions.map((permission) => {
          return (
            <tr key={permission.id}>
              <td>{permission.permittee.displayName}</td>
              <td>
                {permission.policies.map((policy) => {
                  return (
                    <span key={policy.id}>
                      {policy.name}

                      {/* eslint-disable-next-line react/jsx-no-bind */}
                      <Button
                        outline
                        accent
                        data-val1={permission.id}
                        data-val2={policy.id}
                        onClick={handlePolicyRemoveClicked}
                      >
                        x
                      </Button>
                    </span>
                  )
                })}
                <span>
                  <select
                    onChange={handlePolicySelected}
                    data-val1={permission.id}
                  >
                    <option value=''>Select Policy</option>
                    {policies.map((policy) => {
                      return (
                        <option key={policy.id} value={policy.id}>
                          {policy.name}
                        </option>
                      )
                    })}
                  </select>
                </span>
              </td>
              <td>
                <Button
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
            <label htmlFor='permittees'>Permittee:</label>
            <select id='permittees' onChange={handleNewPermitteeSelected}>
              <option value=''>Select Role or User</option>
              <optgroup label='Roles'>
                {roles.map((role) => {
                  return (
                    <option key={role.id} value={role.id}>
                      {role.displayName}
                    </option>
                  )
                })}
              </optgroup>
              <optgroup label='Users'>
                {users.map((user) => {
                  return (
                    <option key={user.id} value={user.id}>
                      {user.displayName}
                    </option>
                  )
                })}
              </optgroup>
            </select>
          </td>
          <td>
            {newPolicies.map((policy) => {
              return (
                <span key={policy.id}>
                  {policy.name}
                  <Button
                    outline
                    accent
                    data-val1={policy.id}
                    onClick={handleNewPolicyRemoveClicked}
                  >
                    x
                  </Button>
                </span>
              )
            })}
            <span>
              <select onChange={handleNewPolicySelected}>
                <option value=''>Select Policy</option>
                {policies.map((policy) => {
                  return (
                    <option key={policy.id} value={policy.id}>
                      {policy.name}
                    </option>
                  )
                })}
              </select>
            </span>
          </td>
          <td>
            <Button
              disabled={!newPermittee || newPolicies.length === 0}
              onClick={handlePermissionAddClicked}
            >
              Add
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
