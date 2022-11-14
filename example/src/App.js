import React from 'react'
import 'cerberus-reactjs/dist/index.css'
import { Tab, Tabs } from 'react-bootstrap'
import { CerberusProvider, Permissions, Users, Roles } from 'cerberus-reactjs'

const App = () => {
  return (
    <>
      <CerberusProvider cerberusUrl='/data/' suffix='.json'>
        <Tabs defaultActiveKey='permissions' className='mb-3'>
          <Tab eventKey='permissions' title='Permissions'>
            <Permissions resourceId='resid' />
          </Tab>
          <Tab eventKey='users' title='Users'>
            <Users
              UserSelectedComponent={Details}
              NoUserSelectedComponent={Invite}
            />
          </Tab>
          <Tab eventKey='roles' title='Roles'>
            <Roles />
          </Tab>
        </Tabs>
      </CerberusProvider>
    </>
  )
}

function Details(props) {
  const { userId } = props

  return <>Details for {userId}</>
}

function Invite() {
  return <>Invite a user</>
}

export default App
