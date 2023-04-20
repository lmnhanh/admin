import { Spinner } from 'flowbite-react';

export default function Loader({size='md', className='', text=''}) {
	return (
		<div className='place-content-center'>
			<div className='text-center font-semibold'>
				<Spinner color={'info'} className={`mb-1 ${className}`} size={size} /> {text}
			</div>
		</div>
	);
}
