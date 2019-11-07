import React from 'react'
import moment from 'moment'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

import PostGameLeaderboard from './PostGameLeaderboard'

import { useObject } from 'react-firebase-hooks/database'

import {
  useParams,
  Redirect,
  Link
} from 'react-router-dom'

const firebase = require('./config-firebase')

const restartGame = gameKey =>
  firebase.database()
      .ref(`games/${gameKey}/status`)
      .set('ready')

const backToLobby = gameKey =>
  firebase.database()
      .ref(`games/${gameKey}/status`)
      .set('closed')

const NoGameFound = () => <h1>No Game Found!</h1>

const State = props => {
  const params = useParams()
  const gameID = params.id

  const gameRef = firebase.database().ref(`games/${gameID}`)

  const [snapshot, loading, error] = useObject(gameRef)
  if (!snapshot) {
	  return <NoGameFound/>
  }

  const game = snapshot.val()

  if (game.status === 'in-progress') {
    return <Redirect to={`/game/${snapshot.key}`}/>
  } else if (game.status === 'closed') {
    return <Redirect to="/new-game"/>
  }

  const startTime = moment(game.started)

  const players = Object
    .keys(game.player_state)
    .map((playerID, index) => {
      const finishTime = moment(game.player_state[playerID].finished)
      const rawDuration = moment.duration(finishTime.diff(startTime))
      const duration = moment.utc(+rawDuration)

      const minutes = parseInt(duration.format('m'))
      const seconds = parseInt(duration.format('s'))

      return {
        id: playerID,
        duration: (minutes * 60) + seconds,
      }
    })
    .map((player, index) => ({
      ...player,
      name: game.connected_players[player.id].name,
      duration: `${Math.floor(player.duration / 60)}m ${player.duration % 60}s`,
    }))

  const ordered = [...players].sort((a, b) => a.duration < b.duration)
  const ranked = ordered.map((x, index) => ({ ...x, rank: index + 1 }))
  
  return props.render({ game, players: ranked, gameKey: snapshot.key })
}

const Render = ({ game, players, gameKey }) => (
	<Box display="flex" p={1}>
	  <Box flexGrow={1}>
		  <PostGameLeaderboard players={players}/>
    
      <Button onClick={() => restartGame(gameKey)}>
        <p style={{ color: 'white', fontSize: 20 }}>Start New Game</p>
      </Button>
      <Button onClick={() => backToLobby(gameKey)}>
        <p style={{ color: 'white', fontSize: 20 }}>Return To Lobby</p>
      </Button>
	  </Box>
	</Box>
)

export default props => (
  <State render={p => (
    <Render {...p}/>
  )}/>
)
