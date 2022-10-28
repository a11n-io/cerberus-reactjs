import React from 'react'

import 'cerberus-reactjs/dist/index.css'
import {Permissions} from 'cerberus-reactjs';

const App = () => {
  return <Permissions cerberusUrl="/" cerberusToken="" accountId="accid" resourceId="resid"/>
}

export default App
