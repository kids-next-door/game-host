import React, { Component } from 'react'

export default props => {
  // alert(JSON.stringify(props))

return (
  <div>
    <h2>Scoreboard</h2>

    <div className='rows'>
      {props.scores.map(record => {

        return (
          <div className='row'>
            <p>{record.name} - {record.score}</p>
          </div>
        )

      })}
    </div>
  </div>
)
}