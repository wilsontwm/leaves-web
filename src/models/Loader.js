import { types } from 'mobx-state-tree';

const Loader = types
  .model('Loader', {
    isLoading: false,
  })
  .actions(self => ({
    show() {
      self.isLoading = true;
    },
    hide() {
      self.isLoading = false;
    },
  }));

export default Loader;
