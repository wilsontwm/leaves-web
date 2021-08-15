import {types, flow} from 'mobx-state-tree';
import Request from '../utils/Request';
import http from '../utils/http';
import Leave from '../models/Leave';
import empty from 'is-empty';
import queryString from 'query-string';

const LeaveStore = types
  .model('User', {
    leaves: types.array(Leave),
    approvals: types.array(Leave)
  })
  .actions((self) => ({
    getLeaves: flow(function* getLeaves(req = {}) {
      const request = new Request(req);
      try {
        const {cursor} = request.body;
        let url = '';
        const queries = {};

        if (!empty(cursor)) Object.assign(queries, {cursor: cursor});
        
        const stringified = queryString.stringify(queries);
        if (empty(stringified)) {
          url = '/api/leaves';
        } else {
          url = `/api/leaves?${stringified}`;
        }

        const response = yield http.GET(url);
        if (empty(cursor))
          self.leaves = response.items.map((each) => Leave.create(each));
        else
          self.leaves = self.leaves.concat(
            response.items.map((each) => Leave.create(each))
          );
        request.success(response.items, response.cursor);
      } catch (e) {
        request.error(e);
      } finally {
        request.finally();
      }
    }),
    
    getApprovals: flow(function* getApprovals(req = {}) {
      const request = new Request(req);
      try {
        const {cursor} = request.body;
        let url = '';
        const queries = {};

        if (!empty(cursor)) Object.assign(queries, {cursor: cursor});
        
        const stringified = queryString.stringify(queries);
        if (empty(stringified)) {
          url = '/api/leaves/all';
        } else {
          url = `/api/leaves/all?${stringified}`;
        }
        const response = yield http.GET(url);
        if (empty(cursor))
          self.approvals = response.items.map((each) => Leave.create(each));
        else
          self.approvals = self.approvals.concat(
            response.items.map((each) => Leave.create(each))
          );
        request.success(response.items, response.cursor);
      } catch (e) {
        request.error(e);
      } finally {
        request.finally();
      }
    }),
    
    createLeave: flow(function* createLeave(req = {}) {
      const request = new Request(req);
      try {
        const {body} = request;
        console.log("request", request)
        const response = yield http.POST(`/api/leaves/create`, body);
        const {item = {}} = response;
        self.leaves.unshift(Leave.create(item))
        request.success(item);
      } catch (e) {
        request.error(e);
      } finally {
        request.finally();
      }
    }),

    updateLeave: flow(function* updateLeave(req = {}) {
      const request = new Request(req);
      try {
        const {body} = request;
        const response = yield http.PATCH(`/api/leaves/${body.id}/update`, body);
        console.log(response);
        const {item = {}} = response;
        const index = self.leaves.findIndex((each) => each._id === body.id);
        self.leaves.splice(index, 1, Leave.create(item));
        request.success(item);
      } catch (e) {
        request.error(e);
      } finally {
        request.finally();
      }
    }),
    
    reviewLeave: flow(function* reviewLeave(req = {}) {
      const request = new Request(req);
      try {
        const {body} = request;
        const response = yield http.PATCH(`/api/leaves/${body.id}/review`, body);
        const {item = {}} = response;
        const index = self.approvals.findIndex((each) => each._id === body.id);
        self.approvals.splice(index, 1, Leave.create(item));
        request.success(item);
      } catch (e) {
        request.error(e);
      } finally {
        request.finally();
      }
    }),
  }));

export default LeaveStore;
