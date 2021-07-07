import { Ionicons } from '@expo/vector-icons';
import { useActor } from '@xstate/react';
import { Box, Icon, IconButton, Stack } from 'native-base';
import * as React from 'react';
import { gameActor, gameModel } from '../game/gameMachine';
import { AppTitle } from '../title';
import { ScoreCard } from './team-waiting-screen';

export const PauseScreen = () => {
	const [{ context }, send] = useActor(gameActor);
	return (
		<Stack alignItems='center' flex={1} space={100}>
			<AppTitle title='Σε παυση' />
			<IconButton
				onPress={() => {
					send(gameModel.events.CONTINUE_GAME());
				}}
				bg='white'
				width={24}
				height={24}
				rounded='full'
				icon={<Icon as={Ionicons} name='play' />}
			/>
			<Stack space={5} direction='row'>
				<ScoreCard
					active={context.currentTeam === 'A'}
					name={context.teams.teamA.name}
					points={context.teams.teamA.points}
				/>
				<ScoreCard
					active={context.currentTeam === 'B'}
					name={context.teams.teamB.name}
					points={context.teams.teamB.points}
				/>
			</Stack>
		</Stack>
	);
};
