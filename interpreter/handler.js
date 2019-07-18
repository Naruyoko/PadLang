//Shorter name
function dg(s){
  return document.getElementById(s);
}
window.onload=function(){
  //Check for API support
  if (!(window.File&&window.FileReader&&window.FileList&&window.Blob)){
    var error="File APIs are not fully supported in this browser!";
    alert(error);
    console.error(error);
  }
}

var file=null;
var reader=new FileReader();
var rawProgram="";
var hexPorgram="";
function onupload(){
  file=dg("upload").files[0];
}
function readFile(){
  if (!file){
    return "File not selected!";
  }
  dg("fileInfo").innerHTML="<strong>"+file.name+"</strong> - "+file.size+" bytes, last modified: "+(file.lastModifiedDate?file.lastModifiedDate.toLocaleDateString():"n/a");
  reader.readAsText(file,dg("encode").value);
}
reader.onload=function(e){
  rawProgram=reader.result;
  hexProgram=rawToHex(rawProgram);
  displayProgram();
}
function displayProgram(){
  dg("rawview").value=rawProgram;
  dg("hexview").value=hexProgram;
}

function changeRawProgram(){
  rawProgram=dg("rawview").value;
  dg("hexview").value=hexProgram=rawToHex(rawProgram);
  displayProgram();
}
function changeHexProgram(){
  hexProgram=dg("hexview").value;
  dg("rawview").value=rawProgram=hexToRaw(hexProgram);
  displayProgram();
}
