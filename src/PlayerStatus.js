import React, { Component } from "react";

const entryForPlayer = player => {
  let entry = `${player.name}`;

  if (player.duration) {
    entry = `${entry} - ${player.duration}`;
  } else {
    entry = `${entry} - ${player.progress}`;
  }

  return <p>{entry}</p>;
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
        <div className="row">{entryForPlayer(player)}</div>
      ))}
    </div>
  </div>
);
