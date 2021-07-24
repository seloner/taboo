import { Box, Heading, Image } from 'native-base';
import * as React from 'react';
import { AppTitle } from '../title';
//@ts-ignore
import WinnerImage from '../assets/winner.svg';
import { PrimaryButton } from '../buttons';
import { useActor } from '@xstate/react';
import { gameActor } from '../game/gameMachine';

export const EndScreen = () => {
	const [state, send] = useActor(gameActor);
	return (
		<Box>
			<AppTitle title='Νικητης' />
			<Image
				style={{ width: 500, height: 200, marginTop: 20 }}
				alt='Fenia'
				source={WinnerImage}
			/>
			<Heading
				marginTop={10}
				textAlign='center'
				size='2xl'
				letterSpacing={2}
				fontWeight='bold'
				color='white'
			>
				{state.context.winner.name}
			</Heading>
			<PrimaryButton
				marginTop={10}
				onPress={() => {
					send({ type: 'RESET_GAME' });
				}}
			>
				Νεο παχινδι
			</PrimaryButton>
		</Box>
	);
};
