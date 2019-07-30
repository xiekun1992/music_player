// console.log(ffmpeg)
// let info = ffmpeg.config(filename)

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
        
var width = +info.video.width, height = +info.video.height, interval = Math.ceil(1000 / +info.video.fps);
var data = ffmpeg.decodeVideo()
data = new Uint8Array(data)

var texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat );
var geometry = new THREE.PlaneGeometry( 48, 27, 1, 1 )
// var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, color: 0xffffff } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.rotation.z = Math.PI / 1;
cube.rotation.y = -Math.PI / 1;
camera.position.z = 32.7;

renderer.render( scene, camera );

// function render() {
//     renderer.render( scene, camera );
//     texture.image.data = new Uint8Array(ffmpeg.decodeVideo());
//     texture.needsUpdate = true
//     requestAnimationFrame(render)
// }
// render()

let vtimer = setInterval(function() {
    // var s = performance.now()
    renderer.render( scene, camera );
    let tmp = ffmpeg.decodeVideo()
    if (tmp) {
        texture.image.data = new Uint8Array(tmp);
        texture.needsUpdate = true
    } else {
        clearInterval(vtimer)
    }
    // console.log(performance.now() - s)
}, interval);
