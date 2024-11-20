import {FC} from "react";
import {Link} from "react-router-dom";
import "./Header.css";

const Header: FC = () => {
    return(
        <nav className="header">
            <Link to="/">
                <img src="/Navy_sea/icon.svg"/>
            </Link>
        </nav>
    )
}

export default Header;