import { Button, Modal, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import { useState } from 'react';

export default function EditableInput(props) {
	const state = { editing: props.editing };
	const formik = useFormik({
		initialValues: {
			name: props.data?.name,
		},
	});

	return state.editing ? (
		<TextInput
			name='name'
			autoFocus
			color={'gray'}
			sizing={'sm'}
			onChange={formik.handleChange}
			value={formik.values.name}
		/>
	) : (
		formik.values.name
	);
}
