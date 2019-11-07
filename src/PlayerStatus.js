import React, { Component } from 'react'

export default props => (
  <div>
    <h2>Current Game</h2>

    <div className='rows'>
      {props.players.map(player => {

        return (
          <div className='row'>
            <p>{player.name} - {player.progress}</p>
          </div>
        )

      })}
    </div>
  </div>
)
