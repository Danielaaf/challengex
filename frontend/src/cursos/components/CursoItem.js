import React, { useEffect, useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Datatable from "../../shared/components/UIElements/Datatable";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import './CursoItem.css'

const columnas = [
    {
        name: 'Evaluación',
        selector: 'evaluacion',
        sortable: true
    },
    {
        name: 'Nota',
        selector: 'nota',
        sortable: true
    }
]

const CursoItem = props => {

    const auth = useContext(AuthContext)
    console.log(auth)
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedEvaluaciones, setLoadedEvaluaciones] = useState();

    const [showDetail, setShowDetail] = useState(false);

    const openDetailHandler = () => setShowDetail(true);
    const closeDetailHandler = () => setShowDetail(false);

    useEffect(() => {

        try{
            const fetchEvaluaciones = async () => {
                const responseData = await sendRequest(
                    `http://localhost:6868/api/evaluaciones/user/${auth.userId}`,
                    'GET',
                    null,
                    {
                        'Authorization': 'Bearer ' + auth.token
                    }
                );
                //setLoadedEvaluaciones(responseData.evaluaciones);

                console.log(responseData.evaluaciones);
                const evaluacionesAlumno = [];
                for(const evaluacion of responseData.evaluaciones){
                    if(props.evaluaciones.includes(evaluacion.id) && evaluacion.alumno == auth.userId){
                        evaluacionesAlumno.push({
                            'evaluacion': evaluacion.name,
                            'nota': evaluacion.nota
                        })
                    }
                }

                console.log(evaluacionesAlumno);
                setLoadedEvaluaciones(evaluacionesAlumno);

            }
            fetchEvaluaciones();
        }catch (err) {}


    }, [sendRequest, auth.userId]);


    return (
        <React.Fragment>
            {!isLoading && loadedEvaluaciones && 
            <Modal 
                show={showDetail} 
                onCancel={closeDetailHandler} 
                header={props.name}
                contentClass="curso-item__modal-content"
                footerClass="curso-item__modal-actions"
                footer={<Button onClick={closeDetailHandler}>CERRAR</Button>}
            >
                <div className="details-container">
                    <Datatable columnas={columnas} data={loadedEvaluaciones} />
                </div>
            </Modal>}

            <li className="curso-item">
                <Card className="curso-item__content">
                    <div className="curso-item__info">
                        <h2>{props.title}</h2>
                        <p>{props.description}</p>
                    </div>
                    <div className="curso-item__actions">
                        {auth.isLoggedIn && auth.tipo=='alumno' &&
                            <Button inverse onClick={openDetailHandler}>VER MIS NOTAS</Button>}
                        {auth.isLoggedIn && auth.tipo=='profesor' &&
                            <Button to={`/cursos/alumnos/${props.id}`}>AÑADIR ALUMNOS</Button>}
                        {auth.isLoggedIn && auth.tipo=='profesor' &&
                            <Button to={`/cursos/${props.id}`}>AÑADIR EVALUACIÓN</Button>}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
};

export default CursoItem;