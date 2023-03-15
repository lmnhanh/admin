import { useState} from 'react';
import Select from 'react-tailwindcss-select';

export default function SelectableInput({
	options,
	color,
	onChange = null,
	isSearchable,
	isClearable,
	isDisabled,
	isMultiple,
	defaultValue
}) {
	const [selected, setSelected] = useState(defaultValue);

	const handleChange = (selected) => {
		onChange && onChange(selected);
		setSelected(selected);
	};
	
	return (
		<Select
			value={selected?? defaultValue ?? options[0]}
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
