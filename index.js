
// Set default node environment to development
process.env.NODE_ENV = 'development';

var config = require('./config');
var ffmpeg = require('./components/ffmpeg');
var moment = require('moment');
var fs = require('fs'),

S3FS = require('s3fs'),
s3fsImpl = new S3FS('toi-cam', {
    accessKeyId: config.aws.access_key_id,
    secretAccessKey: config.aws.secret_access_key
});

var upload = function (res) {

  var file = {
    path: res.temp_dir+res.temp_name,
    temp_name: res.temp_name,
    name: res.name,
    archive_dir: res.archive_dir
  };

  var params = config.aws.params;
  var stream = fs.createReadStream(file.path);
  console.log('start write');
  return s3fsImpl.writeFile(file.name, stream, params).then(function () {
    console.log('saved');
    fs.rename(file.path, file.archive_dir+file.temp_name, function(err){
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('upload complete.');
    });

  });
};
ffmpeg.record(config.video, upload); //init

var interval = (config.video.duration+config.video.delay)*1000; //ms

setInterval(function() {
  ffmpeg.photo(config.photo, upload);
  ffmpeg.record(config.video, upload);
}, interval);


//var init = function(){  //instead of interval
//  ffmpeg.record(config.video, upload);
//};
//
//init();
//






