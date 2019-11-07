import React, { Component } from 'react'

export default props => (
  <div>
    <h2>Scoreboard</h2>

    <div className='rows'>
      {props.players.map(player => (
        <div className='row'>


          <h1>{player.rank}. {player.name} - {player.duration}</h1>
        </div>
      ))}
    </div>
  </div>
)
