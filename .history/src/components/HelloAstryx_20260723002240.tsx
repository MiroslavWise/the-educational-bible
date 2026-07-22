import { Button } from '@astryxdesign/core/Button';
import { VStack } from '@astryxdesign/core/Layout';
import { Theme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral';

export default function HelloAstryx() {
	return (
		<Theme theme={neutralTheme}>
			<VStack gap={2}>
				<Button
					label="Hello Astryx"
					variant="primary"
					onClick={() => alert('Hi!')}
				/>
			</VStack>
		</Theme>
	);
}
