import React from "react";
import { Link } from "react-router-dom"; 

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import './UserItem.css'

const UserItem = props => {
    return (
        <li className="user-item">
            <Card className="user-item__content">
                <Link to={`/`}>
                    <div className="user-item__info">
                        <h2>{props.name}</h2>
                        <h3>{props.tipo}</h3>
                        <p>{props.cursoCount} {props.cursoCount === 1 ? 'Curso' : 'Cursos'}</p>
                    </div>
                </Link>
            </Card>
        </li>
    );
};

export default UserItem;