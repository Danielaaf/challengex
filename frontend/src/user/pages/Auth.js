import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hooks";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import './Auth.css'

import http from "../../http-common";

const Auth = () => {
    const auth = useContext(AuthContext)

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler] = useForm({
        username: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        },
    }, false);

    const authSubmitHandler = async event => {
        event.preventDefault();
        console.log(formState.inputs)

        try{

            const responseData = await sendRequest(
                'http://localhost:6868/api/users/login', 
                'POST',
                JSON.stringify({
                    username: formState.inputs.username.value,
                    password: formState.inputs.password.value
                }),
                {
                    'Content-Type': 'application/json'
                }
            );

            auth.login(responseData.userId, responseData.tipo, responseData.token);

        } catch (err){
            
        }

    };


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Iniciar Sesión.</h2>
                <hr/>
                <form onSubmit={authSubmitHandler}>
                    <Input 
                        id="username"
                        element="input"
                        type="text"
                        label="Nombre de usuario"
                        errorText="Ingresa un nombre válido."
                        validators={[VALIDATOR_REQUIRE()]}
                        onInput={inputHandler}
                    />
                    <Input 
                        id="password"
                        element="input"
                        type="password"
                        label="Contraseña"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Ingresa una contraseña válida (al menos 5 caracteres)."
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        INICIAR SESIÓN
                    </Button>
                </form>
            </Card>
        </React.Fragment>
    );
};

export default Auth;