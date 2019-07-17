let worker = new Worker('./audio-worker.js')

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let channels = 2;
let sampleRate = 44100
let length = 5 * sampleRate // 左右声道各5秒音频缓冲
let myAudioBuffer = audioCtx.createBuffer(channels, length, sampleRate);
let nowBuffering1 = myAudioBuffer.getChannelData(0, 16, sampleRate);
let nowBuffering2 = myAudioBuffer.getChannelData(1, 16, sampleRate);
let timer
let source = audioCtx.createBufferSource();
source.onended = function() {
  console.log('Your audio has finished playing');
}
source.buffer = myAudioBuffer;
source.loop = true
source.connect(audioCtx.destination);
source.start(0);

worker.onmessage = function(event) {
  console.log(event.data)
  if (event.data.code == 3) {
    if (event.data.audioBufferLeft.length <= 0 && event.data.audioBufferRight.length <= 0) {
      clearInterval(timer)
      source.stop()
      source.disconnect()
    }
    for (let i = 0; i < event.data.audioBufferLeft.length; i++) {
      let d = event.data.audioBufferLeft[i]
      nowBuffering1[(event.data.bufferIndex + i) % length] = ((d + 32768) % 65536 - 32768) / 32768.0
    }
  
    for (let i = 0; i < event.data.audioBufferRight.length; i++) {
      let d = event.data.audioBufferRight[i]
      nowBuffering2[(event.data.bufferIndex + i) % length] = ((d + 32768) % 65536 - 32768) / 32768.0
    }
  } else if (event.data.code == 4) {
    clearInterval(timer)
    source.stop()
    source.disconnect()
  }
}
worker.postMessage({
  code: 2,
  bufferLength: length,
  audioBufferLeft: nowBuffering1,
  audioBufferRight: nowBuffering2
})

worker.postMessage({
  code: 1,
  dataNeed: length
})
let prevSecond = 0;
timer = setInterval(() => {
  let second = Math.floor(audioCtx.getOutputTimestamp().contextTime)
  // ...... 设置音频时钟
  // 根据时间差替换音频缓冲区内的数据
  if (second - prevSecond > 2) {
    worker.postMessage({
      code: 1,
      dataNeed: Math.abs(second - prevSecond) * sampleRate
    })
    prevSecond = second
  }
}, 10)