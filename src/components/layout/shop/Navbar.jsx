export default function NavBar() {
	return (
		<div class='w-full mx-auto bg-white border-b 2xl:max-w-7xl'>
			<div
				x-data='{ open: false }'
				class='relative flex flex-col w-full p-5 mx-auto bg-white md:items-center md:justify-between md:flex-row md:px-6 lg:px-8'>
				<div class='flex flex-row items-center justify-between lg:justify-start'>
					<a
						class='text-lg tracking-tight text-black uppercase focus:outline-none focus:ring lg:text-2xl'
						href='/'>
						<span class='lg:text-lg uppecase focus:ring-0'>windstatic</span>
					</a>
					<button class='inline-flex items-center justify-center p-2 text-gray-400 hover:text-black focus:outline-none focus:text-black md:hidden'>
						{/* <svg class="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path :class="{'hidden': open, 'inline-flex': !open }" class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            <path :class="{'hidden': !open, 'inline-flex': open }" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg> */}
					</button>
				</div>
				<nav class='flex-col items-center flex-grow hidden md:pb-0 md:flex md:justify-end md:flex-row'>
					<a
						class='px-2 py-2 text-sm text-gray-500 lg:px-6 md:px-3 hover:text-blue-600'
						href='#'>
						About
					</a>
					<a
						class='px-2 py-2 text-sm text-gray-500 lg:px-6 md:px-3 hover:text-blue-600'
						href='#'>
						Contact
					</a>
					<div class='hidden mx-10 md:block lg:ml-auto'>
						<div class='relative'>
							<span class='absolute inset-y-0 left-0 flex items-center pl-3'>
								<svg
									class='w-5 h-5 text-gray-400'
									viewBox='0 0 24 24'
									fill='none'>
									<path
										d='M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z'
										stroke='currentColor'
										stroke-width='2'
										stroke-linecap='round'
										stroke-linejoin='round'></path>
								</svg>
							</span>

							<input
								type='text'
								class='w-full py-2 pl-10 pr-4 text-black bg-white border border-gray-200 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-500 sm:text-sm rounded-xl placeholder:text-gray-400 focus:border-blue-500'
								placeholder='Search'
							/>
						</div>
					</div>

					<div class='inline-flex items-center gap-2 list-none'>
						<button class='block px-4 py-2 mt-2 text-sm text-gray-500 md:mt-0 hover:text-blue-600 focus:outline-none focus:shadow-outline'>
							Sign in
						</button>
						<button class='inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-black rounded-full group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-gray-700 active:bg-gray-800 active:text-white focus-visible:outline-black'>
							Sign up
						</button>
					</div>
				</nav>
			</div>
		</div>
	);
}
