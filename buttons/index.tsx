import * as React from 'react';
import { Button, IButtonProps } from 'native-base';

export const PrimaryButton = (props: IButtonProps) => (
	<Button
		shadow='4'
		variant='solid'
		_text={{
			textTransform: 'uppercase',
			color: 'white',
			fontSize: 'lg',
			fontWeight: 'bold',
		}}
		colorScheme='pink'
		size='lg'
		{...props}
	>
		{props.children}
	</Button>
);
