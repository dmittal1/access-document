import react from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink } from 'react-router-dom';
import { register } from '../serviceWorker';
import Home from '../Pages/Home';
import document from '../Pages/Documents';
import profile from '../Pages/Profile';
import login from '../Pages/Login';
import register from '../Pages/Register';

const AppRouter = () => (
    <BrowserRouter>
        <div>
            <Switch>
                <Route path="/" component={Home} exact={true} />
                <Route path="/document" component={document} />
                <Route path="/profile" component={profile} />
                <Route path="/login" component={login} />
                <Route path="/register" component={register} />
            </Switch>
        </div>
    </BrowserRouter>
);

export default AppRouter;