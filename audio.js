function bufferToInt16Array(buf) {
  let int8array = new Int8Array(buf)
  return new Int16Array(int8array.buffer)
}

const ffmpeg = require('../node-addons/node-addon-ffmpeg/build/Release/ffmpeg.node')
const fs = require('fs')
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var channels = 2;
ffmpeg.initAudio()

function playPcm() {
  // let buf = bufferToInt16Array(fs.readFileSync('D:\\Audio for Wildlife.raw'))
  // let buf = bufferToInt16Array(fs.readFileSync('D:\\Audio for Wildlife (2).pcm'))
  let buf = bufferToInt16Array(ffmpeg.decodeAudio())

  var frameCount = buf.length;
  var myAudioBuffer = audioCtx.createBuffer(channels, frameCount / 2, 44100);

  // let buf1 = buf
  // l r l r l r 交错存储的pcm
  let buf1 = new Int16Array(frameCount / 2);
  for (let i = 0, j = 0; i < frameCount; i+=2, j++) {
    buf1[j] = buf[i]
  }
  let buf2 = new Int16Array(frameCount / 2);
  for (let i = 1, j = 0; i < frameCount; i+=2, j++) {
    buf2[j] = buf[i]
  }
  var nowBuffering1 = myAudioBuffer.getChannelData(0, 16, 44100);
  var nowBuffering2 = myAudioBuffer.getChannelData(1, 16, 44100);
  for (var i = 0; i < frameCount; i++) {
    // audio needs to be in [-1.0; 1.0]
    // for this reason I also tried to divide it by 32767
    // as my pcm sample is in 16-Bit. It plays still the
    // same creepy sound less noisy.
    // var word = (sounds[soundName].charCodeAt(i * 2) & 0xff) + ((sounds[soundName].charCodeAt(i * 2 + 1) & 0xff) << 8);
    var word1 = buf1[i]
    var word2 = buf2[i]
    nowBuffering1[i] = word1 / 32768//((word1 + 32768) % 65536 - 32768) / 32768.0;
    nowBuffering2[i] = word2 / 32768//((word2 + 32768) % 65536 - 32768) / 32768.0;
  }
  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  var source = audioCtx.createBufferSource();
  // source.playbackRate.value = 2;
  // console.log(buf.length)
  source.onended = function() {
    console.log('Your audio has finished playing');
    playPcm()
  }
  // set the buffer in the AudioBufferSourceNode
  source.buffer = myAudioBuffer;
  // connect the AudioBufferSourceNode to the
  // destination so we can hear the sound
  source.connect(audioCtx.destination);
  // start the source playing
  source.start();
}
playPcm()