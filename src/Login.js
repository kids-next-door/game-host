import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { login } from './auth'

export default props => {
  const [state, setState] = useState({})

  return (
    <div>
      <TextField label="username" onChange={event => setState({ ...state, username: event.target.value })}/>
      <TextField label="password" onChange={event => setState({ ...state, password: event.target.value })}/>

      <Button variant="contained" color="primary" onClick={() => login(state.username, state.password)}>
        Login
      </Button>
    </div>
  )
}
