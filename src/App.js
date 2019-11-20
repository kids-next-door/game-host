import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import logo from './logo.svg'
import './App.css'

import GameScreen from './GameScreen';
import CreateGame from './CreateGame';
import GameOver from './GameOver';
import Login from './Login';
import SignUp from './SignUp';

import { logout, registerStateListener } from './auth'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  Redirect
} from 'react-router-dom'

const createMenuButton = details => (
  <Link to={details.to} style={{ textDecoration: 'none' }}>
    <Button onClick={details.onClick} style={{ color: 'blue', fontSize: 25 }}>
      <b>{details.text}</b>
    </Button>
  </Link>
)

const createMenu = ({ authState }) => {
  let menuItems = []

  if (authState) {
    menuItems.push({ to: '/new-game', text: 'New Game' })
    menuItems.push({ onClick: () => logout(), text: 'Logout' })
  } else {
    menuItems.push({ to: '/', text: 'Login' })
    menuItems.push({ to: '/signup', text: 'Sign Up' })
  }

  const menuButtons = menuItems.map(createMenuButton)

  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      {menuButtons.map(o => (
        <span style={{ margin: 20 }}>
          {o}
        </span>
      ))}
    </div>
  )
}

const App = props => {
  const [authState, setAuthState] = useState()
  registerStateListener(setAuthState)

  // if not authenticated, redirect to login
  const EnforceAuth = props => {
    return authState ? props.children : <Redirect to={props.redirectTo}/>
  }
  // if authenticated, redirect elsewhere
  const AllowSkipAuth = props => {
    return authState ? <Redirect to={props.redirectTo}/> : props.children
  }

  const menu = createMenu({ authState })

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Router>
        <div style={{ width: '100%' }}>
          {menu}

          <hr style={{ width: '100%' }}/>

          <Switch>
            <Route exact path="/">
              <AllowSkipAuth redirectTo="/new-game">
                <Login/>
              </AllowSkipAuth>
            </Route>
            <Route path="/signup">
              <AllowSkipAuth redirectTo="/new-game">
                <SignUp/>
              </AllowSkipAuth>
            </Route>
            <Route path="/new-game">
              <EnforceAuth redirectTo="/">
                <CreateGame/>
              </EnforceAuth>
            </Route>
            <Route path="/game/:id/over">
              <EnforceAuth redirectTo="/">
                <GameOver/>
              </EnforceAuth>
            </Route>
            <Route path="/game/:id">
              <GameScreen/>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
