import {FC} from "react";
import "./Header.css";

const Header: FC = () => {
    return(
        <nav className="header">
            <a href="#">
                <img src="../../../public/icon.svg"/>
            </a>
        </nav>
    )
}

export default Header;