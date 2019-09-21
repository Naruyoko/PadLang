function rawStringToBase64(s){
  var q="";
  for (var i=0;i<s.length;i++){
    var c=s.charCodeAt(i).toString(2);
    while (c.length<16){
      c="0"+c;
    }
    q+=c;
  }
  while (q.length%6!=0){
    q+="0";
  }
  var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var r="";
  while (q.length!=0){
    r+=d[parseInt(q.substring(0,6),2)];
    q=q.substring(6);
  }
  while (r.length%4!=0){
    r+="=";
  }
  return r;
}

function rawStringToURLBase64(s){
  var q="";
  for (var i=0;i<s.length;i++){
    var c=s.charCodeAt(i).toString(2);
    while (c.length<16){
      c="0"+c;
    }
    q+=c;
  }
  while (q.length%6!=0){
    q+="0";
  }
  var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  var r="";
  while (q.length!=0){
    r+=d[parseInt(q.substring(0,6),2)];
    q=q.substring(6);
  }
  while (r.length%4!=0){
    r+=".";
  }
  return r;
}

function base64ToRawString(s){
  var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var q="";
  //regex to check if a string is a valid Base64 string
  //from https://stackoverflow.com/a/35002237
  var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  if (!base64regex.test(s)){
    return "";
  }
  for (var i=0;i<s.length&&s[i]!="=";i++){
    var c=d.indexOf(s[i]).toString(2);
    while (c.length<6){
      c="0"+c;
    }
    q+=c;
  }
  q=q.substring(0,q.length>>4<<4);
  var r="";
  while (q.length!=0){
    r+=String.fromCharCode(parseInt(q.substring(0,16),2));
    q=q.substring(16);
  }
  return r;
}

function URLBase64ToRawString(s){
  var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  var q="";
  //regex to check if a string is a valid Base64 string
  //from https://stackoverflow.com/a/35002237
  var base64regex = /^([0-9a-zA-Z\-_]{4})*(([0-9a-zA-Z\-_]{2}\.\.)|([0-9a-zA-Z\-_]{3}\.))?$/;
  if (!base64regex.test(s)){
    return "";
  }
  for (var i=0;i<s.length&&s[i]!=".";i++){
    var c=d.indexOf(s[i]).toString(2);
    while (c.length<6){
      c="0"+c;
    }
    q+=c;
  }
  q=q.substring(0,q.length>>4<<4);
  var r="";
  while (q.length!=0){
    r+=String.fromCharCode(parseInt(q.substring(0,16),2));
    q=q.substring(16);
  }
  return r;
}