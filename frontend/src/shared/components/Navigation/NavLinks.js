import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import './NavLinks.css';

const NavLinks = props => {

    const auth = useContext(AuthContext);

    return <ul className="nav-links">
        {auth.isLoggedIn && <li>
            <NavLink to="/" exact>USUARIOS</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
            <NavLink to={`/${auth.userId}/cursos`}>MIS CURSOS</NavLink>
        </li>}
        {auth.isLoggedIn && auth.tipo=="profesor" && <li>
            <NavLink to="/cursos/new">AÑADIR CURSO</NavLink>
        </li>}
        {auth.isLoggedIn && auth.tipo=="profesor" && <li>
            <NavLink to="/alumnos/new">AÑADIR ALUMNO</NavLink>
        </li>}
        {!auth.isLoggedIn && <li>
            <NavLink to="/auth">INICIAR SESIÓN</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
            <button onClick={auth.logout}>CERRAR SESIÓN</button>
        </li>}
    </ul>
};


export default NavLinks;