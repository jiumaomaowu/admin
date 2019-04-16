module.exports = {
  presets: [
     ["@babel/preset-env",{
    "targets": {
      "browsers": [
        "last 2 versions",
        "not ie <= 9"
      ]
    },
    "modules": false,
    "debug": false,
    "useBuiltIns": "entry"
  }]

],
"plugins": [
  "@babel/plugin-syntax-dynamic-import"
]
};
