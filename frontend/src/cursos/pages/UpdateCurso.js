import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from 'react-router-dom'

import { str } from './UserCursos.js'
import Input from "../../shared/components/FormElements/Input.js";
import Button from "../../shared/components/FormElements/Button.js";
import Card from "../../shared/components/UIElements/Card.js";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators.js";
import { useForm } from "../../shared/hooks/form-hooks.js";
import { useHttpClient } from "../../shared/hooks/http-hook.js";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner.js";
import ErrorModal from "../../shared/components/UIElements/ErrorModal.js";
import Select from "../../shared/components/FormElements/Select.js";
import { AuthContext } from "../../shared/context/auth-context.js";
import './NewCurso.css';

const UpdateCurso = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedCurso, setLoadedCurso] = useState();
    const [loadedUsers, setloadedUsers] = useState();
    const [loadedAlumnos, setloadedAlumnos] = useState();
    const cursoId = useParams().cursoId;
    const history = useHistory();

    const [formState, inputHandler, setFormData] = useForm(
            {
            alumno: {
                value: '',
                isValid: false
            },
            evaluacion: {
                    value: '',
                    isValid: false
            },
            nota: {
                    value: '',
                    isValid: false
            }
        }, true);
    
    const fetchAlumnos = async (users, alumnosID) => {
        const alumnos = [];
        for (const user of users){
            if(alumnosID.includes(user.id)){
                alumnos.push({
                    'name': user.name,
                    'id': user.id
                });
            }
        }
        console.log(alumnos);
        return alumnos;
    }

    useEffect(() => {

        try{
            const fetchCurso = async () => {
                const responseData = await sendRequest(
                    `http://localhost:6868/api/cursos/${cursoId}`,
                    'GET',
                    null,
                    {
                        'Authorization': 'Bearer ' + auth.token
                    }
                );
                setLoadedCurso(responseData.curso);
                setloadedUsers(responseData.curso.alumnos);

                //console.log(responseData.curso.alumnos);

                const responseData2 = await sendRequest(
                    `http://localhost:6868/api/users`,
                    'GET',
                    null,
                    {
                        'Authorization': 'Bearer ' + auth.token
                    }
                );

                //console.log(responseData2.users);
                
                const alumnos = await fetchAlumnos(responseData2.users, responseData.curso.alumnos);
                
                setloadedAlumnos(alumnos);

            }
            fetchCurso();
        }catch (err) {}


    }, [sendRequest, cursoId, setFormData]);
    

    const cursoUpdateSubmitHandler = async event => {
        event.preventDefault();
        console.log(formState.inputs);

        //const alumnosArray = [];
        //for (const alumno of formState.inputs.alumno.value){
        //    alumnosArray.push(alumno.id);
        //}
        console.log(formState.inputs.alumno.value[0].id)
        try{
            await sendRequest(
                `http://localhost:6868/api/evaluaciones`,
                'POST',
                JSON.stringify({
                    name: formState.inputs.evaluacion.value,
                    nota: formState.inputs.nota.value,
                    curso: cursoId,
                    alumno: formState.inputs.alumno.value[0].id
                }),
                {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + auth.token
                }
            );
            history.push('/'+ auth.userId + '/cursos');
        }catch (err){}
        
    };

    if(isLoading){
        return <div className="center"><LoadingSpinner /></div>;
    }

    if(!loadedCurso && !error){
        return <div className="center"><Card><h2>No se encontró el curso.</h2></Card></div>;
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedCurso && loadedAlumnos && 
                <form className="curso-form" onSubmit={cursoUpdateSubmitHandler}>
                    <label>Alumno</label>
                    <Select
                        id="alumno"
                        validators={[VALIDATOR_REQUIRE()]}
                        onInput={inputHandler}
                        initialValid={true}
                        options={loadedAlumnos}
                        displayValue="name"
                    />
                    <Input 
                        id="evaluacion" 
                        element="input" 
                        type="text" 
                        label="Nombre de la Evaluacion" 
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Ingresa un nombre de evaluación válido."
                        onInput={inputHandler}
                        initialValue=""
                        initialValid={true}
                    />
                    <Input 
                        id="nota" 
                        element="input" 
                        type="text" 
                        label="Nota" 
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Ingresa una nota valida."
                        onInput={inputHandler}
                        initialValue=""
                        initialValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        GUARDAR
                    </Button>
                </form>
            }
            
        </React.Fragment>
        
    );
};

export default UpdateCurso;