import React, { Component, useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { useObject } from 'react-firebase-hooks/database'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from 'react-router-dom'

import firebase from './config-firebase'

import auth from './auth'
import { generateID } from './utility'

const requestNewGame = () =>
    firebase.database()
        .ref('games')
        .push({ code: false })
        .key

const startGame = (gameID, gridWidth) =>
  firebase.database()
          .ref(`games/${gameID}`)
          .update({ status: 'ready', grid_size: { width: gridWidth, height: gridWidth } })

const State = props => {
  const [state, setState] = useState({})
  const [snapshot, loading, error] = useObject(firebase.database().ref('games/' + (state.gameKey || 'none')))

  if (!state.gameKey) {
    const gameKey = requestNewGame()
    setState({ ...state, gameKey })
    return props.render(null)
  }

  const game = snapshot ? snapshot.val() : null

  let players = game ? (game.connected_players || {}) : {}
  players = Object.keys(players).map(playerID => ({ ...players[playerID], id: playerID }))

  return props.render({ gameKey: state.gameKey, game, setState, players })
}

const Render = props => {
  if (!props) {
    return <div/>
  }

  return (
    <div>

      {props.game && (
        <div>
          <h1 style={{ fontSize: 30 }}>Game Code</h1>
          <h2 style={{ fontSize: 80, marginTop: 0, marginBottom: 0 }}>{props.game.code}</h2>
        </div>
      )}

      {props.game && (
        <i><p>To join, enter the code <b>{props.game.code}</b> on the controller.</p></i>
      )}

      <h1 style={{ fontSize: 50, marginTop: 100 }}>Players</h1>
      {props.players.length === 0 &&
        <p><i>no players yet</i></p>
      }
      {props.players.length > 0 &&
        props.players.map(p => <p>{p.name}</p>)
      }

      {props.game && props.players.length > 0 &&
        <Link to={`/game/${props.gameKey}`}>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 100 }}
            onClick={() => startGame(props.gameKey, 5)}>
            Start Game
          </Button>
        </Link>
      }
    </div>
  )
}

export default props =>
  <State render={p => (
    <Render {...p}/>
  )}/>
