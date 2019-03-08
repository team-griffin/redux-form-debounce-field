module.exports = function (storybookBaseConfig, env) {
  // add file extensions
  storybookBaseConfig.resolve.extensions.push('.ts', '.tsx');

  // https://github.com/storybooks/storybook/issues/1570
  // prevents storybook from building
  storybookBaseConfig.plugins = storybookBaseConfig.plugins.filter(plugin => plugin.constructor.name !== 'UglifyJsPlugin');

  storybookBaseConfig.watchOptions = {
    poll: true
  };

  storybookBaseConfig.node = {
    fs: 'empty'
  };

  storybookBaseConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
        options: {},
      },
    ],
  });

  return storybookBaseConfig;
};