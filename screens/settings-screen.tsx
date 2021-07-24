import * as React from 'react';
import { useActor } from '@xstate/react';
import { defaultSettings, gameActor, gameModel } from '../game/gameMachine';
import {
	Box,
	Heading,
	PresenceTransition,
	Icon,
	Stack,
	Text,
	Progress,
	Input,
} from 'native-base';
import { PrimaryButton } from '../buttons';
import { AppTitle } from '../title';

export const SettingsScreen = () => {
	const [{ context }, send] = useActor(gameActor);
	return (
		<>
			<AppTitle title='Ρυθμισεις' />

			<Stack alignItems='center' w='100%' space={5}>
				<Box width='100%'>
					<Text mb='1' fontWeight='semibold'>
						Χρόνος γύρου ( secs )
					</Text>
					<Input
						w='100%'
						value={String(context.settings.roundTimeInSeconds)}
						onChangeText={(text) =>
							send(
								gameModel.events.SETTINGS_CHANGE({
									...context.settings,
									roundTimeInSeconds: isNaN(Number(text))
										? defaultSettings.roundTimeInSeconds
										: Number(text),
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
				<Box width='100%'>
					<Text mb='1' fontWeight='semibold'>
						Πόντοι νίκης
					</Text>
					<Input
						w='100%'
						value={String(context.settings.targetPoints)}
						onChangeText={(text) =>
							send(
								gameModel.events.SETTINGS_CHANGE({
									...context.settings,
									targetPoints: isNaN(Number(text))
										? defaultSettings.targetPoints
										: Number(text),
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
				<Box w='100%'>
					<Text mb='1' fontWeight='semibold'>
						Πολλ/στής σωστής ερώτησης
					</Text>
					<Input
						width='full'
						value={String(context.settings.correctAnwserMultiplier)}
						onChangeText={(text) =>
							send(
								gameModel.events.SETTINGS_CHANGE({
									...context.settings,
									correctAnwserMultiplier: isNaN(Number(text))
										? defaultSettings.correctAnwserMultiplier
										: Number(text),
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
				<PrimaryButton
					width='100%'
					marginTop={5}
					onPress={() => {
						send({ type: 'OK' });
					}}
				>
					Αποθηκευση
				</PrimaryButton>
			</Stack>
		</>
	);
};
