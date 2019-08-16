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
function lengthOfString(s,i){
  return create("int",s.value.length);
}