import { useActor } from '@xstate/react';
import {
	Box,
	Heading,
	Icon,
	IconButton,
	IIconButtonProps,
	PresenceTransition,
	Stack,
	Text,
} from 'native-base';
import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { gameActor, gameModel } from '../game/gameMachine';
import { Ionicons } from '@expo/vector-icons';
import { AppTitle } from '../title';

export const TeamPlaying = () => {
	const [{ context }, send] = useActor(gameActor);
	const currentTeam =
		context.currentTeam === 'A' ? context.teams.teamA : context.teams.teamB;
	return (
		<Box>
			<AppTitle title={currentTeam.name} />
			<Heading color='white' textAlign='center'>
				{currentTeam.points}
			</Heading>
			<Stack
				my={10}
				direction='row'
				space={2}
				justifyContent='space-between'
				alignItems='center'
			>
				<IconButton
					onPress={() => {
						send(gameModel.events.PAUSE_GAME());
					}}
					rounded='full'
					mt={4}
					_pressed={{
						opacity: 0.5,
						bg: 'pink.100',
					}}
					icon={<Icon as={Ionicons} name='pause-outline' color='gray.600' size={16} />}
				/>
				<LinearGradient
					locations={[0.3, 0.8]}
					style={{
						height: 140,
						borderWidth: 1,
						borderColor: '#52525B',
						width: 140,
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: 140 / 2,
					}}
					colors={['#ecfeff', '#fce7f3']}
				>
					<PresenceTransition
						key={context.secondsUntilEndOfRound}
						visible={true}
						initial={{ opacity: 0.5 }}
						animate={{ transition: { duration: 300 } }}
						exit={{ translateY: 10, opacity: 0 }}
					>
						<Text color='gray.600' fontSize='xl' fontWeight='bold'>
							{context.secondsUntilEndOfRound}
						</Text>
					</PresenceTransition>
				</LinearGradient>
				<IconButton
					rounded='full'
					onPress={() => {
						send({ type: 'RESET_GAME' });
					}}
					mt={4}
					_pressed={{
						opacity: 0.5,
						bg: 'pink.100',
					}}
					icon={<Icon as={Ionicons} name='close-outline' color='gray.600' size={16} />}
				/>
			</Stack>
			<Box
				alignItems='center'
				_text={{ textAlign: 'center' }}
				py={10}
				rounded='xl'
				border='1px solid'
				bg='pink.50'
				shadow={5}
				// height={500}
			>
				<Box bg='warmGray.100' borderRadius='lg' p={4}>
					<Heading size='lg'>{context.currentQuestion.word}</Heading>
				</Box>
				<Stack alignItems='center' space={2} mt={4}>
					{context.currentQuestion.forbiddenWords.map((word) => (
						<Text key={word} fontSize='lg'>
							{word}
						</Text>
					))}
				</Stack>
			</Box>
			<Stack mt={10} direction='row' space={4} justifyContent='space-between'>
				<ControlIcon
					onPress={() => {
						send(gameModel.events.CORRECT_ANSWER());
					}}
					bg='green.100'
					icon={<Icon as={Ionicons} size={8} color='gray.500' name='checkmark' />}
				/>
				<ControlIcon
					onPress={() => {
						send(gameModel.events.WRONG_ASNWER());
					}}
					bg='rose.400'
					icon={<Icon as={Ionicons} size={8} color='white' name='close-outline' />}
				/>
				<ControlIcon
					onPress={() => {
						send(gameModel.events.PASS());
					}}
					bg='white'
					icon={
						<Icon
							as={Ionicons}
							size={8}
							color='gray.500'
							name='play-skip-forward'
							ml={0.5}
						/>
					}
				/>
			</Stack>
			{/* <Text>{context.currentQuestion.word}</Text> */}
		</Box>
	);
};

const ControlIcon = (props: IIconButtonProps) => {
	return (
		<IconButton
			_pressed={{
				bg: props.bg,
				opacity: 0.5,
			}}
			{...props}
			rounded='full'
			shadow={1}
		/>
	);
};
