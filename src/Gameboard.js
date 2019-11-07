import React, { Component } from 'react'
import { useObject } from 'react-firebase-hooks/database'

import { useParams } from 'react-router-dom'

const firebase = require('./config-firebase')

const styles = ({ color, size }) => ({
  width: size.width,
  height: size.height,
  // backgroundColor: isActive ? '#D7980A' : '#0C6193',
  backgroundColor: color,
  display: 'inline-block',
  boxShadow: '-5px 5px #000',
})

const positionKey = position => `${position.x},${position.y}`

const Square = props => {
  if (props.colors.length > 0) {
    return (
      <div style={styles({ size: { width: 100, height: 100 }, color: '#D7980A' })}/>
    )
  } else {
    return <div style={styles({ size: { width: 100, height: 100 }, color: '#0C6193' })}/>
  }
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

  const playerPositions = Object.keys(game.player_state)
                                .reduce((positions, playerID) => {
                                  const key = positionKey(game.player_state[playerID].current_position)
                                  const existing = positions[key] || []
                                  return {
                                    ...positions,
                                    [key]: [...existing, 'red'],
                                  }
                                }, {})

  return props.render({ columns, rows, playerPositions })
}

const Render = ({ columns, rows, playerPositions }) => {
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
