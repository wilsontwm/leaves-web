import { types } from 'mobx-state-tree';

const User = types.model('User', {
  _id: '',
  name: '',
  email: '',
  isAdministrator: false,
  createdAt: '',
  updatedAt: '',
});

export default User;
