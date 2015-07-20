'use strict';
var _ = require('lodash');


function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

var all = {
  env: 'development' || process.env.NODE_ENV,

  aws: {
    access_key_id : 'your_access_key',
    secret_access_key : 'your_secret_key'
  },

  video: {
    name : 'out.mp4',
    temp_dir : './tmp/',
    archive_dir: './archive/mp4/',
    camera_framework: 'avfoundation',
    input_device: 'USB 2.0 Camera',
    frame_rate: 30,
    bitrate: '500k',
    max_bitrate: '800k',
    encoding_speed: 'ultrafast',
    duration: 300
  },
  photo : {
    name: 'placeholder.jpg',
    temp_dir : './tmp/',
    archive_dir: './archive/jpg',
    camera_framework: 'avfoundation',
    input_device: 'USB 2.0 Camera'
  }

};

module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});