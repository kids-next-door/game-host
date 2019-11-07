import React, { Component } from 'react'

export default props => (
  <div>
    <h2>Scoreboard</h2>

    <div className='rows'>
      {props.players.map(player => {

        return (
          <div className='row'>
            <p>{player.name} - {player.wins}</p>
          </div>
        )

      })}
    </div>
  </div>
)
