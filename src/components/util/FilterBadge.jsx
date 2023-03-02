import { Badge } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FilterBadge(props) {
	const { label, icon, handleOnClose, color } = props;

	const handleClick = () => {
		handleOnClose();
	};

	return (
		<Badge
			color={color}
			size={'xs'}
			className={'cursor-pointer w-fit'}
			onClick={handleClick}>
			<FontAwesomeIcon icon={icon} className='mr-1' />
			{label}
		</Badge>
	);
}
