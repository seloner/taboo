import { LinearGradient } from 'expo-linear-gradient';
import { useActor, useMachine } from '@xstate/react';
import React, { useEffect } from 'react';
import { gameActor } from './game/gameMachine';
import { NativeBaseProvider, Box } from 'native-base';
import {
	StartScreen,
	TeamPlaying,
	TeamWaiting,
	SettingsScreen,
	EndScreen,
	PauseScreen,
} from './screens';

// import { inspect } from '@xstate/inspect';
// inspect({
// 	// options
// 	// url: 'https://statecharts.io/inspect', // (default)
// 	iframe: false, // open in new window
// });

export default function App() {
	const [state, send] = useActor(gameActor);
	useEffect(() => {
		return () => {
			if (process.env.NODE_ENV === 'production') gameActor.stop();
		};
	});
	return (
		<NativeBaseProvider
			config={{
				dependencies: {
					'linear-gradient': require('expo-linear-gradient').LinearGradient,
				},
			}}
		>
			<LinearGradient
				start={{ x: 0.1, y: 0.2 }}
				style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				colors={['#f472b6', '#d8b4fe', 'white']}
			>
				<Box
					_web={{
						maxWidth: 500,
					}}
					minHeight={500}
					px={12}
					w='100%'
					justifyContent='space-between'
				>
					{(() => {
						switch (true) {
							case state.matches('waitingGame'):
								return <StartScreen />;
							case state.matches('settings'):
								return <SettingsScreen />;
							case state.hasTag('paused'):
								return <PauseScreen />;
							case state.hasTag('playing'):
								return <TeamPlaying />;
							case state.hasTag('teamPlaying'):
								return <TeamWaiting />;
							case state.hasTag('ended'):
								return <EndScreen />;
							default:
								return null;
						}
					})()}
				</Box>
			</LinearGradient>
		</NativeBaseProvider>
	);
}
