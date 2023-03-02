import { Spinner } from 'flowbite-react';

export default function Loader({size='md', className='', text=''}) {
	return (
		<div className='grid h-1/2 grid-cols-1 place-content-center'>
			<div className='text-center font-semibold'>
				<Spinner color={'info'} className={className} size={size} /> {text}
			</div>
		</div>
	);
}
