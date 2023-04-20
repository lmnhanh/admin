import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

export default function NotFound404() {
	const navigate = useNavigate();

	return (
		<section>
			<div class='relative justify-center h-screen max-h-full overflow-hidden lg:px-0 md:px-12'>
				<div class='justify-center w-full text-center lg:p-10 max-auto'>
					<div class='justify-center w-full mx-auto'>
						<p class='text-5xl tracking-tight text-red-600  lg:text-9xl'>404</p>
						<p class='max-w-xl mx-auto mt-4 text-lg tracking-tight text-gray-400'>
							Không tìm thấy trang yêu cầu!
						</p>
					</div>
					<div class='flex justify-center gap-3 mt-10'>
						<div onClick={()=>{navigate(-1)}} class='items-center justify-center cursor-pointer w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none lg:w-auto focus-visible:outline-black text-sm focus-visible:ring-black'>
							<span aria-hidden='true' className='mr-2'>
								<FontAwesomeIcon icon={faArrowLeft} />
							</span>
							Trở về
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
