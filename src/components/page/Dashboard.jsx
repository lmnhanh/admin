import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { useEffect, useState } from "react";

export default function Dashboard(props) {

	const [state, setState] = useState({
    data : [],
    loading : true
  })

  useEffect(()=>{
    fetchData();
  }, [])

  const fetchData = async () => {
    const response = await axios.get('https://localhost:7028/api/categories')
    const data = response.data;
    setState({
      data: data,
      loading: false
    })
  }

	return (state.loading)? <div>Loading</div>:(
		<div>
			{state.data.map((item, index)=>(
				<div key={index}>{item.name}</div>
			))}
			This is main dashboard
			<div>
				<Link to={"/login"}>
					<Button color="failure"
						label={"2"}
						size="xs"
						className="px-1 hover:bg-sky-500">
						<FontAwesomeIcon icon={faRightToBracket} /> Link
					</Button>
				</Link>
			</div>
		</div>
	);
}
