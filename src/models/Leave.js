import { types } from 'mobx-state-tree';

const Leave = types.model('Leave', {
  _id: '',
  userId: '',
  startAt: '',
  endAt: '',
  noOfDays: 0,
  status: '',
  createdAt: '',
  updatedAt: '',
});

export default Leave;
