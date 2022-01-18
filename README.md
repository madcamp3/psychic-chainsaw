# Audio Visualizer

## Overview

AI model을 통해서 생성된 음악을 받아와서 Audio Visualizer를 통해 음악의 진폭 변화에 맞춰 3d model이 움직이도록 구성했다.  생성되는 음악의 종류는 클래식 음악, 힙합, Pop으로 총 3가지이다. 사용자가 원하는 음악 장르를 서택하면 그 음악 장르에 알맞는 3d model audio visualizer가 나타나게 된다.

# Fail Version
https://drive.google.com/file/d/1NYpZZj2wbOlpitKAl47LF8cR37g8deDk/view?usp=sharing
https://drive.google.com/file/d/1ZQnCKualQZqvOTUvIa77HlJyrHw5TkoA/view?usp=sharing

## HTML DOM

React를 사용하지 않고, 순수하게 Vanilla JS로 프로젝트를 진행하는 과정에서 동적으로 HTML문을 삽입할 수 있도록 HTML DOM을 사용했다.

```java
  let length = arg.length;
    let list = document.getElementById("list_content");
    var ul = document.createElement("ul");
    ul.setAttribute('id', 'unordered_list');

    for(let j = 1; j < length+1; j++){
      var li = document.createElement("li");
      li.setAttribute('id', 'item');
      li.onclick = function(){
      window.location.href='page2.html?filename=' + arg[j-1];
    };
      li.append(arg[j-1]);
      ul.append(li)
    }
    list.append(ul);
```

## Fetch API

서버에서 생성된 오디오 파일을 가져올 때 fetch api를 사용하여 request를 보내고 filename을 먼저 가져온다.

```java
let arg = [];
  window.onload = function(){
    fetch("http://54.180.137.113:8000/hiphop/all")
    .then((response) => response.json())
    .then((data) => {
    console.log(data)
    console.log(data.data);
    let l = data.data;
    for(let i = 0; i < l.length; i++){
      arg.push(l[i].filename);
      console.log(arg);
    }
```

이후에 아래처럼 url을 받아와 audio를 실행시킨다.

```java
let url = "http://54.180.137.113:8000/hiphop/" + getParameter('filename');
        let audio = document.getElementById("audio");
        audio.crossOrigin = "anonymous";
        audio.src = url;
        audio.load();
        audio.play();
        play();
```

## Audio Visualizer

Audio Visualizer의 생성 과정과 동작원리는 Three.js를 사용하면 생각보다 간단한다.

먼저 Three.js에서 제공하는 다양한 Geometry() 함수들을 통해 원하는 모양의 geometry를 생성한다. 아래의 경우, torus 모양의 3d object를 생성한다.

```java
const radius = 5;  
        const tubeRadius = 3;  
        const radialSegments = 8;  
        const tubularSegments = 24;  
        const exgeometry = new THREE.TorusGeometry(
            radius, tubeRadius,
            radialSegments, tubularSegments);
    
        let planet = new THREE.Mesh(exgeometry,lambertMaterial);
        planet.position.set(0,0,0);
        group.add(planet);
```

3d object가 정상적으로 생성된 이후에는 audio 진폭에 비례하게 3d object가 변해야 하므로 noise에 맞춰서 object의 distance를 변화시킨다.

```java
function makeRoughBall(mesh, bassFr, treFr) {
            mesh.geometry.vertices.forEach(function (vertex, i) {
                var offset = mesh.geometry.parameters.radius;
                var amp = 5;
                var time = window.performance.now();
                vertex.normalize();
                var rf = 0.0005;
                var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
                console.log(distance);
                vertex.multiplyScalar(distance);
            });
            mesh.geometry.verticesNeedUpdate = true;
            mesh.geometry.normalsNeedUpdate = true;
            mesh.geometry.computeVertexNormals();
            mesh.geometry.computeFaceNormals();
        }
```
