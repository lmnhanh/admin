import { Badge } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FilterBadge(props) {
	const { label, icon = null, handleOnClose, color } = props;

	const handleClick = () => {
		handleOnClose && handleOnClose();
	};

	return (
		<Badge
			color={color ?? 'info'}
			size={'xs'}
			className={'cursor-pointer w-fit'}
			onClick={handleClick}>
			{icon && <FontAwesomeIcon icon={icon} className='mr-1' />}
			{label ?? 'label'}
		</Badge>
	);
}
