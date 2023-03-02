import { Button } from 'flowbite-react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import '../page/product/filepond.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FilePond, registerPlugin } from 'react-filepond';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../libs/store/slices';
import StepWizard from 'react-step-wizard';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function Dashboard(props) {
	const [images, setImages] = useState([]);
	const dispatch = useDispatch();
	const discover = async () => {
		try {
			const response = await axios.get('https://localhost:7028/api/images');
			if (response.status === 200) {
				setImages(
					response.data.map((item) => ({
						source: item.url,
						options: {
							type: 'local',
						},
					}))
				);
			}
		} catch (error) {
			error.response.status === 401 && dispatch(setAuthorized(false));
		}
	};

	useEffect(() => {
		document.title = 'Trang chủ';
		// try {
		// 	axios.get('/api/categories').then((response) => {
		// 		setCategories(
		// 			response.data.categories.map((item) => ({
		// 				value: item.id,
		// 				label: item.name,
		// 			}))
		// 		);
		// 	});
		// } catch (error) {
		// 	error.response.status === 401 && dispatch(setAuthorized(false));
		// }
	}, []);

	return (
		<div>
			<div className='my-3'>
				
			</div>
			<div className='flex gap-2'>
				<Button
					size={'xs'}
					onClick={() => {
						dispatch(setAuthorized(false));
					}}>
					Xóa authorized
				</Button>
				<Button
					onClick={discover}
					gradientDuoTone={'cyanToBlue'}
					size={'xs'}
					className={'w-fit'}>
					Click đi
				</Button>
			</div>
			<FilePond
				files={images}
				server={{
					fetch: null,
					revert: null,
					remove: async (source, load, error) => {
						const response = await axios.delete(`/api/images/${source}`);
						const { status } = response;
						status === 204 ? load() : error('Lỗi!');
						//load();
					},
					load: async (source, load, error, progress, abort, headers) => {
						const response = await axios.get(`/api/images/${source}`);

						async function urltoFile(url, filename, mimeType) {
							const res = await fetch(url);
							const buf = await res.arrayBuffer();
							return new File([buf], filename, { type: mimeType });
						}

						urltoFile(
							`data:text/plain;base64,${response.data.data}`,
							response.data.name,
							'image/jpg'
						).then(function (file) {
							load(file);
						});
						error('oh my goodness');
						//headers(headersString);
						//progress(true, 0, 1024);
						return {
							abort: () => {
								abort();
							},
						};
					},
				}}
				allowMultiple={true}
				allowRevert={false}
				allowDrop={true}
				name='images'
				labelIdle='Kéo hoặc <span class="filepond--label-action">Chọn</span> hình cho sản phẩm'
			/>
		</div>
	);
}
