import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { createUser } from './auth'

export default props => {
  const [state, setState] = useState({})

  return (
    <div>
      <TextField label="username" onChange={event => setState({ ...state, username: event.target.value })}/>
      <TextField label="password" onChange={event => setState({ ...state, password: event.target.value })}/>
      <TextField label="repeat password"/>

      <Button variant="contained" color="primary" onClick={() => createUser(state.username, state.password)}>
        Sign Up
      </Button>
    </div>
  )
}
