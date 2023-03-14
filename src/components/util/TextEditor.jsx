import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function TextEditor({ id = "editor", quillRef, value }) {
	return (
		<ReactQuill
			id={id}
			ref={quillRef}
			defaultValue={value}
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
	);
}
