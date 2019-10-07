const {
    remote 
} = require('electron');

let wX, wY, dragging = false;
// 窗口移动控制
playerContainer.addEventListener('mousedown', e => {
  // if (e.target == playerContainer) {
    dragging = true;
    wX = e.pageX;
    wY = e.pageY;
  // }
});
window.addEventListener('mousemove', e => {
  if (dragging) {
    e.stopPropagation();
    e.preventDefault();
    try {
      remote.BrowserWindow.getFocusedWindow().setPosition(e.screenX - wX, e.screenY - wY);
    } catch(e) {
      console.error(e);
    }
  }
});
window.addEventListener('mouseup', e => {
  dragging = false;
});
// 全屏控制
window.addEventListener('dblclick', e => {
  try {
    setFullscreen();
  } catch(e) {
    console.error(e);
  }
});
// 控制UI的显隐
let cursorHideTimer, canHideCursor = false;
function hideCursor() {
  clearTimeout(cursorHideTimer);
  document.body.classList.remove('hide-cursor');
  try {
    if (canHideCursor && remote.BrowserWindow.getFocusedWindow().isFullScreen()) {
      cursorHideTimer = setTimeout(function() {
        clearTimeout(cursorHideTimer);
        document.body.classList.add('hide-cursor');
      }, 1000);
    }
  } catch(e) {
    
  }
}
playerControl.addEventListener('mouseenter', () => {
  playerEl.classList.remove('hide-control');
  canHideCursor = false;
  hideCursor();
});
playerControl.addEventListener('mouseleave', () => {
  playerEl.classList.add('hide-control');
  canHideCursor = true;
  hideCursor();
});
playerHeader.addEventListener('mouseenter', () => {
  playerEl.classList.remove('hide-control');
  canHideCursor = false;
  hideCursor();
});
playerHeader.addEventListener('mouseleave', () => {
  playerEl.classList.add('hide-control');
  canHideCursor = true;
  hideCursor();
});
document.body.addEventListener('mousemove', () => {
  hideCursor();
});