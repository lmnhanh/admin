import { Button, Modal, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Form } from 'react-router-dom';

export default function EditableModal(props) {
	const {setState, title } = props;

	const handleClose = () => {
		setState({
			data: {},
			showing: false,
		});
	};

	const formik = useFormik({
		initialValues: {
			name: props.state.data.name,
		}
	});

	return (
		<Modal
			show={props.state.showing}
			dismissible={true}
			onClose={() => handleClose()}>
			<Modal.Header>{title}</Modal.Header>
			<Modal.Body>
				<Form>
				<TextInput
					type={'text'}
					name='name'
					value={formik.values.name}
					onChange={formik.handleChange}
				/>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button>I accept</Button>
				<Button color='gray'>Decline</Button>
			</Modal.Footer>
		</Modal>
	);
}
