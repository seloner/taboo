import * as React from 'react';
import Svg, { Circle, Stop, Defs, LinearGradient } from 'react-native-svg';
import { Box } from 'native-base';
import { BlurView } from 'expo-blur';
import { style } from 'styled-system';

export const Background = () => {
	return (
		<Box flex={1} position='relative'>
			<BlurView tint='dark' intensity={100} style={{ flex: 1 }}>
				<Box
					position='absolute'
					inset={0}
					flex={1}
					bg='black'
					zIndex={1}
					style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
				/>
				<Svg
					style={{
						flex: 1,
						opacity: 0.5,
						zIndex: -1,
					}}
					viewBox='0 0 1440 1024'
					fill='none'
				>
					<Circle cx={-164} cy={-136} r={677} fill='#622aff' />
					<Circle cx={1658} cy={-104} r={677} fill='#BE4B9A' />
					<Circle cx={588} cy={579} r={677} fill='url(#paint0_linear)' />
					<Defs>
						<LinearGradient
							id='paint0_linear'
							x1={588}
							y1={-98}
							x2={588}
							y2={1256}
							gradientUnits='userSpaceOnUse'
						>
							<Stop stopColor='#6bf' />
							<Stop offset={1} stopColor='#2997ff' />
						</LinearGradient>
					</Defs>
					<Circle cx={1349} cy={1189} r={677} fill='#f56300' />
				</Svg>
				<Box
					zIndex={2}
					position='absolute'
					inset={50}
					bg='rgba(255,255,255,0.9)'
					rounded='xl'
				></Box>
			</BlurView>
		</Box>
	);
};
