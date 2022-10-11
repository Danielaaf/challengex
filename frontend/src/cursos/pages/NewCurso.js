import React, {useContext} from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hooks";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import './NewCurso.css';


const NewCurso =  () => {

    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
                value: '',
                isValid: false
        }
    }, false);

    const history = useHistory();

    const cursoSubmitHandler = async event => {
        event.preventDefault();
        console.log(formState.inputs);

        try{

            await sendRequest(
                'http://localhost:6868/api/cursos', 
                'POST',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    profesor: auth.userId
                }),
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.token
                }
            );

            //Redirect
            history.push('/');

        } catch (err){
            
        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="curso-form" onSubmit={cursoSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input 
                    id='title'
                    element='input' 
                    type='text' 
                    label='Nombre' 
                    errorText="Ingresa un nombre válido."
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                />
                <Input
                    id='description'
                    element='textarea'  
                    label='Descripción' 
                    errorText="Ingresa una descripción válida (al menos 5 caracteres)."
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    CREAR CURSO
                </Button>
            </form>
        </React.Fragment>
    );
};

export default NewCurso;