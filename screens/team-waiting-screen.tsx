import * as React from 'react';
import { useActor } from '@xstate/react';
import { gameActor, gameModel } from '../game/gameMachine';
import {
	Box,
	Heading,
	PresenceTransition,
	Icon,
	Stack,
	Text,
	Progress,
} from 'native-base';
import { PrimaryButton } from '../buttons';
import { AppTitle } from '../title';
import { FontAwesome } from '@expo/vector-icons';
import { opacity } from 'styled-system';

export const TeamWaiting = () => {
	const [{ context }, send] = useActor(gameActor);
	const team = context.currentTeam === 'A' ? context.teams.teamA : context.teams.teamB;
	return (
		<>
			<AppTitle
				handleBack={() => {
					send(gameModel.events.RESET_GAME());
				}}
			/>
			<Stack mb={10}>
				<Progress
					colorScheme='pink'
					size='lg'
					value={team.points}
					min={0}
					max={context.settings.targetPoints}
				/>
				<Text color='gray.500' fontWeight='semibold' ml='auto' mt='2' textAlign='left'>
					{`${team.points} / ${context.settings.targetPoints}`}
				</Text>
			</Stack>
			<Stack alignItems='center' space={16}>
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
				<PrimaryButton
					onPress={() => {
						send(gameModel.events.START_ROUND());
					}}
				>
					εναρξη
				</PrimaryButton>
			</Stack>
		</>
	);
};

export const ScoreCard = ({
	name,
	points,
	active,
}: {
	name: string;
	points: number;
	active?: boolean;
}) => {
	const [shouldAnimate, setShouldAnimate] = React.useState(active || false);

	return (
		<Stack
			shadow={3}
			position='relative'
			w={180}
			alignItems='center'
			bg='white'
			rounded='xl'
			p={10}
			space={4}
		>
			<PresenceTransition
				visible={shouldAnimate}
				onTransitionComplete={(s) => {
					if (s === 'entered') {
						setShouldAnimate(false);
					} else {
						setShouldAnimate(true);
					}
				}}
				initial={{ translateY: 0 }}
				exit={{ translateY: 0, transition: { duration: 500 } }}
				animate={{
					translateY: 10,
					transition: {
						duration: 500,
					},
				}}
			>
				{active && (
					<Icon
						position='absolute'
						top={-100}
						left={-4}
						color='gray.600'
						size='30px'
						as={FontAwesome}
						name='arrow-down'
					/>
				)}
			</PresenceTransition>

			<Heading fontSize='2xl'>{name}</Heading>
			<Heading fontSize='6xl'> {points}</Heading>
		</Stack>
	);
};
