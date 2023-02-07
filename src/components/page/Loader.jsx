import { Spinner } from 'flowbite-react';

export default function Loader(props) {
	return (
		<div className='grid h-full grid-cols-1 place-content-center'>
			<div className='text-center'>
				<Spinner color={'info'} size={'lg'}/> {props?.text}
			</div>
		</div>
	);
}
