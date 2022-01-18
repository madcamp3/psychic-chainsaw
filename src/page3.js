// import * as THREE from 'https://cdn.skypack.dev/three@0.84.0/build/three.module.js';
// import SimplexNoise from 'https://cdn.JsDelivr.net/npm/simplex-noise/dist/esm/simplex-noise.min.js';


function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


    
    var noise = new SimplexNoise();

    var vizInit = function (){
      
        let url = "http://54.180.137.113:8000/pop/" + getParameter('filename');
        let audio = document.getElementById("audio");

        //오디오 파일 자체를 리턴해야 실행이 가능할 것으로 예상됨.
        //지금 url로 하다보니 URL.createObjectURL을 못해서 에러 발생하는 것으로 예상됨.

        audio.crossOrigin = "anonymous";
        audio.src = url;
        audio.load();
        audio.play();
        play();
      
      
        function play() {
            var context = new AudioContext();
            var src = context.createMediaElementSource(audio);
            var analyser = context.createAnalyser();
            src.connect(analyser);
            analyser.connect(context.destination);
            analyser.fftSize = 512;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(bufferLength);
            var scene = new THREE.Scene();
            var group = new THREE.Group();
            var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0,0,110);
            camera.lookAt(scene.position);
            scene.add(camera);
        
            var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
        
            var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
        
            console.log(planeGeometry);
            console.log(planeGeometry.vertices);
        
            var planeMaterial = new THREE.MeshLambertMaterial({
                // color: 0x6904ce,
                // color: 0x333380,
                color: 0x1a237e,
                side: THREE.DoubleSide,
                wireframe: true
            });
            
            var plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.set(0, 30, 0);
            group.add(plane);
            
            var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
            plane2.rotation.x = -0.5 * Math.PI;
            plane2.position.set(0, -30, 0);
            group.add(plane2);
        
            var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
            var lambertMaterial = new THREE.MeshLambertMaterial({
                // color: 0xff00ee,
                color:0x29b0ff,
                emissive:0x06225b,
                wireframe: true
            });
        
            var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
            ball.position.set(0, 0, 0);
            group.add(ball);
        
            var ambientLight = new THREE.AmbientLight(0xaaaaaa);
            scene.add(ambientLight);
        
            var spotLight = new THREE.SpotLight(0xffffff);
            spotLight.intensity = 0.9;
            spotLight.position.set(-10, 40, 20);
            spotLight.lookAt(ball);
            spotLight.castShadow = true;
            scene.add(spotLight);
            
            scene.add(group);
        
            document.getElementById('out').appendChild(renderer.domElement);
        
            window.addEventListener('resize', onWindowResize, false);
        
            render();
        
            function render() {
              analyser.getByteFrequencyData(dataArray);
        
              var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
              var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);
        
              var overallAvg = avg(dataArray);
              var lowerMax = max(lowerHalfArray);
              var lowerAvg = avg(lowerHalfArray);
              var upperMax = max(upperHalfArray);
              var upperAvg = avg(upperHalfArray);
        
              var lowerMaxFr = lowerMax / lowerHalfArray.length;
              var lowerAvgFr = lowerAvg / lowerHalfArray.length;
              var upperMaxFr = upperMax / upperHalfArray.length;
              var upperAvgFr = upperAvg / upperHalfArray.length;
        
              makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
              makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
              
              makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));
        
              group.rotation.y += 0.0015;
              renderer.render(scene, camera);
              requestAnimationFrame(render);
            }
        
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        
            function makeRoughBall(mesh, bassFr, treFr) {
                mesh.geometry.vertices.forEach(function (vertex, i) {
                    var offset = mesh.geometry.parameters.radius;
                    var amp = 12;
                    var time = window.performance.now();
                    vertex.normalize();
                    var rf = 0.00008;
                    var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
                    vertex.multiplyScalar(distance);
                });
                mesh.geometry.verticesNeedUpdate = true;
                mesh.geometry.normalsNeedUpdate = true;
                mesh.geometry.computeVertexNormals();
                mesh.geometry.computeFaceNormals();
            }
        
            function makeRoughGround(mesh, distortionFr) {
                console.log(mesh.geometry);
                console.log(mesh.geometry.vertices);
                mesh.geometry.vertices.forEach(function (vertex, i) {
                    var amp = 2;
                    var time = Date.now();
                    var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
                    vertex.z = distance;
                });
                mesh.geometry.verticesNeedUpdate = true;
                mesh.geometry.normalsNeedUpdate = true;
                mesh.geometry.computeVertexNormals();
                mesh.geometry.computeFaceNormals();
            }
        
            audio.play();
          };
    }
    
    window.onload = vizInit();
    
    document.body.addEventListener('touchend', function(ev) { context.resume(); });
    
    
    
    
    
    function fractionate(val, minVal, maxVal) {
        return (val - minVal)/(maxVal - minVal);
    }
    
    function modulate(val, minVal, maxVal, outMin, outMax) {
        var fr = fractionate(val, minVal, maxVal);
        var delta = outMax - outMin;
        return outMin + (fr * delta);
    }
    
    function avg(arr){
        var total = arr.reduce(function(sum, b) { return sum + b; });
        return (total / arr.length);
    }
    
    function max(arr){
        return arr.reduce(function(a, b){ return Math.max(a, b); })
    }    