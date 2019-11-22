import React from "react";

import Gameboard from "./Gameboard";
import PlayerStatus from "./PlayerStatus";
import Scoreboard from "./Scoreboard";

import { useObject } from "react-firebase-hooks/database";
import { useParams, Redirect } from "react-router-dom";

import Box from "@material-ui/core/Box";

import utilities from "./utility";

import "./fonts.css";

const firebase = require("./config-firebase");

const pointEquals = (a, b) => a.x === b.x && a.y === b.y;

const NoGameFound = () => <h1>No Game Found!</h1>;
const NoPlayers = () => <h1>No players have connected!</h1>;

const colors = [
  'hsl(36, 100%, 50%)',
  'hsl(180, 100%, 50%)',
  'hsl(72, 100%, 50%)',
  'hsl(288, 100%, 50%)',
  'hsl(108, 100%, 50%)',
  'hsl(252, 100%, 50%)',
  'hsl(144, 100%, 50%)',
  'hsl(216, 100%, 50%)',
  'hsl(324, 100%, 50%)',
  'hsl(360, 100%, 50%)'
]

const State = props => {
  const params = useParams();
  const gameID = params.id;

  const gameRef = firebase.database().ref(`games/${gameID}`);

  const [snapshot, loading, error] = useObject(gameRef);
  if (!snapshot) {
    return <NoGameFound />;
  }

  const game = snapshot.val();

  if (game.status === "over") {
    return <Redirect to={`/game/${snapshot.key}/over`} />;
  }

  if (!game.connected_players || !game.paths || !game.scores) {
    return <NoPlayers />;
  }

  const progress = playerID => {
    if (!game.player_state) {
      return 0;
    }
    const currentPosition = game.player_state[playerID].current_position;
    const path = game.paths[playerID];
    for (const index in path) {
      if (pointEquals(path[index], currentPosition)) {
        return parseInt(index) + 1;
      }
    }
    return null;
  };
  let playerCount = 0
  let players = Object.keys(game.connected_players).map(playerID => ({
    id: playerID,
    progress: `${progress(playerID)}/${game.paths[playerID].length}`,
    color: colors[playerCount++],
    ...game.connected_players[playerID]
  }));

  if (game.player_state) {
    const completions = utilities.timeToComplete(game);

    players = players.map(player => ({
      ...player,
      duration: (completions[player.id] || {}).duration
    }));
  }

  const scores = Object.keys(game.scores).map(playerID => ({
    playerID,
    name: game.connected_players[playerID].name,
    score: game.scores[playerID]
  }));

  return props.render({ game, players, scores });
};

const Render = ({ game, players, scores }) => (
  <Box display="flex" p={1}>
    <Box flexGrow={1}>
      <PlayerStatus players={players} />
    </Box>
    <Box flexGrow={1}>
      <h2
        style={{
          color: "#f7b700",
          fontFamily: "Oswald",
          letterSpacing: "1px",
          marginBottom: "10px",
          marginTop: "0px",
          fontSize: "1em"
        }}
      >
        Game Code: {game.code}
      </h2>
      <Gameboard
        players={players}
        columnCount={game.grid_size.width}
        rowCount={game.grid_size.height}
      />
    </Box>
    <Box flexGrow={1}>
      <Scoreboard scores={scores} />
    </Box>
  </Box>
);

export default props => <State render={props => <Render {...props} />} />;
