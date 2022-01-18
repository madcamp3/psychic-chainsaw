import * as THREE from './build/three.module.js';

import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './jsm/loaders/DRACOLoader.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import {FontLoader} from './jsm/loaders/FontLoader.js'
import {TextGeometry} from './jsm/geometries/TextGeometry.js'
import { OBJLoader } from './jsm/loaders/OBJLoader.js';
import {MTLLoader} from './jsm/loaders/MTLLoader.js';


// Load 3D Scene
var scene = new THREE.Scene();
 // Load Camera Perspektive
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight/3, 1, 1000 );
camera.position.set( -9, 3, -9);

 // Load a Renderer
var renderer = new THREE.WebGLRenderer({ alpha: false });
// renderer.setClearColor( 0xC5C5C3 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth/3, window.innerHeight);
document.body.appendChild(renderer.domElement);
	
let obj;
const container = document.getElementById( 'container3' );
container.appendChild( renderer.domElement );
 // Load the Orbitcontroller
// var controls = new OrbitControls( camera, renderer.domElement ); 
let controls = new OrbitControls( camera, container );
 // Load Light
var ambientLight = new THREE.AmbientLight( 0xcccccc );
scene.add( ambientLight );
			
var directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 0, 1, 1 ).normalize();
scene.add( directionalLight );

	
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( './js/libs/draco/gltf/' );
 // glTf 2.0 Loader
var loader0 = new GLTFLoader();				
loader0.setDRACOLoader( dracoLoader );
	loader0.load( './models/gltf/poptxt.glb', function ( gltf ) {              				
	gltf.scene.scale.set(8, 8, 8);			   
	gltf.scene.position.x = 0;				    //Position (x = right+ left-) 
    gltf.scene.position.y = 6;				    //Position (y = up+, down-)
	gltf.scene.position.z = 0;				    //Position (z = front +, back-)
    gltf.scene.rotation.y += 3.9;

	console.log(gltf.scene);
    console.log(camera.position);
	scene.add( gltf.scene );
});	 



let mtlLoader = new MTLLoader();

// 로드할 Material 파일 명을 입력합니다.
mtlLoader.load('./models/obj/micro/microphone_obj.mtl', function (materials) {
    // 로드 완료되었을때 호출하는 함수
    materials.preload();
    LoaderLoad(materials);
});
	

const LoaderLoad = (m) => {
    var loader = new OBJLoader();	

    loader.setMaterials(m);

    loader.load( './models/obj/micro/microphone_obj.obj', function ( object ) {              				
        object.scale.set(27, 27, 27);			   
        object.position.x = 0;				    //Position (x = right+ left-) 
        object.position.y = -10;				    //Position (y = up+, down-)
        object.position.z = 0;				    //Position (z = front +, back-)
        object.rotation.y += 8;

        console.log(object.position);
        console.log(camera.position);
        scene.add( object );
        obj = object;
    });	 
}

const textloader = new THREE.TextureLoader();
const bgTexture = textloader.load('./image/bts.png');
scene.background = bgTexture;



// let fontLoader = new FontLoader();
// fontLoader.load("./fonts/gentilis_bold.typeface.json", (font) => {
//     let geometry = new TextGeometry(
//         "K-POP",
//         { 
//             font: font,
//             size: 1,
//             height: 0,
//             curveSegments: 12
//         }
//     );
//     geometry.computeBoundingBox();
//     let xMid = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
//     geometry.translate( xMid, 0, 0 );
//     let material = new THREE.MeshBasicMaterial({
//         color: 0x3232ff, 
//         // wireframe: true
//     });
//     let mesh = new THREE.Mesh(geometry, material);
//     mesh.position.x = -1;
//     mesh.position.y = 5.3;
//     mesh.position.z = 0;
//     mesh.rotation.y += 10.3;
//     mesh.scale.set(2.5, 2.5, 2.5 );	
//     scene.add(mesh);
//     console.log(mesh.position);
//     // this.mesh = mesh;
//     // this.render();
// });



function animate() {
	render();
    if(obj)
        obj.rotation.y += 0.0015; 
	requestAnimationFrame( animate );
	}

function render() {
	renderer.render( scene, camera );
	}


render();
animate();
