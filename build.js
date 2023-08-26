// create a list of all the files in /md
// and write them to a file called list.json
// in the root of the project

var fs = require('fs');
var path = require('path').posix;

// create the /public folder if it doesn't exist
var publicPath = path.join(__dirname, 'public');

if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
}

var mdPath = path.join(__dirname, 'md');
var listPath = path.join(__dirname, 'public/list.json');

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push('/'+path.relative(__dirname, name));
    }
  }
  return files_;
}

var files = getFiles(mdPath);

fs.writeFile(listPath, JSON.stringify(files), function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("The file was saved!");
  }
});

// copy files from /md to /public/md

var ncp = require('ncp').ncp;

ncp.limit = 16;

ncp(mdPath, path.join(publicPath, 'md'), function (err) {
 if (err) {
   return console.error(err);
 }
 console.log('done!');
});
