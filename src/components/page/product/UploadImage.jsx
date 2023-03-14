import { Fragment, useState, useEffect } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import './filepond.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';

registerPlugin(
	FilePondPluginImageExifOrientation,
	FilePondPluginFileValidateSize,
	FilePondPluginImagePreview,
	FilePondPluginFileValidateType
);

export default function UpLoadImage({ productId }) {
	const token = useSelector((state) => state.auth.token);
	//const [images, setImages] = useState([]);

	const fetchImages = async () => {
		const response = await axios.get(`https://localhost:7028/api/images?productId=${productId}`);
		if (response.status === 200) {
			// setImages(
			// 	response.data.map((item) => ({
			// 		source: item,
			// 		options: {
			// 			type: 'local',
			// 		},
			// 	}))
			// );
		}
	};

	const formik = useFormik({
		initialValues: {
			images: [],
		}
	});

	useEffect(() => {
		productId && fetchImages();
	}, []);

	return (
		<Fragment>
			<FilePond
				files={formik.values.images}
				allowFileSizeValidation={true}
				maxFileSize='2MB'
				labelMaxFileSize='<Button 2MB'
				labelMaxFileSizeExceeded='Ảnh quá lớn'
				allowFileTypeValidation={true}
				allowReorder={true}
				acceptedFileTypes={['image/*']}
				labelFileTypeNotAllowed='Chỉ chọn ảnh!'
				server={{
					process: {
						url: 'https://localhost:7028/api/products/UploadImage',
						method: 'POST',
						headers: {
							Authorization: `Bearer ${token}`,
							productId: productId
						},
						withCredentials: false,
						onload: (response) => {
							console.log(response);
							formik.values.images.push({
								source: response,
								options: {
									type: 'local',
								}
							})
						},
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

					remove: async (source, load, error) => {
						const response = await axios.delete(`/api/images/${source}`);
						const { status } = response;
						if (status === 204) {
							let index = formik.values.images.findIndex(
								(image) => image.source === source
							);
							formik.values.images.splice(index, 1);
							load();
						} else error('Lỗi!');
						//load();
					},

					fetch: null,
					revert: null,
				}}
				allowMultiple={true}
				allowRevert={false}
				allowDrop={true}
				maxFiles={10}
				name='images'
				labelIdle='Kéo hoặc <span class="filepond--label-action">chọn</span> hình cho sản phẩm'
			/>
		</Fragment>
	);
}
