var fs = require('fs');
var packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf8'));

var structure = {
  src: ['configs', 'jsons', 'utils', 'modules', packageJSON.name + '.js'],
  test: [packageJSON.name + '.spec.js']
};

// Create the directory structure
for (var dir in structure) {

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  structure[dir].forEach(function(value) {

    var currentDir = './' + dir;

    if (value.indexOf('.') !== -1) {

      var file = currentDir + '/' + value;

      if (!fs.existsSync(file)) {
        fs.writeFile(file, '');
      }

    } else {

      currentDir += '/' + value;

      if (!fs.existsSync(currentDir)) {
        fs.mkdirSync(currentDir);
      }

    }
  });

}

// Create the index html for testing
var html = '<!DOCTYPE html><html>' +
           '<head>' +
           '<title>' + packageJSON.name + ' - ' + packageJSON.version + '</title>' +
           '</head>' +
           '<body>' +
           '<h2>' + packageJSON.description + '</h2>' +
           '<script src="vendor/system.js"></script>' +
           '<script src="config.js"></script>' +
           '<script>System.import("' + packageJSON.name + '");</script>' +
           '</body></html>';

if (!fs.existsSync('index.html')) {
  fs.writeFile('index.html', html);
}

