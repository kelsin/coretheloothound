export function initialize(application) {
  application.inject('route', 'storage', 'model:storage');
  application.inject('controller', 'storage', 'model:storage');
  application.inject('adapter', 'storage', 'model:storage');
}

export default {
  name: 'storage',
  initialize
};
