var p = require('./package.json')

module.exports = {
  extends: '@exodus/eslint-config/react',
  rules: {
    'import/no-unresolved': ['error', { ignore: Object.keys(p.peerDependencies) }],
  },
}
