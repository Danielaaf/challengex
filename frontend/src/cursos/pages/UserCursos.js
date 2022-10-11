import React, {useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";

import CursosList from "../components/CursosList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";


const UserCursos = () => {
    const auth = useContext(AuthContext)
    const [loadedCursos, setLoadedCursos] = useState();
    const [loadedEval, setloadedEval] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const userId = useParams().userId;

    useEffect(() => {
        const fetchCursos = async () => {
            try{
                const responseData = await sendRequest(
                    `http://localhost:6868/api/cursos/user/${userId}`,
                    'GET',
                    null,
                    {
                        'Authorization': 'Bearer ' + auth.token
                    }
                );
                setLoadedCursos(responseData.cursos);

                const cursosId = [];
                for (const curso of responseData.cursos){
                    cursosId.push(curso.id);
                }
                console.log(cursosId);

                if(auth.tipo == 'alumno'){
                    const responseData2 = await sendRequest(
                        `http://localhost:6868/api/evaluaciones/user/${userId}`,
                        'GET',
                        null,
                        {
                            'Authorization': 'Bearer ' + auth.token
                        }
                    );
                    
                    if('evaluaciones' in responseData2){
                        console.log(responseData2.evaluaciones);
                        //Filtrar a las evaluaciones de los cursos en la lista de cursos

                        setloadedEval(responseData2.evaluaciones);
                    }else{
                        setloadedEval([]);
                    }
                }

            }catch(err){

            }
        
        };

        fetchCursos();

    }, [sendRequest, userId]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && 
            (<div className="center">
                <LoadingSpinner />
            </div>)
            }
            {!isLoading && loadedCursos &&<CursosList items={loadedCursos} />}
        </React.Fragment>
    );
};

export default UserCursos;
export const str = [];