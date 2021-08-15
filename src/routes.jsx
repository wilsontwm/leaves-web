import { Provider } from 'mobx-react';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import rootStore from './stores/Root';
import Login from './views/Login';
import Portal from './views/master/Portal';
import Calendar from './views/master/Calendar';
import Leave from './views/leave/index';
import Approval from './views/approval/index';
import User from './views/user/index';

export default (
  <Provider rootStore={rootStore}>
    <BrowserRouter>
      <App>
        <Switch>
          <Route exact path="/" component={Login} />
          <Portal>
            {/* <Route exact path="/calendar" component={Calendar} /> */}
            <Route exact path="/leaves" component={Leave} />
            <Route exact path="/approvals" component={Approval} />
            <Route exact path="/users" component={User} />
          </Portal>
        </Switch>
      </App>
    </BrowserRouter>
  </Provider>
);
