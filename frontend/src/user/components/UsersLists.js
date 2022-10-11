import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import './UsersList.css';

const UsersList = props => {
    if (props.items.length === 0){
        return (<div class="center">
            <Card>
                <h2>No se han encontrado usuarios.</h2>
            </Card>
        </div>
        );
    }

    return <ul className="users-list">
        {props.items.map(user => (
            <UserItem 
                key={user.id} 
                id={user.id}  
                name={user.name}
                tipo={user.tipo}
                cursoCount={user.cursos.length}
            />
        ))}
    </ul>
};

export default UsersList;