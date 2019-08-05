function to16BitHex(n){
  return ((n>>12)%16).toString(16)+((n>>8)%16).toString(16)+((n>>4)%16).toString(16)+((n>>0)%16).toString(16);
}
function to16BitHexString(a){
  var s="";
  for (var i=0;i<a.length;i++){
    s+=" "+to16BitHex(a[i]);
  }
  return s.substring(1);
}
function rawToHex(s){
  var a=[];
  for (var i=0;i<s.length;i++){
    a.push(s.charCodeAt(i));
  }
  return to16BitHexString(a);
}

function from16BitHex(s){
  if (s.match(/[^0-9a-f]/)){
    return 0;
  }
  if (s.length<4){
    s="0".repeat(4-s.length)+s;
  }else if (s.length>4){
    s=s.substring(s.length-4);
  }
  var digits="0123456789abcdef";
  return (digits.indexOf(s[0])<<12)+(digits.indexOf(s[1])<<8)+(digits.indexOf(s[2])<<4)+digits.indexOf(s[3]);
}
function hexToRaw(s){
  var a=s.toLowerCase().split(/[ \n]/).filter(function(s){return s.length&&!s.match(/[^0-9a-f]/)});
  var r="";
  for (var i=0;i<a.length;i++){
    r+=String.fromCharCode(from16BitHex(a[i]));
  }
  return r;
}
