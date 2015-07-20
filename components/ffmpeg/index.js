var exports = module.exports = {};
var moment = require('moment');

exports.record = function(params, callback){

  params.temp_name = moment().format('YYYYMMDDhhmm')+'-studio.mp4';

  // these were specific to my use.

  var hh = moment().format('hh'); // current timecode
  var mm = moment().format('mm'); 
  var ss = moment().format('ss'); 
  var SS = moment().format('SS'); 

  var tc =          //timecode
  "drawtext=fontcolor="+params.text.color+": \
  fontsize="+params.text.font_size+": \
  fontfile="+params.text.font_file+": \
  :x=1420:y=1000: \
  timecode='"+hh+"\\:"+mm+"\\:"+ss+"\\;"+SS+"':rate=30000/1001: \
  text="+params.location+"\n\\";
 

  var ffmpeg = require('child_process').spawn('ffmpeg', [
  '-y',                             //overwrite file
  '-f',                             //force format
  params.camera_framework,          //camera framework
  '-i',       
  params.input_device,              //input device
  '-s',       
  '1280x720',       
  '-r',                             //framerate
  params.frame_rate,                //seconds
  '-pix_fmt',       
  'yuv422p',                        //yuv 422p input 
  '-b:v',                           //variable bitrate
  params.bitrate,       
  '-maxrate',                       //max bitrate               
  params.max_bitrate,       
  '-codec:v',       
  'libx264',                        //h264 codec
  '-threads',                       //Use all cores
  '0',        
  '-profile:',                      //codec profile
  'high422',        
  '-preset',                        //encoding speed/quality
  params.encoding_speed,        
  '-pix_fmt',                       //convert back to a legacy format to play in most players
  'yuv420p',        
  '-vf',                            //output video format
  'scale=-1:720',                   //scale down
  '-vf',
  tc,
  '-an',                            //no audio
  '-t',                             //time
  params.duration,                  //seconds
  params.temp_dir+params.temp_name  //output directory + time based file name
  ]);



  ffmpeg.on('error', function (err) {
    console.warn(err);
    throw err;
  });

  ffmpeg.on('close', function (code) {  //execute on finish
    console.log('ffmpeg exited with code ' + code);
    console.log(params.temp_dir+params.name);
    callback(params);
  });

  ffmpeg.stderr.on('data', function (data) {  //readout progress
    console.log('stderr: ' + data);
  });

};

exports.photo = function(params, callback) {

  params.temp_name = moment().format('YYYYMMDDhhmm')+'-studio.jpg';

  var ffmpeg = require('child_process').spawn('ffmpeg', [
    '-f',
    params.camera_framework,
    '-i',
    params.input_device,
    '-vframes',
    '1',
    params.temp_dir+params.temp_name
  ]);

  ffmpeg.on('error', function (err) {
    console.warn(err);
    throw err;
  });

  ffmpeg.on('close', function (code) {  //execute on finish
    console.log('ffmpeg exited with code ' + code);
    console.log(params.temp_dir+params.name);
    callback(params);
  });

  ffmpeg.stderr.on('data', function (data) {  //readout progress
    console.log('stderr: ' + data);
  });  

};