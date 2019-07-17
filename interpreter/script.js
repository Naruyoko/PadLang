function dg(s){
  return document.getElementById(s);
}
var file;
function onupload(){
  file=dg("upload").files[0];
}
