// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('../../../templates/jest.config');

module.exports = {
  ...base,
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
};
