import { Heading, Icon, IconButton, Stack } from 'native-base';
import * as React from 'react';
import { AntDesign } from '@expo/vector-icons';

export const AppTitle = ({
	handleBack,
	title,
}: {
	title?: string;
	handleBack?: () => void;
}) => {
	return (
		<Stack justifyContent='center' alignItems='center' space={2} direction='row'>
			{handleBack && (
				<IconButton
					onPress={handleBack}
					icon={<Icon color='white' as={AntDesign} name='back' />}
				/>
			)}
			<Heading
				textAlign='center'
				size='2xl'
				letterSpacing={2}
				fontWeight='bold'
				color='white'
				textTransform='uppercase'
			>
				{title ?? 'Taboo'}
			</Heading>
		</Stack>
	);
};
