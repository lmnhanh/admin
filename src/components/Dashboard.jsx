import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard(props) {
	return (
		<div>
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
