import { assign, createMachine, interpret } from 'xstate';
import { createModel } from 'xstate/lib/model';

interface Question {
	word: string;
	forbiddenWords: string[];
}

interface Settings {
	roundTimeInSeconds: number;
	correctAnwserMultiplier: 1;
	targetPoints: number;
}

const defaultSettings: Settings = {
	roundTimeInSeconds: 5,
	correctAnwserMultiplier: 1,
	targetPoints: 5,
};

const testQuestions: Question[] = Array(45)
	.fill(0)
	.map((e, i) => ({
		word: `Καραγκούνης ${i}`,
		forbiddenWords: ['Euro', 'ποδόσφαιρο', 'Παναθηναικός'],
	}));
export const gameModel = createModel(
	{
		settings: defaultSettings,
		secondsUntilEndOfRound: defaultSettings.roundTimeInSeconds,
		currentTeam: 'A' as 'A' | 'B',
		currentQuestion: {} as Question,
		teams: {
			teamA: {
				name: 'giorgos',
				points: 0,
			},
			teamB: {
				name: 'fenia',
				points: 0,
			},
		},
		questions: testQuestions,
	},
	{
		events: {
			CHANGE_TEAM_NAME: (payload: { name: string; team: 'A' | 'B' }) => payload,
			START_ROUND: () => ({}),
			DECREMENT_ROUND_TIME: () => ({}),
			START_GAME: () => ({}),
			PAUSE_GAME: () => ({}),
			CONTINUE_GAME: () => ({}),
			PASS: () => ({}),
			WRONG_ASNWER: () => ({}),
			CORRECT_ANSWER: () => ({}),
			RESET_GAME: () => ({}),
		},
	},
);

export const gameMachineFactory = ({
	initial,
	test,
}: {
	initial: string;
	test?: boolean;
}) =>
	createMachine<typeof gameModel>(
		{
			id: 'taboo',
			initial: initial,
			context: test
				? {
						...gameModel.initialContext,
						secondsUntilEndOfRound: 1,
						settings: {
							...gameModel.initialContext.settings,
							roundTimeInSeconds: 1,
						},
				  }
				: gameModel.initialContext,
			on: {
				'CHANGE_TEAM_NAME': {
					actions: ['changeTeamName'],
				},
			},
			states: {
				waitingGame: {
					on: {
						START_GAME: {
							target: 'playing',
							actions: 'pickRandomQuestion',
						},
					},
				},
				playing: {
					id: 'playing',
					initial: 'teamA',
					states: {
						teamA: {
							id: 'A',
							tags: 'teamPlaying',
							initial: 'waiting',
							entry: ['currentTeamA', 'pickRandomQuestion'],
							states: {
								waiting: {
									tags: ['waiting'],
									on: {
										'START_ROUND': 'playing',
										'RESET_GAME': {
											target: '#taboo.waitingGame',
											actions: 'resetGame',
										},
									},
								},
								playing: {
									tags: ['playing'],
									always: {
										target: '#B',
										cond: 'hasRoundEnded',
										actions: ['resetRoundTime'],
									},
									exit: 'resetRoundTime',
									invoke: {
										src: 'decrementRoundTimeService',
									},
									on: {
										PAUSE_GAME: {
											target: 'paused',
										},
										CORRECT_ANSWER: {
											actions: ['calculatePoints', 'pickRandomQuestion'],
										},
										WRONG_ASNWER: {
											actions: ['pickRandomQuestion'],
										},
										PASS: {
											actions: ['pickRandomQuestion'],
										},
										DECREMENT_ROUND_TIME: {
											actions: 'decrementRoundTime',
										},
									},
								},
								paused: {
									tags: ['paused'],
									on: {
										CONTINUE_GAME: {
											target: 'playing',
										},
									},
								},
							},
						},
						teamB: {
							id: 'B',
							tags: 'teamPlaying',
							initial: 'waiting',
							entry: ['currentTeamB', 'pickRandomQuestion'],
							states: {
								waiting: {
									tags: ['waiting'],
									on: {
										'START_ROUND': 'playing',
										'RESET_GAME': {
											target: '#taboo.waitingGame',
											actions: 'resetGame',
										},
									},
								},
								paused: {
									tags: ['paused'],
									on: {
										CONTINUE_GAME: {
											target: 'playing',
										},
									},
								},
								playing: {
									exit: ['resetRoundTime'],
									tags: ['playing'],
									always: {
										target: '#deciding',
										cond: 'hasRoundEnded',
									},
									invoke: {
										src: 'decrementRoundTimeService',
									},
									on: {
										PAUSE_GAME: {
											target: 'paused',
										},
										DECREMENT_ROUND_TIME: {
											actions: 'decrementRoundTime',
										},
										CORRECT_ANSWER: {
											actions: ['calculatePoints', 'pickRandomQuestion'],
										},
										WRONG_ASNWER: {
											actions: ['pickRandomQuestion'],
										},
										PASS: {
											actions: ['pickRandomQuestion'],
										},
									},
								},
							},
						},
					},
				},
				decidingGameResult: {
					id: 'deciding',
					always: [
						{
							target: 'ended',
							cond: 'gameEnded',
						},
						{
							target: '#A',
						},
					],
				},
				ended: {
					tags: 'ended',
				},
			},
		},
		{
			actions: {
				changeTeamName: gameModel.assign((ctx, e) => {
					if (e.type !== 'CHANGE_TEAM_NAME') {
						return {};
					}
					if (e.team === 'A') {
						return {
							teams: {
								...ctx.teams,
								teamA: {
									...ctx.teams.teamA,
									name: e.name,
								},
							},
						};
					} else {
						return {
							teams: {
								...ctx.teams,
								teamB: {
									...ctx.teams.teamB,
									name: e.name,
								},
							},
						};
					}
				}, 'CHANGE_TEAM_NAME'),
				resetRoundTime: gameModel.assign({
					secondsUntilEndOfRound: (ctx) => ctx.settings.roundTimeInSeconds,
				}),
				resetGame: gameModel.assign(() => gameModel.initialContext, 'RESET_GAME'),
				calculatePoints: gameModel.assign((ctx, e) => {
					if (ctx.currentTeam === 'A') {
						return {
							teams: {
								...ctx.teams,
								teamA: {
									...ctx.teams.teamA,
									points:
										ctx.teams.teamA.points + ctx.settings.correctAnwserMultiplier * 1,
								},
							},
						};
					} else {
						return {
							teams: {
								...ctx.teams,
								teamB: {
									...ctx.teams.teamB,
									points:
										ctx.teams.teamB.points + ctx.settings.correctAnwserMultiplier * 1,
								},
							},
						};
					}
				}),
				decrementRoundTime: gameModel.assign(
					{
						secondsUntilEndOfRound: (ctx, e) => ctx.secondsUntilEndOfRound - 1,
					},
					undefined,
				),
				pickRandomQuestion: gameModel.assign(
					{
						currentQuestion: (ctx) => {
							const randomIndex = Math.floor(Math.random() * ctx.questions.length);
							return ctx.questions[randomIndex];
						},
					},
					undefined,
				),
				currentTeamA: gameModel.assign({
					currentTeam: () => 'A',
				}),
				currentTeamB: gameModel.assign({
					currentTeam: () => 'B',
				}),
			},
			services: {
				decrementRoundTimeService: () => (send) => {
					const interval = setInterval(() => {
						send({ type: 'DECREMENT_ROUND_TIME' });
					}, 1000 * 1);

					return () => {
						clearInterval(interval);
					};
				},
			},
			guards: {
				gameEnded: (ctx) => {
					//evaluate winning condition in the end of every round
					return (
						ctx.teams.teamA.points >= ctx.settings.targetPoints ||
						ctx.teams.teamB.points >= ctx.settings.targetPoints
					);
				},
				hasRoundEnded: (ctx) => {
					return ctx.secondsUntilEndOfRound <= 0;
				},
			},
		},
	);

export const gameMachine = gameMachineFactory({ initial: 'waitingGame' });

export const gameActor = interpret(gameMachine, { devTools: true }).start();
