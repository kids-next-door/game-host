import moment from 'moment'

export default {
	generateID: length => Math.random().toString(16).replace('0.', '').substring(0, length || 16).toUpperCase(),
	timeToComplete: game => {
		const startTime = moment(game.started)

		return Object
			.keys(game.player_state)
			.filter(playerID => game.player_state[playerID].finished !== undefined)
			.map((playerID, index) => {
				const finishTime = moment(game.player_state[playerID].finished)
				const rawDuration = moment.duration(finishTime.diff(startTime))
				const duration = moment.utc(+rawDuration)

				const minutes = parseInt(duration.format('m'))
				const seconds = parseInt(duration.format('s'))

				return {
					id: playerID,
					duration: (minutes * 60) + seconds,
				}
			})
			.map((player, index) => ({
				...player,
				name: game.connected_players[player.id].name,
				duration: `${Math.floor(player.duration / 60)}m ${player.duration % 60}s`,
			}))
			.reduce((acc, player) => ({
				...acc,
				[player.id]: player,
			}), {})
	},
}
