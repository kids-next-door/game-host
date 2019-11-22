import React, { Component } from "react";
import { flexbox } from "@material-ui/system";

const entryForPlayer = player => {
  let entry = `${player.name}`;

  if (player.duration) {
    entry = `${entry} - ${player.duration}`;
  } else {
    entry = `${entry} - ${player.progress}`;
  }

  return (<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: '15px', height: '15px', backgroundColor: player.color, marginRight: '10px'}}></div>
      <div><p>{entry}</p></div>
    </div>)
};

export default props => (
  <div>
    <h2
      style={{
        color: "#FFFFFFFF",
        fontFamily: "Oswald",
        letterSpacing: "1px",
        marginBottom: "10px",
        marginTop: "0px"
      }}
    >
      Current Game
    </h2>

    <div className="rows">
      {props.players.map(player => (
        entryForPlayer(player)
      ))}
    </div>
  </div>
);
