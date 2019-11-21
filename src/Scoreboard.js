import React, { Component } from "react";

export default props => {
  // alert(JSON.stringify(props))

  return (
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
        Scoreboard
      </h2>

      <div className="rows">
        {props.scores.map(record => {
          return (
            <div className="row">
              <p
                style={{
                  color: "#FFFFFFFF",
                  fontFamily: "Oswald",
                  letterSpacing: "1px",
                  marginBottom: "10px"
                }}
              >
                {record.name} - {record.score}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
