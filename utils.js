const {
    remote 
} = require('electron');

let wX, wY, dragging = false;

playerEl.addEventListener('mousedown', e => {
  dragging = true;
  wX = e.pageX;
  wY = e.pageY;
});
window.addEventListener('mousemove', e => {
  e.stopPropagation();
  e.preventDefault();
  if (dragging) {
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