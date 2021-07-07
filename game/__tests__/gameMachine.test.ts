import { interpret, Interpreter, send } from 'xstate';
import { gameMachine, gameMachineFactory, gameModel } from '../gameMachine';
import waitForExpect from 'wait-for-expect';
const events = gameModel.events;

const TEST_ROUND_TIME = 1;

const testMachine = gameMachineFactory({ test: true, initial: 'playing' });
const service = interpret(testMachine);

jest.useFakeTimers();

function advance(seconds: number) {
	jest.advanceTimersByTime(seconds * 1000);
}

describe('game	 machine', () => {
	let gameService = interpret(gameMachine);
	beforeEach(() => {
		gameService.start();
	});
	it('starts the game', async () => {
		gameService.send({ type: 'START_GAME' });
		expect(gameService.state.matches('playing')).toBeTruthy();
	});

	it('ends the game when target points reached', async () => {
		const gameMachine = gameMachineFactory({ test: true, initial: 'playing' });
		const context = { ...gameMachine.context };
		gameService = interpret(
			gameMachine.withContext({
				...context,
				secondsUntilEndOfRound: 1,
				teams: {
					...context.teams,
					teamA: {
						...context.teams.teamA,
						points: context.settings.targetPoints,
					},
				},
				settings: { ...context.settings, roundTimeInSeconds: 1 },
			}),
		);
		gameService.start();
		gameService.send(events.START_ROUND());
		gameService.send(events.CORRECT_ANSWER());
		advance(TEST_ROUND_TIME);
		expect(gameService.state.hasTag('waiting')).toBeTruthy();
		gameService.send(events.START_ROUND());
		gameService.send(events.CORRECT_ANSWER());
		advance(TEST_ROUND_TIME);
		expect(gameService.state.hasTag('ended'));
	});

	it('when game pauses then it restarts from the previous state', () => {
		gameService.send(events.START_GAME());
		gameService.send(events.PAUSE_GAME());
		gameService.send(events.CONTINUE_GAME());
		expect(gameService.state.hasTag('waiting')).toBeTruthy();
	});
	it('changes the name of team A', () => {
		gameService.send(events.CHANGE_TEAM_NAME({ name: 'teamA', team: 'A' }));
		const { teamA } = gameService.state.context.teams;
		expect(teamA.name).toEqual('teamA');
	});
	it('changes the name of team B', () => {
		gameService.send(events.CHANGE_TEAM_NAME({ team: 'B', name: 'teamB' }));
		const { teamB } = gameService.state.context.teams;
		expect(teamB.name).toEqual('teamB');
	});
	it('continues  the game', () => {
		gameService.send(events.START_GAME());
		gameService.send(events.PAUSE_GAME());
		gameService.send(events.CONTINUE_GAME());
		expect(gameService.state.matches({ playing: { teamA: 'waiting' } })).toBeTruthy();
	});
	it('selects a random question', () => {
		gameService.send(events.START_GAME());
		expect(gameService.state.context.currentQuestion).toBeTruthy();
	});

	describe('for team A', () => {
		const gameMachine = gameMachineFactory({ test: true, initial: 'playing' });
		let gameService = interpret(gameMachine);
		beforeEach(async () => {
			gameService.start();
		});
		afterEach(() => {
			gameService.stop();
		});
		it('starts the round', async () => {
			gameService.send(events.START_ROUND());
			expect(gameService.state.context.currentTeam).toEqual('A');
			expect(gameService.state.hasTag('playing'));
		});

		it('pauses the game and continues it', () => {
			gameService.send(events.PAUSE_GAME());
			expect(gameService.state.hasTag('paused'));
			gameService.send(events.CONTINUE_GAME());
			expect(gameService.state.hasTag('playing'));
		});

		it('ends the round after round time', async () => {
			gameService.send(events.START_ROUND());
			advance(TEST_ROUND_TIME);
			expect(gameService.state.hasTag('playing')).toBeFalsy();
		});
		it('calculate points based on correct answer mutliplier', async () => {
			const { context } = gameService.state;
			const currentTeam = 'teamA';
			const currentPoints = context.teams[currentTeam].points;
			const nextPoints = currentPoints + context.settings.correctAnwserMultiplier * 1;
			gameService.send(events.START_ROUND());
			gameService.send(events.CORRECT_ANSWER());
			expect(gameService.state.context.teams.teamA.points).toEqual(nextPoints);
		});
	});

	describe('for team B', () => {
		const gameMachine = gameMachineFactory({ test: true, initial: 'playing' });
		let gameService = interpret(gameMachine);
		beforeEach(() => {
			gameService.start();
			gameService.send(events.START_ROUND());
			advance(TEST_ROUND_TIME);
			gameService.send(events.START_ROUND());
		});
		afterEach(() => {
			gameService.stop();
		});
		it('starts the round', async () => {
			expect(gameService.state.hasTag('playing')).toBeTruthy();
		});
		it('pauses the game and continues it', () => {
			gameService.send(events.PAUSE_GAME());
			expect(gameService.state.hasTag('paused'));
			gameService.send(events.CONTINUE_GAME());
			expect(gameService.state.hasTag('playing'));
		});
		it('ends the round after round time', async () => {
			expect(gameService.state.hasTag('playing'));
			advance(TEST_ROUND_TIME);
			expect(gameService.state.hasTag('waiting')).toBeTruthy();
		});
		it('calculate points based on correct answer mutliplier', async () => {
			const currentTeam = 'teamB';
			const { context } = gameService.state;
			const currentPoints = context.teams[currentTeam].points;
			const nextPoints = currentPoints + context.settings.correctAnwserMultiplier * 1;
			gameService.send(events.CORRECT_ANSWER());
			expect(gameService.state.context.teams[currentTeam].points).toEqual(nextPoints);
		});
	});

	afterEach(() => {
		gameService.stop();
	});
});
