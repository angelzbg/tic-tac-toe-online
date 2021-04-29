import './styles/style.css'
import {NavLink} from "react-router-dom";

const Navigation = () => {
    return (
        <div className="navigation">
            <NavLink to="/games">Games</NavLink>
            <NavLink to="/">Rankings</NavLink>
            <NavLink to="/games">Games</NavLink>
        </div>
    )
}

export default Navigation