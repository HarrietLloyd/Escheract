

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//ambient light
var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

//point light
var light2 = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 8, 8, 8 );
scene.add( light2 );


var player = {x:-8,y:2,z:0}
camera.position.set(player.x, player.y, player.z);
camera.lookAt(new THREE.Vector3(0,0,0));

// load model assets
var loader = new THREE.JSONLoader();
loader.load( 'http://localhost/Tesseract/game/assets/room.json', function ( geometry, materials ) {
	var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
	scene.add( mesh );
});

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );

}
render();