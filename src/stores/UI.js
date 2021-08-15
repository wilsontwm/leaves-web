import { types } from 'mobx-state-tree';
import { notification } from 'antd';

import Loader from '../models/Loader';

const openNotification = (message, type) => {
  notification[type]({
    message,
    duration: 3,
    placement: 'bottomLeft',
  });
};

const NotyManager = types.model('NotyManager', {}).actions(self => ({
  default(message) {
    openNotification(message, 'info');
  },
  info(message) {
    openNotification(message, 'info');
  },
  error(message) {
    openNotification(message, 'error');
  },
  warn(message) {
    openNotification(message, 'warning');
  },
  success(message) {
    openNotification(message, 'success');
  },
}));

const UIStore = types.model('UIStore', {
  loader: Loader,
  noty: NotyManager,
  logoUrl: '',
});

export default UIStore;
