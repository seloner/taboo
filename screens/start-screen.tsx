import * as React from 'react';
import { useActor } from '@xstate/react';
import { Box, Icon, Input, Stack, Text } from 'native-base';
import { PrimaryButton } from '../buttons';
import { gameActor, gameModel } from '../game/gameMachine';
import { AppTitle } from '../title';
import { Ionicons } from '@expo/vector-icons';

export const StartScreen = () => {
	const [state, send] = useActor(gameActor);
	return (
		<>
			<Box justifyContent='center' flexDirection='row' display='flex' alignItems='center'>
				<AppTitle />
				<Icon
					onPress={() => {
						send({ type: 'SHOW_SETTINGS' });
					}}
					marginLeft={5}
					color='white'
					height={30}
					width={30}
					as={<Ionicons name='settings-outline' />}
				/>
			</Box>
			<Box>
				<Stack space={4} mb={8}>
					<Box>
						<Text fontWeight='semibold' mb='1'>
							Ομάδα A
						</Text>
						<Input
							value={state.context.teams.teamA.name}
							_focus={{
								borderColor: 'purple.400',
							}}
							bg='coolGray.100'
							onChangeText={(text) =>
								send(
									gameModel.events.CHANGE_TEAM_NAME({
										team: 'A',
										name: text,
									}),
								)
							}
							variant='filled'
							placeholder='Όνομα όμαδας A'
							_light={{
								placeholderTextColor: 'coolGray.500',
							}}
							_dark={{
								placeholderTextColor: 'coolGray.500',
							}}
						/>
					</Box>
					<Box>
						<Text mb='1' fontWeight='semibold'>
							Ομάδα Β
						</Text>
						<Input
							value={state.context.teams.teamB.name}
							onChangeText={(text) =>
								send(
									gameModel.events.CHANGE_TEAM_NAME({
										team: 'B',
										name: text,
									}),
								)
							}
							_focus={{
								borderColor: 'purple.400',
							}}
							bg='coolGray.100'
							variant='filled'
							placeholder='Όνομα όμαδας Β'
							_light={{
								placeholderTextColor: 'coolGray.500',
							}}
							_dark={{
								placeholderTextColor: 'coolGray.500',
							}}
						/>
					</Box>
				</Stack>
				<PrimaryButton
					onPress={() => {
						send({ type: 'START_GAME' });
					}}
				>
					Εναρξη
				</PrimaryButton>
			</Box>
		</>
	);
};
