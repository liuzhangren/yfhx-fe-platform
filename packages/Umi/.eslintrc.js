module.exports = {
  extends: [
    require.resolve('@umijs/fabric/dist/eslint')
  ],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    "jsx-a11y/anchor-is-valid": [0],
    "jsx-a11y/anchor-has-content": "off",
    "jsx-a11y/no-static-element-interactions": [0],
    "jsx-a11y/click-events-have-key-events": [0],
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/label-has-for": "off"
  }
};