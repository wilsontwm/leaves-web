import {types, flow} from 'mobx-state-tree';
import Request from '../utils/Request';
import http from '../utils/http';
import User from '../models/User';
import empty from 'is-empty';
import queryString from 'query-string';

const UserStore = types
  .model('User', {
    users: types.array(User),
  })
  .actions((self) => ({
    getUsers: flow(function* getUsers(req = {}) {
      const request = new Request(req);
      try {
        const {cursor, filter = '', filterVal = ''} = request.body;
        let url = '';
        const queries = {};

        if (!empty(cursor)) Object.assign(queries, {cursor: cursor});
        if (!empty(filter) && !empty(filterVal)) {
          Object.assign(queries, {[filter]: filterVal});
        }

        const stringified = queryString.stringify(queries);
        if (empty(stringified)) {
          url = '/api/users';
        } else {
          url = `/api/users?${stringified}`;
        }
        const response = yield http.GET(url);
        if (empty(cursor))
          self.users = response.items.map((each) => User.create(each));
        else
          self.users = self.users.concat(
            response.items.map((each) => User.create(each))
          );
        request.success(response.items, response.cursor);
      } catch (e) {
        request.error(e);
      } finally {
        request.finally();
      }
    }),

    createUser: flow(function* createUser(req = {}) {
      const request = new Request(req);
      try {
        const {body} = request;
        const response = yield http.POST(`/api/users/create`, body);
        const {item = {}} = response;
        self.users.unshift(User.create(item))
        request.success(item);
      } catch (e) {
        request.error(e);
      } finally {
        request.finally();
      }
    }),

    updateUser: flow(function* updateUser(req = {}) {
      const request = new Request(req);
      try {
        const {body} = request;
        const response = yield http.PATCH(`/api/users/${body.id}/update`, body);
        const {item = {}} = response;
        const index = self.users.findIndex((each) => each._id === body.id);
        self.users.splice(index, 1, User.create(item));
        request.success(item);
      } catch (e) {
        request.error(e);
      } finally {
        request.finally();
      }
    }),
    
  }));

export default UserStore;
