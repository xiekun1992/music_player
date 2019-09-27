const {
    remote 
} = require('electron');

let wX, wY, dragging = false;

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

playerContainer.addEventListener('dblclick', e => {
  try {
    if (remote.BrowserWindow.getFocusedWindow().isFullScreen()) {
      remote.BrowserWindow.getFocusedWindow().setFullScreen(false);
    } else {
      remote.BrowserWindow.getFocusedWindow().setFullScreen(true);
    }
  } catch(e) {
    console.error(e);
  }
});