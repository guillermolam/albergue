module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.peerDependencies) {
        // Handle @netlify/blobs for unstorage
        if (pkg.name === 'unstorage' && pkg.peerDependencies['@netlify/blobs']) {
          delete pkg.peerDependencies['@netlify/blobs'];
        }
        // Handle @opentelemetry/api
        if (pkg.peerDependencies['@opentelemetry/api']) {
          pkg.peerDependencies['@opentelemetry/api'] = '*';
        }
        // Handle rollup for @unocss/rollup
        if (pkg.name === '@unocss/rollup' && pkg.peerDependencies['rollup']) {
          pkg.peerDependencies['rollup'] = '*';
        }
      }
      return pkg;
    }
  }
};
