export default function About() {
	return (
		<section className='bg-white'>
			<div className='items-center w-full px-5 py-24 mx-auto md:px-12 lg:px-16 max-w-7xl'>
				<div className='max-w-xl p-10 mx-auto text-center'>
					<div>
						<p className='mt-8 text-5xl font-medium tracking-tighter text-black'>
							I am a short heading
						</p>
						<p className='max-w-xl mx-auto mt-4 text-lg tracking-tight text-gray-600'>
							If you could kick the person in the pants responsible for most of
							your trouble, you wouldn't sit for a month
						</p>
					</div>
					<div className='flex flex-col items-center justify-center gap-3 mt-10 lg:flex-row'>
						<a
							href='#'
							className='items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none lg:w-auto focus-visible:outline-black text-sm focus-visible:ring-black'>
							Get started
						</a>
						<a
							href='#'
							className='inline-flex items-center justify-center text-sm font-semibold text-black duration-200 hover:text-blue-500 focus:outline-none focus-visible:outline-gray-600'>
							Learn more
							<span aria-hidden='true'> → </span>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
