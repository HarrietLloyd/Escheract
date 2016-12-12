
//Global variables
var camera;
var scene;
var renderer;
var ambientLight;
var pointLight;
var objects = [];
var raycaster;
var controls;

var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();

//Constants
const EYE_HEIGHT = 1.75;// in m
const MASS = 60.0;		// in kg
const GRAVITY = 5;	// in m/s^2
const SPEED = 40.0;
const JUMP_SPEED = 70.0;

lockPointer();
init();
animate();


function init() {
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	scene = new THREE.Scene();
	
	// Lights
	ambientLight = new THREE.AmbientLight( 0x666666 ); 
	scene.add( ambientLight );
	//
	pointLight = new THREE.PointLight( 0xdddddd, 1, 100 );
	pointLight.position.set( 0, 0, 0 );
	scene.add( pointLight );

	// Keyboard controls
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );
	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;
			case 37: // left
			case 65: // a
				moveLeft = true; break;
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			case 32: // space
				if ( canJump === true ) velocity.y += JUMP_SPEED;
				canJump = false;
				break;
		}
	};
	var onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;
			case 37: // left
			case 65: // a
				moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 0.5 );

	// Load model assets
	var loader = new THREE.JSONLoader();
	loader.load( 'http://localhost/Escheract/game/assets/room.json', function ( geometry, materials ) {
		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		scene.add( mesh );
		objects.push( mesh );
	});
	//
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
	if ( controlsEnabled ) {
		raycaster.ray.origin.copy( controls.getObject().position );
		raycaster.ray.origin.y -= EYE_HEIGHT;
		var intersections = raycaster.intersectObjects( objects );
		var isOnObject = intersections.length > 0;
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000.0;
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		velocity.y -= MASS * GRAVITY * delta;
		if ( moveForward ) velocity.z -= SPEED * delta;
		if ( moveBackward ) velocity.z += SPEED * delta;
		if ( moveLeft ) velocity.x -= SPEED * delta;
		if ( moveRight ) velocity.x += SPEED * delta;
		if ( isOnObject === true ) {
			velocity.y = Math.max( 0, velocity.y );
			canJump = true;
		}
		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateY( velocity.y * delta );
		controls.getObject().translateZ( velocity.z * delta );
		if ( controls.getObject().position.y < EYE_HEIGHT ) {
			velocity.y = 0;
			controls.getObject().position.y = EYE_HEIGHT;
			canJump = true;
		}
		
		pointLight.position.set( controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z );
		
		
		prevTime = time;
	}
	renderer.render( scene, camera );
}



