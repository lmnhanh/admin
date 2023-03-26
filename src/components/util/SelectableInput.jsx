import { useState} from 'react';
import Select from 'react-tailwindcss-select';

export default function SelectableInput({
	defaultValue,
	options,
	color,
	id = 'select',
	onChange = null,
	isSearchable,
	isClearable,
	isDisabled,
	isMultiple,
}) {
	const [selected, setSelected] = useState(defaultValue);

	const handleChange = (selected) => {
		onChange && onChange(selected);
		setSelected(selected);
	};

	return (
		<Select
			id={id}
			value={selected || defaultValue || options[0]}
			primaryColor={color??'blue'}
			isSearchable={isSearchable}
			isClearable={isClearable}
			isMultiple={isMultiple}
			isDisabled={isDisabled}
			onChange={handleChange}
			options={options}
		/>
	);
}
