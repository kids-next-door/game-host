import React, { Component } from "react";

export default props => (
  <div>
    <h2
      style={{
        color: "#f7b700",
        fontFamily: "Oswald",
        letterSpacing: "1px",
        marginBottom: "10px",
        marginTop: "30px"
      }}
    >
      Scoreboard:
    </h2>

    <div className="rows">
      {props.players.map(player => (
        <div className="row">
          <h1
            style={{
              fontFamily: "Oswald",
              fontSize: "30px",
              letterSpacing: "1px",
              marginBottom: "10px",
              marginTop: "0px"
            }}
          >
            {player.rank}. {player.name} - {player.duration}
          </h1>
        </div>
      ))}
    </div>
  </div>
);
