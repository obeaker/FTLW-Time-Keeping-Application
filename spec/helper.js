var path = require('path');

module.exports = {
  appPath: function() {
    switch (process.platform) {
      case 'darwin':
        return path.join(__dirname, '..', '.tmp', 'Ftlwapp-darwin-x64', 'Ftlwapp.app', 'Contents', 'MacOS', 'Ftlwapp');
      case 'linux':
        return path.join(__dirname, '..', '.tmp', 'Ftlwapp-linux-x64', 'Ftlwapp');
      default:
        throw 'Unsupported platform';
    }
  }
};
