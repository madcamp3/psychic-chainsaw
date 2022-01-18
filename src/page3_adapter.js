let arg = [];
  window.onload = function(){
    fetch("http://54.180.137.113:8000/pop/all")
    .then((response) => response.json())
    .then((data) => {
    console.log(data)
    console.log(data.data);
    let l = data.data;
    for(let i = 0; i < l.length; i++){
      arg.push(l[i].filename);
      console.log(arg);
    }
    console.log(arg)

    let length = arg.length;
    let list = document.getElementById("list_content");
    var ul = document.createElement("ul");
    ul.setAttribute('id', 'unordered_list');

    for(let j = 1; j < length+1; j++){
      var li = document.createElement("li");
      li.setAttribute('id', 'item');
      li.onclick = function(){
      window.location.href='page3.html?filename=' + arg[j-1];
    };
      li.append(arg[j-1]);
      ul.append(li)
    }
    list.append(ul);
  });}