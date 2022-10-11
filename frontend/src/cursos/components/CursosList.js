import React, { useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import CursoItem from "./CursoItem";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import './CursosList.css'

const CursosList = props => {

    const auth = useContext(AuthContext)

    if (props.items.length === 0){
        return (
        <div className="curso-list center">
            {auth.tipo == 'profesor' && 
                <Card>
                    <h2>No se ha encontrado ningún curso. ¿Deseas crear uno?</h2>
                    <Button to="/cursos/new">Crear Curso</Button>
                </Card>
            }
            {auth.tipo == 'alumno' && 
                <Card>
                    <h2>No has sido asignado a ningún curso.</h2>
                </Card>
            }
        </div>
        );
    }

    return <ul className="curso-list">
        {props.items.map(curso => (
            <CursoItem 
                key={curso.id} 
                id={curso.id} 
                name={curso.title} 
                description={curso.description}
                profesor={curso.profesor}
                alumnos={curso.alumnos}
                evaluaciones={curso.evaluaciones}
            />
        ))}
    </ul>
};

export default CursosList;