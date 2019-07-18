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
  changeRawProgram();
  changeFileType();
  generateFile();
}

var file=null;
var reader=new FileReader();
var rawProgram="";
var hexPorgram="";
var rawExtentions=[".pdl",".padl",".padlang"];
var hexExtentions=[".pdlh",".padlh",".padlangh",".padh",".padhex",".padlanghex"];
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
  var extention=file.name.substring(file.name.lastIndexOf("."));
  if (!hexExtentions.includes(extention)){
    rawProgram=reader.result;
    hexProgram=rawToHex(rawProgram);
  }else{
    hexProgram=reader.result;
    rawProgram=hexToRaw(hexProgram);
  }
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

function changeFileType(){
  var extentions;
  if (dg("fileType").value=="Raw"){
    extentions=rawExtentions;
  }else{
    extentions=hexExtentions;
  }
  var s="";
  for (var i=0;i<extentions.length;i++){
    s+="<option value=\""+extentions[i]+"\">"+extentions[i]+"</option>";
  }
  dg("fileExtention").innerHTML=s;
}
//function from https://stackoverflow.com/a/29339233
function download(text, name, type) {
  var a = document.getElementById("saveLink");
  var file = new Blob([text], {type: type});
  a.href = URL.createObjectURL(file);
  a.download = name;
}
function generateFile(){
  if (dg("fileType").value=="Raw"){
    download(rawProgram,dg("fileName").value+dg("fileExtention").value,"text/plain");
  }else{
    download(hexProgram,dg("fileName").value+dg("fileExtention").value,"text/plain");
  }
}
