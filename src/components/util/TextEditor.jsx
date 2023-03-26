import React, { Fragment, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function TextEditor({ id = 'editor', quillRef, value }) {
	const [count, setCount] = useState(0);

	return (
		<Fragment>
			<ReactQuill
				id={id}
				ref={quillRef}
				defaultValue={value}
				onChange={(value, delta, source, editor) => {
					setCount(editor.getLength());
				}}
				theme='snow'
				modules={{
					toolbar: [
						['bold', 'italic', 'underline', 'strike'],
						[
							{ list: 'ordered' },
							{ list: 'bullet' },
							{ indent: '-1' },
							{ indent: '+1' },
						],
						[{ header: [1, 2, 3, 4, 5, 6, false] }],
						['link'],
						['clean'],
					],
				}}
				formats={[
					'header',
					'bold',
					'italic',
					'underline',
					'strike',
					'blockquote',
					'list',
					'bullet',
					'indent',
					'link',
					'image',
				]}
			/>
			<div className='font-light text-sm text-end'>{count}/1000</div>
		</Fragment>
	);
}
