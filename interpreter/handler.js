//Shorter name
function dg(s){
  return document.getElementById(s);
}

var file=null;
var reader=new FileReader();
var rawProgram="";
var hexPorgram="";
var rawExtentions=[".pdl",".padl",".padlang"];
var hexExtentions=[".pdlh",".padlh",".padlangh",".padh",".padhex",".padlanghex"];
window.onload=function(){
  //Check for API support
  if (!(window.File&&window.FileReader&&window.FileList&&window.Blob)){
    var error="File APIs are not fully supported in this browser!";
    alert(error);
    console.error(error);
  }
  dg("upload").accept=rawExtentions+","+hexExtentions;
  loadAsLink();
  changeRawProgram();
  changeFileType();
  generateFile();
};
function displayProgram(){
  dg("rawview").value=rawProgram;
  dg("hexview").value=hexProgram;
}

function changeRawProgram(){
  rawProgram=dg("rawview").value;
  dg("hexview").value=hexProgram=rawToHex(rawProgram);
  displayProgram();
  generateFile();
}
function changeHexProgram(){
  hexProgram=dg("hexview").value;
  dg("rawview").value=rawProgram=hexToRaw(hexProgram);
  displayProgram();
  generateFile();
}
function removeViewColumnFix(){
  dg("rawview").style.width=dg("rawview").offsetWidth-6+"px";
  dg("hexview").style.width=dg("hexview").offsetWidth-6+"px";
  dg("rawview").removeAttribute("cols");
  dg("hexview").removeAttribute("cols");
}
function alignSizeToRawView(){
  var x=dg("rawview").style.width;
  dg("hexview").style.width=parseInt(x.substring(0,x.length-2))*5+"px";
  dg("hexview").style.height=dg("rawview").style.height;
}
function alignSizeToHexView(){
  var x=dg("hexview").style.width;
  dg("rawview").style.width=parseInt(x.substring(0,x.length-2))/5+"px";
  dg("rawview").style.height=dg("hexview").style.height;
}

//file export
function changeFileType(){
  var extentions;
  if (dg("fileExportType").value=="Raw"){
    extentions=rawExtentions;
    dg("fileExportEncode").style.display="";
  }else{
    extentions=hexExtentions;
    dg("fileExportEncode").style.display="none";
  }
  var s="";
  for (var i=0;i<extentions.length;i++){
    s+="<option value=\""+extentions[i]+"\">"+extentions[i]+"</option>";
  }
  dg("fileExportExtention").innerHTML=s;
}

//function from https://stackoverflow.com/a/29339233
function generateUtf8(str){
  var file = new Blob([str], {type: "text/plain;charset=UTF-8;"});
  return file;
}
//function from https://stackoverflow.com/a/43099608
function generateUtf16(str) {

	// ref: https://stackoverflow.com/q/6226189
	var charCode, byteArray = [];

  if (dg("fileExportEncode")=="UTF-16BE"){
	// BE BOM
  byteArray.push(254, 255);
  }else{
	// LE BOM
  byteArray.push(255, 254);
  }

  for (var i = 0; i < str.length; ++i) {
  
    charCode = str.charCodeAt(i);
    if (dg("fileExportEncode")=="UTF-16BE"){
    // BE Bytes
    byteArray.push((charCode & 0xFF00) >>> 8);
    byteArray.push(charCode & 0xFF);
    }else{
    // LE Bytes
    byteArray.push(charCode & 0xff);
    byteArray.push(charCode / 256 >>> 0);
    }
  }
  
  var blob = new Blob([new Uint8Array(byteArray)], {type:'text/plain;charset=UTF-16BE;'});
  return blob;
}

//function from https://stackoverflow.com/a/29339233
function download(text, name, type) {
  var a = document.getElementById("exportLink");
  var file;
  if (dg("fileExportType").value=="Hex"||dg("fileExportEncode").value=="UTF-8"){
    file=generateUtf8(text);
  }else{
    file=generateUtf16(text);
  }
  a.href = URL.createObjectURL(file);
  a.download = name;
}
function generateFile(){
  if (dg("fileExportType").value=="Raw"){
    download(rawProgram,dg("fileExportName").value+dg("fileExportExtention").value);
  }else{
    download(hexProgram,dg("fileExportName").value+dg("fileExportExtention").value);
  }
}

//file import
function onImportEncodeChanged(){
  if (dg("fileImportEncode").value=="UTF-16"){
    dg("fileImportUTF16EncodeOptions").style.display="";
  }else{
    dg("fileImportUTF16EncodeOptions").style.display="none";
  }
}
function onupload(){
  file=dg("upload").files[0];
}
function readFile(){
  if (!file){
    return "File not selected!";
  }
  dg("fileInfo").innerHTML="<strong>"+file.name+
  "</strong> - "+file.size+" bytes, last modified: "+
  (file.lastModifiedDate?file.lastModifiedDate.toLocaleDateString():"n/a");
  reader.readAsArrayBuffer(file,dg("fileImportEncode").value);
}
reader.onload=function(e){
  var t=new Date();
  var extention=file.name.substring(file.name.lastIndexOf("."));
  if (!hexExtentions.includes(extention)){
    rawProgram=arrayBufferToString(reader.result);
    hexProgram=rawToHex(rawProgram);
  }else{
    hexProgram=arrayBufferToString(reader.result);
    rawProgram=hexToRaw(hexProgram);
  }
  t=new Date()-t;
  var q=reader.result.byteLength;
  var d=q/t;
  console.log("File imported");
  console.log("Length: "+q+" bytes");
  console.log("        "+rawProgram.length+" chars");
  console.log("Load time: "+t+"ms");
  console.log(d+" Bps");
  dg("fileInfo").innerHTML=dg("fileInfo").innerHTML.replace("bytes","bytes("+rawProgram.length+" chars)");
  displayProgram();
}
function getInformationOfTheLastLoadedFile(){
  if (file){
    console.log("Name: "+file.name);
    console.log("Size: "+file.size);
    console.log("Last modified: "+(file.lastModifiedDate?file.lastModifiedDate.toLocaleDateString():"n/a"));
    console.log("File content: ");
    if (reader.result){
      return reader.result;
    }else{
      return null;
    }
  }else{
    return null;
  }
}
function arrayBufferToString(s){
  if (dg("fileImportEncode").value=="7-bit ASCII"){
    var f=new Uint8Array(s);
    var q="";
    for (var i=0;i<f.length;i++){
      var c=f[i].toString(2);
      while (c.length<7){
        c="0"+c;
      }
      q+=c;
    }
    if (q.length%7!=0){
      q+="0".repeat(7-q.length%7);
    }
    var r="";
    while (q.length>0){
      r+=String.fromCharCode(parseInt(q.substring(0,7),2));
      q=q.substring(7);
    }
    return r;
  }else if (dg("fileImportEncode").value=="Windows-1252"){
    var f=new Uint8Array(s);
    var r="";
    for (var i=0;i<f.length;i++){
      var c=String.fromCharCode(f[i]);
      r+=c;
    }
    return r;
  }else if (dg("fileImportEncode").value=="UTF-8"){
    var f=new Uint8Array(s);
    var r="";
    for (var i=0;i<f.length;i++){
      var c=f[i];
      if (!(c&128)){
        c=c&127;
      }else if (!(c&32)){
        console.log(0);
        c=c&31;
        c<<=6;
        i++;
        c+=f[i]&63;
      }else if (!(c&16)){
        console.log(1);
        c=c&15;
        c<<=6;
        i++;
        c+=f[i]&63;
        c<<=6;
        i++;
        c+=f[i]&63;
      }else if (!(c&8)){
        console.log(2);
        c=c&7;
        c<<=6;
        i++;
        c+=f[i]&63;
        c<<=6;
        i++;
        c+=f[i]&63;
        c<<=6;
        i++;
        c+=f[i]&63;
      }
      console.log(c);
      r+=String.fromCharCode(c);
    }
    return r;
  }else if (dg("fileImportEncode").value=="UTF-16"){
    var f=new Uint8Array(s);
    var e=dg("fileImportUTF16Encode").value;
    var r="";
    var a=[];
    for (var i=0;i+1<f.length;i+=2){
      a.push((f[i]<<8)+f[i+1]);
    }
    if (f.length%2==1){
      a.push(f[f.length-1]<<8);
    }
    f=new Uint16Array(a);
    if (e=="assume"){
      if (f[0]==0xfffe){
        e="LE";
      }else{
        e="BE";
      }
    }
    if ((e=="BE"&&f[0]==0xfeff)||(e=="LE"&&f[0]==0xfffe)){
      f=f.slice(1);
    }
    if (e=="LE"){
      a=[];
      for (var i=0;i<f.length;i++){
        a.push(((f[i]&0xff)<<8)+((f[i]&0xff00)>>8));
      }
      f=new Uint16Array(a);
    }
    for (var i=0;i<f.length;i++){
      var c=f[i];
      if ((f[i]>=0xd800)&&(f[i]<0xdc00)&&(f[i+1]&0xdc00)&&(f[i+1]&0xe000)){
        c=(c-0xd800)<<10;
        i++;
        c+=f[i]-0xdc00
      }
      r+=String.fromCharCode(c);
    }
    return r;
  }
}


//saving by URL
function saveAsLink(){
  var encodedProgram=rawStringToURLBase64(rawProgram);
  var encodedName=rawStringToURLBase64(dg("fileExportName").value);
  var url=window.location.href;
  url=UpdateQueryString("program",encodedProgram,url);
  url=UpdateQueryString("name",encodedName,url);
  window.history.pushState({},dg("fileExportName").value,url);
}
function loadAsLink(){
  var encodedProgram=getUrlParameter("program");
  var encodedName=getUrlParameter("name");
  if (encodedProgram){
    rawProgram=URLBase64ToRawString(encodedProgram);
    hexProgram=rawToHex(rawProgram);
    displayProgram();
  }
  if (encodedName){
    dg("fileExportName").value=URLBase64ToRawString(encodedName);
  }
}
//function from https://davidwalsh.name/query-string-javascript
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
//function from https://stackoverflow.com/a/11654596
function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null) {
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        } 
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                url += '#' + hash[1];
            }
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                url += '#' + hash[1];
            }
            return url;
        }
        else {
            return url;
        }
    }
}


function toggleclass(x,c,t){
  if (typeof x!="object"){
    x=dg(x);
  }
  var o=x.className;
  if (!t){
    x.className=o.replace(new RegExp(c,"g"),"");
  }else if (x.className.search(c)==-1){
    x.className+=" "+c;
  }
  o=x.className;
  x.className=o.replace(/  /g," ");
}