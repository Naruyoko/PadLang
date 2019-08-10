function charCodeAt(s,i){
  return create("int",s.value.charCodeAt(i));
}
function charAt(s,i){
  return create("str",s.value[i]);
}
function lengthOfString(s,i){
  return create("int",s.value.length);
}