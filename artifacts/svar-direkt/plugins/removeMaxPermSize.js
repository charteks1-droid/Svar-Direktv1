const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function removeMaxPermSize(config) {
  return withGradleProperties(config, (config) => {
    config.modResults = config.modResults.map((item) => {
      if (item.type === 'property' && item.key === 'org.gradle.jvmargs') {
        item.value = item.value
          .replace(/-XX:MaxPermSize=\S+\s*/g, '')
          .replace(/-XX:PermSize=\S+\s*/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }
      return item;
    });
    return config;
  });
};
