import React , { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import Users from './user/pages/Users';
import NewCurso from './cursos/pages/NewCurso';
import UserCursos from './cursos/pages/UserCursos';
import UpdateCurso from './cursos/pages/UpdateCurso';
import NewAlumno from './user/pages/NewAlumno';
import Auth from './user/pages/Auth';
import UpdateCursoAlumnos from './cursos/pages/UpdateCursoAlumnos';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';

const App = () => {

  const [token, setToken] = useState();
  const [userId, setUserId] = useState(false);
  const [tipo, setTipo] = useState(false);

  const login = useCallback((uid, tipo, token) => {
    setToken(token);
    setUserId(uid);
    setTipo(tipo);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTipo(null);
  }, []);

  let routes;

  if (token && tipo && tipo=='profesor'){
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/cursos" exact>
          <UserCursos />
        </Route>
        <Route path="/cursos/new" exact>
          <NewCurso />
        </Route>
        <Route path="/alumnos/new" exact>
          <NewAlumno />
        </Route>
        <Route path="/cursos/alumnos/:cursoId" exact>
          <UpdateCursoAlumnos />
        </Route>
        <Route path="/cursos/:cursoId" exact>
          <UpdateCurso />
        </Route>
        <Redirect to="/"/>
      </Switch>
    );
  }else if(token && tipo && tipo=='alumno'){
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/cursos" exact>
          <UserCursos />
        </Route>
        <Redirect to="/"/>
      </Switch>
    );
  }else{
    routes = (
      <Switch>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth"/>
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{isLoggedIn: !!token, token: token, userId: userId, tipo: tipo, login: login, logout: logout}}>
      <Router>
        <MainNavigation />
        <main>
            {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
