function charCodeAt(s,i){
  if (typeof i!="number"){
    i=i.value;
  }
  return create("int",s.value.charCodeAt(i));
}
function charAt(s,i){
  if (typeof i!="number"){
    i=i.value;
  }
  return create("str",s.value[i]);
}
function lengthOfStr(s,i){
  return create("int",s.value.length);
}
function reverseStr(s){
  if (typeof i=="object"){
    s=convert("str",s).value;
  }
  var r="";
  for (var i=0;i<s.length;i++){
  	r=s[i]+r;
  }
  return create("str",r);
}