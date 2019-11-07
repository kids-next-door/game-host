import React from 'react'

import Gameboard from './Gameboard'
import PlayerStatus from './PlayerStatus'
import Scoreboard from './Scoreboard'

import { useObject } from 'react-firebase-hooks/database'
import { useParams, Redirect } from 'react-router-dom'

import Box from '@material-ui/core/Box'

const firebase = require('./config-firebase')

const NoGameFound = () => <h1>No Game Found!</h1>
const NoPlayers = () => <h1>No players have connected!</h1>

const State = props => {
  const params = useParams()
  const gameID = params.id

  const gameRef = firebase.database().ref(`games/${gameID}`)

  const [snapshot, loading, error] = useObject(gameRef)
  if (!snapshot) {
	  return <NoGameFound/>
  }

  const game = snapshot.val()

  if (game.status === 'over') {
    return <Redirect to={`/game/${snapshot.key}/over`}/>
  }

  if (!game.connected_players) {
    return <NoPlayers/>
  }

  const players = Object.keys(game.connected_players)
              .map(playerID => ({ id: playerID, ...game.connected_players[playerID] }))

  return props.render({ game, players })
}

const Render = ({ game, players }) => (
	<Box display="flex" p={1}>
	  <Box flexGrow={1}>
		  <PlayerStatus players={players}/>
		</Box>
		<Box flexGrow={1}>
      <h2>Game Code</h2>
      <h2 style={{ color: '#CD870D' }}>{game.code}</h2>
	    <Gameboard columnCount={game.grid_size.width} rowCount={game.grid_size.height}/>
	  </Box>
	  <Box flexGrow={1}>
		  <Scoreboard players={players}/>
	  </Box>
	</Box>
)

export default props => (
  <State render={({ game, players }) => (
    <Render {...{ game, players }}/>
  )}/>
)
