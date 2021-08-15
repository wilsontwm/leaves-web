import { types } from 'mobx-state-tree';
import UiStore from './UI';
import AuthStore from './Auth';
import UserStore from './User';
import LeaveStore from './Leave';

const RootStore = types
  .model('RootStore', {
    uiStore: UiStore,
    authStore: AuthStore,
    userStore: UserStore,
    leaveStore: LeaveStore,
  })
  .actions((self) => ({}));

const rootStore = RootStore.create({
  uiStore: { loader: {}, noty: {} },
  authStore: {},
  userStore: {},
  leaveStore: {}
});

export default rootStore;
