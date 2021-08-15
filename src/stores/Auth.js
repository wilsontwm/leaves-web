import {types, flow} from 'mobx-state-tree';
import Request from '../utils/Request';
import http from '../utils/http';
import User from '../models/User';

const AuthStore = types
  .model('AuthStore', {
    currentUser: types.maybeNull(User),
    users: types.array(User)
  })
  .actions((self) => ({
    login: flow(function* login(req = {}) {
      const request = new Request(req);
      try {
        const response = yield http.POST('/api/users/login', request.body);
        const { item } = response;
        console.log("LOGIN", item);
        sessionStorage.setItem('accessToken', item.token);
        sessionStorage.setItem('currentUser', JSON.stringify(item));
        self.currentUser = User.create(item);
        request.success();
      } catch (e) {
        request.error(e);
      } finally {
        request.finally();
      }
    }),
    setCurrentUser: flow(function* login(req = {}) {
      if(!self.currentUser && sessionStorage.getItem('currentUser')) {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        self.currentUser = User.create(user)
      } else if(!self.currentUser) {
        sessionStorage.clear();
        history.push('/');
      }
    }),
    
  }));

export default AuthStore;
