function charCodeAt(s,i){
  if (typeof i!="number"){
    i=convert("int",i).value;
  }
  return create("int",s.value.charCodeAt(i));
}
function charAt(s,i){
  if (typeof i!="number"){
    i=convert("int",i).value;
  }
  return create("str",s.value.charAt(i));
}
function lengthOfStr(s,i){
  return create("int",s.value.length);
}
function reverseStr(s){
  if (typeof s=="object"){
    s=convert("str",s).value;
  }
  var r="";
  for (var i=0;i<s.length;i++){
  	r=s[i]+r;
  }
  return create("str",r);
}