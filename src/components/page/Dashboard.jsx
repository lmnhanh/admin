import { Button } from 'flowbite-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../page/product/filepond.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FilePond, registerPlugin } from 'react-filepond';
import SelectableInput from '../util/SelectableInput';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function Dashboard(props) {
	//const [loading, setLoading] = useState(false);
	const [images, setImages] = useState([]);
	const [categories, setCategories] = useState(null);
	const navigate = useNavigate();

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
		} catch (errors) {
			navigate('/login', { replace: true });
		}
	};

	useEffect(() => {
		axios.get('/api/categories').then((response) => {
			console.log(response.data)
			setCategories(
				response.data.categories.map((item) => ({
					value: item.id,
					label: item.name,
				}))
			);
		});
		document.title = 'Trang chủ';
	}, []);

	return (
		<div>
			{categories !== null && <SelectableInput isSearchable={true} options={categories} />}
			<Button
				onClick={discover}
				gradientDuoTone={'cyanToBlue'}
				size={'xs'}
				className={'w-fit'}>
				Click đi
			</Button>
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
							`data:text/plain;base64,${response.data}`,
							'1146811_5370495.jpg',
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
			{/* <div className='grid grid-cols-3 place-content-center'>
				{images &&
					images.map((image, index) => (
							<img className='w-96 max-h-min'
								key={index}
								src={`data:image/gif;base64,${image.content}`}></img>
					))}
			</div> */}
		</div>
	);
}
