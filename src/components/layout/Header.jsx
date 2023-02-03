import { useSelector } from "react-redux"

export default function Header(props) {
  const name = useSelector(state =>{
    return state.user.name
  })
  return(
    <div>
      Header
      <span className="font-large">Hello {name}</span>
    </div>
  )
}