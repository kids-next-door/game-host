import React, { Component } from 'react'
import { useObject } from 'react-firebase-hooks/database'
import Tile from './Tile'

import { useParams } from 'react-router-dom'

const firebase = require('./config-firebase')

const colors = [
  'hsl(36, 100%, 50%)',
  'hsl(180, 100%, 50%)',
  'hsl(72, 100%, 50%)',
  'hsl(288, 100%, 50%)',
  'hsl(108, 100%, 50%)',
  'hsl(252, 100%, 50%)',
  'hsl(144, 100%, 50%)',
  'hsl(216, 100%, 50%)',
  'hsl(324, 100%, 50%)',
  'hsl(360, 100%, 50%)'
]

const positionKey = position => `${position.x},${position.y}`

const Square = props => {
  return (
      <Tile colors={props.colors} />
  )
}

const InvalidGameID = props => <p>Missing Game Info</p>

const State = props => {
  const params = useParams()

  const [snapshot, loading, error] = useObject(firebase.database().ref('games/' + (params.id || 'none')))
  const game = snapshot ? snapshot.val() : null

  if (!game || !game.player_state) {
    return <InvalidGameID/>
  }

  const columns = [...Array(game.grid_size.width)]
  const rows = [...Array(game.grid_size.height)]

  let playerCount = 0;

  const playerPositions = Object.keys(game.player_state)
                                .reduce((positions, playerID) => {
                                  const key = positionKey(game.player_state[playerID].current_position)
                                  const existing = positions[key] || []
                                  return {
                                    ...positions,
                                    [key]: [...existing, colors[playerCount++]],
                                  }
                                }, {})

  return props.render({ columns, rows, playerPositions, playerCount })
}

const Render = ({ columns, rows, playerPositions, playerCount }) => {
  return (
      <div className='rows'>
        {columns.map((_, y) => (
          <div className='row' style={{ height: 105 }}>
            {rows.map((_, x) => {
              const colors = playerPositions[positionKey({ x, y })] || []
              return <span style={{ marginLeft: 2.5, marginRight: 2.5 }}><Square colors={colors}/></span>
            })}
          </div>
        ))}
      </div>
    )
}

export default props => <State render={renderProps => <Render {...renderProps}/>}/>
