const ffmpeg = require('../node-addons/node-addon-ffmpeg/build/Release/ffmpeg.node')
// var filename = 'D:\\Wildlife.wmv'  
// ffmpeg.initAudio(filename)

let bufferLength
let bufferIndex = 0

let leftBuffer = new Int16Array(), rightBuffer = new Int16Array()
let bufferLimit = 256 * 1024

fillBuffer()
onmessage = function(event) {
  if (event.data.code == 1) {
    // return;
    let audioBufferLeft = new Int16Array(event.data.dataNeed)
    let audioBufferRight = new Int16Array(event.data.dataNeed)
    if (leftBuffer.length <= 0 && rightBuffer.length <= 0) {
      this.postMessage({
        code: 4
      })  
      return;
    }
    let i
    for (i = 0; i < event.data.dataNeed; i++) {
      audioBufferLeft[i] = leftBuffer[i]
      audioBufferRight[i] = rightBuffer[i]
    }
    this.postMessage({
      code: 3,
      bufferIndex,
      audioBufferLeft,
      audioBufferRight
    })
    bufferIndex = (bufferIndex + i) % bufferLength
    leftBuffer = leftBuffer.subarray(i)
    rightBuffer = rightBuffer.subarray(i)
    // 补充缓冲区
    fillBuffer()
  } else if (event.data.code == 2) {
    bufferLength = event.data.bufferLength
  }
}
// 初始化
async function fillBuffer() {
  while (true) {
    // debugger
    if (leftBuffer.length < bufferLimit || rightBuffer.length < bufferLimit) {
      let pcmBuf = ffmpeg.decodeAudio()
      if (!pcmBuf) {
        break;
      }
      let buf = bufferToInt16Array(pcmBuf)
      savePcmBuffer(buf)
      buf = pcmBuf = null
    }
    if (leftBuffer.length >= bufferLimit && rightBuffer.length >= bufferLimit) {
      break;
    }
  }
  return true
}
function savePcmBuffer(buf) {
  let totalLen = buf.length;
  // l r l r l r 交错存储的pcm
  let buf1 = new Int16Array(totalLen / 2);
  for (let i = 0, j = 0; i < totalLen; i+=2, j++) {
    buf1[j] = buf[i]
  }
  let buf2 = new Int16Array(totalLen / 2);
  for (let i = 1, j = 0; i < totalLen; i+=2, j++) {
    buf2[j] = buf[i]
  }

  let leftTmp = new Int16Array(buf1.length + leftBuffer.length);
  leftTmp.set(leftBuffer)
  leftTmp.set(buf1, leftBuffer.length)
  leftBuffer = leftTmp
  
  let rightTmp = new Int16Array(buf2.length + rightBuffer.length);
  rightTmp.set(rightBuffer)
  rightTmp.set(buf2, rightBuffer.length)
  rightBuffer = rightTmp

  rightTmp = leftTmp = buf1 = buf2 = null
}

function bufferToInt16Array(buf) {
  let int8array = new Int8Array(buf)
  return new Int16Array(int8array.buffer)
}