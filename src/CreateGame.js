import React, { Component, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useObject } from "react-firebase-hooks/database";

import "./fonts.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";

import firebase from "./config-firebase";

import auth from "./auth";
import { generateID } from "./utility";

const requestNewGame = () =>
  firebase
    .database()
    .ref("games")
    .push({ code: false }).key;

const startGame = (gameID, gridWidth) =>
  firebase
    .database()
    .ref(`games/${gameID}`)
    .update({
      status: "ready",
      grid_size: { width: gridWidth, height: gridWidth }
    });

const State = props => {
  const [state, setState] = useState({});
  const [snapshot, loading, error] = useObject(
    firebase.database().ref("games/" + (state.gameKey || "none"))
  );

  if (!state.gameKey) {
    const gameKey = requestNewGame();
    setState({ ...state, gameKey });
    return props.render(null);
  }

  const game = snapshot ? snapshot.val() : null;

  let players = game ? game.connected_players || {} : {};
  players = Object.keys(players).map(playerID => ({
    ...players[playerID],
    id: playerID
  }));

  return props.render({ gameKey: state.gameKey, game, setState, players });
};

const Render = props => {
  if (!props) {
    return <div />;
  }

  return (
    <div>
      {props.game && (
        <div>
          <h1
            style={{
              fontSize: 30,
              color: "#f7b700",
              fontFamily: "Oswald",
              letterSpacing: "1px",
              marginBottom: "10px",
              marginTop: "10px"
            }}
          >
            Game Code:
          </h1>
          <h2
            style={{
              fontSize: 80,
              fontFamily: "Oswald",
              letterSpacing: "15px",
              marginBottom: "10px",
              marginTop: "0px"
            }}
          >
            {props.game.code}
          </h2>
        </div>
      )}

      {props.game && (
        <p style={{ fontFamily: "Oswald", fontSize: "20px" }}>
          To join, enter the code{" "}
          <b style={{ letterSpacing: "3px" }}>{props.game.code}</b> on the
          controller.
        </p>
      )}

      <h1
        style={{
          fontSize: 30,
          color: "#f7b700",
          fontFamily: "Oswald",
          letterSpacing: "1px",
          marginBottom: "10px",
          marginTop: "50px"
        }}
      >
        Players:
      </h1>
      {props.players.length === 0 && (
        <p
          style={{
            fontFamily: "Oswald",
            fontSize: "20px"
          }}
        >
          No players yet.
        </p>
      )}
      {props.players.length > 0 &&
        props.players.map(p => (
          <p style={{ fontFamily: "Oswald", fontSize: "20px" }}>{p.name}</p>
        ))}
      {props.game && props.players.length > 1 && (
        <Link style={{ textDecoration: "none" }} to={`/game/${props.gameKey}`}>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginTop: 10,
              fontFamily: "Oswald",
              fontSize: "20px",
              backgroundColor: "#f7b700"
            }}
            onClick={() => startGame(props.gameKey, 5)}
          >
            Start Game
          </Button>
        </Link>
      )}
    </div>
  );
};

export default props => <State render={p => <Render {...p} />} />;
