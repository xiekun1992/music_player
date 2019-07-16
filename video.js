// // console.log(ffmpeg)
// let info = ffmpeg.config(filename)

// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );

// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
// window.addEventListener( 'resize', onWindowResize, false );

// function onWindowResize(){

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize( window.innerWidth, window.innerHeight );

// }
        
// var width = info.width, height = info.height, interval = 1000 / info.fps;
// var data = ffmpeg.extractRGBFrame()
// data = new Uint8Array(data)

// var texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat );
// var geometry = new THREE.PlaneGeometry( 48, 27, 1, 1 )
// // var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
// var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, color: 0xffffff } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );
// cube.rotation.z = Math.PI / 1;
// cube.rotation.y = -Math.PI / 1;
// camera.position.z = 32.7;

// renderer.render( scene, camera );

// setInterval(function() {
//     // var s = performance.now()
//     renderer.render( scene, camera );
//     texture.image.data = new Uint8Array(ffmpeg.extractRGBFrame());
//     texture.needsUpdate = true
//     // console.log(performance.now() - s)
// }, interval);
