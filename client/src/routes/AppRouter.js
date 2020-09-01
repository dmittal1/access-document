import react from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink } from 'react-router-dom';


const AppRouter = () => (
    <BrowserRouter>
        <div>
            <Switch>
                <Route path="/" component={} exact={true} />
                <Route path="/create" component={} />

            </Switch>
        </div>
    </BrowserRouter>
);

export default AppRouter;