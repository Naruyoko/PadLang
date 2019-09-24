function add(a,b){
  var x=alignType(a,b);
  var ca=a;
  var cb=b;
  a=x[0];
  b=x[1];
  var t=x[2];
  if (["int","uint","float","double"].includes(t)){
    return normalize(create(t,a.value+b.value));
  }else if (["superint","superuint"].includes(t)){
    return normalize(create(t,a.value.plus(b.value)));
  }else if (t=="boolean"){
    return normalize(create(t,a.value||b.value));
  }else if (t=="str"){
    return normalize(create(t,a.value+b.value));
  }else if (ca.type=="array"&&cb.type!="array"){
    var c=a.value.slice(0);
    c.push(cb);
    return normalize(create("array",c));
  }else if (ca.type!="array"&&cb.type=="array"){
    var c=b.value.slice(0);
    c.unshift(cb);
    return normalize(create("array",c));
  }else if (t=="array"){
    var c=a.value.slice(0);
    for (var i=0;i<b.value.length;i++){
      c.push(b.value[i]);
    }
    return normalize(create(t,c));
  }else if (t=="object"){
    var c=a.value.slice(0);
    for (var i=0;i<b.value.length;i++){
      var d=b.value[i];
      var x=true;
      for (var j=0;j<a.value.length;j++){
        if (equal(d,a.value[j][0]).value){
          a.value[j][1]=d[1];
          x=false;
          break;
        }
      }
      if (x){
        a.push(d);
      }
    }
    return normalize(c);
  }else if (t=="variable"){
    return create(t,add(a.value,b.value));
  }
}

function subtract(a,b){
  var x=alignType(a,b);
  var ca=a;
  var cb=b;
  a=x[0];
  b=x[1];
  var t=x[2];
  if (["int","uint","float","double"].includes(t)){
    return normalize(create(t,a.value-b.value));
  }else if (["superint","superuint"].includes(t)){
    return normalize(create(t,a.value.minus(b.value)));
  }else if (t=="boolean"){
    return normalize(create(t,a.value&&!b.value));
  }else if (t=="str"){
    var c=a.value;
    for (var i=0;i<b.value.length;i++){
      for (var j=c.length-1;j>=0;j--){
        if (c[j]==b.value[i]){
          c=c.substring(0,j)+c.substring(j+1);
          break;
        }
      }
    }
    return normalize(create(t,c));
  }else if (ca.type=="array"&&cb.type!="array"){
    var c=a.value.slice(0);
    for (var i=c.length-1;i>=0;i--){
      if (equal(c[i],cb).value){
        c.splice(i,1);
        break;
      }
    }
    return normalize(create("array",c));
  }else if (t=="array"){
    var c=a.value.slice(0);
    for (var i=0;i<b.value.length;i++){
      for (var j=c.length-1;j>=0;j--){
        if (equal(c[j],b.value[i]).value){
          c.splice(i,1);
          break;
        }
      }
    }
    return normalize(create(t,c));
  }else if (t=="object"){
    var c=a.value.slice(0);
    for (var i=0;i<b.value.length;i++){
      var d=b.value[i];
      for (var j=c.length-1;j>=0;j--){
        if (equal(c[j],b.value[i]).value){
          c.splice(i,1);
          break;
        }
      }
    }
    return normalize(c);
  }else if (t=="variable"){
    return create(t,subtract(a.value,b.value));
  }
}
function sub(a,b){
  return subtract(a,b);
}

function multiply(a,b){
  var x=alignType(a,b);
  var ca=a;
  var cb=b;
  a=x[0];
  b=x[1];
  var t=x[2];
  if (["int","uint","float","double"].includes(t)){
    return normalize(create(t,a.value*b.value));
  }else if (["superint","superuint"].includes(t)){
    return normalize(create(t,a.value.times(b.value)));
  }else if (t=="boolean"){
    return normalize(create(t,a.value&&b.value));
  }else if (ca.type=="str"){
    var c="";
    var d=convert("int",cb);
    for (var i=0;i<d.value;i++){
      c+=ca.value;
    }
    return normalize(create("str",c));
  }else if (ca.type=="array"){
    var c=[];
    var d=convert("int",cb);
    var e=ca.value.slice(0);
    for (var i=0;i<d.value;i++){
      for (var j=0;j<e.length;j++){
        c.push(e[j]);
      }
    }
    return normalize(create("array",c));
  }else if (t=="variable"){
    return create(t,multiply(a.value,b.value));
  }
}
function mul(a,b){
  return multiply(a,b);
}

function divide(a,b){
  var x=alignType(a,b);
  var ca=a;
  var cb=b;
  a=x[0];
  b=x[1];
  var t=x[2];
  if (["int","uint","float","double"].includes(t)){
    return normalize(create(t,a.value/b.value));
  }else if (["superint","superuint"].includes(t)){
    return normalize(create(t,a.value.divide(b.value)));
  }else if (t=="variable"){
    return create(t,divide(a.value,b.value));
  }
}
function div(a,b){
  return divide(a,b);
}

function modulo(a,b){
  var x=alignType(a,b);
  var ca=a;
  var cb=b;
  a=x[0];
  b=x[1];
  var t=x[2];
  if (["int","uint","float","double"].includes(t)){
    return normalize(create(t,a.value%b.value));
  }else if (["superint","superuint"].includes(t)){
    return normalize(create(t,a.value.mod(b.value)));
  }else if (t=="variable"){
    return create(t,modulo(a.value,b.value));
  }
}
function mod(a,b){
  return modulo(a,b);
}

function power(a,b){
  var x=alignType(a,b);
  var ca=a;
  var cb=b;
  a=x[0];
  b=x[1];
  var t=x[2];
  if (["int","uint","superint","superuint"].includes(t)){
    return normalize(create(t,new bigInt(a.value).pow(b.value)));
  }else if (["float","double"].includes(t)){
    return normalize(create(t,Math.pow(a.value,b.value)));
  }else if (t=="variable"){
    return create(t,divide(a.value,b.value));
  }
}
function pow(a,b){
  return power(a,b);
}

var factorialCache=[new bigInt(1)];
function factorial(a){
  a=clone(a);
  var t=a.type;
  if (["int","uint"].includes(t)){
    var b=a.value;
    if (b<0){
      return normalize(create(t,0));
    }
    while (factorialCache.length<=b){
      factorialCache.push(factorialCache[factorialCache.length-1].times(factorialCache.length));
    }
    return normalize(create(t,factorialCache[b].mod(4294967296).toJSNumber()));
  }else if (["float","double"].includes(t)){
    var b=Math.floor(a.value);
    if (b<0){
      return normalize(create(t,0));
    }
    while (factorialCache.length<=Math.min(b,172)){
      factorialCache.push(factorialCache[factorialCache.length-1].times(factorialCache.length));
    }
    if (b>=172){
      return normalize(create(t,Infinity));
    }
    return normalize(create(t,factorialCache[b].toJSNumber()));
  }else if (["superint","superuint"].includes(t)){
    var b=a.value;
    if (b.lt(0)){
      return normalize(create(t,0));
    }
    while (b.geq(factorialCache.length)){
      factorialCache.push(factorialCache[factorialCache.length-1].times(factorialCache.length));
    }
    return normalize(create(t,factorialCache[b]));
  }else if (t=="variable"){
    return create(t,factorial(a.value));
  }
}
function fac(a){
  return factorial(a);
}

function permutation(a,b){
  var x=alignType(a,b);
  var ca=a;
  var cb=b;
  a=x[0];
  b=x[1];
  return divide(factorial(a),factorial(subtract(a,b)));
}
function prm(a){
  return permutation(a);
}

function combination(a,b){
  var x=alignType(a,b);
  var ca=a;
  var cb=b;
  a=x[0];
  b=x[1];
  return divide(factorial(a),multiply(factorial(subtract(a,b)),factorial(b)));
}
function cmb(a){
  return permutation(a);
}

function arrangementArrayOfLength(n){
  if (typeof n=="object"){
    n=convert("int",n).value;
  }
  if (n==0){
    return [[]];
  }
  var a=[];
  var b=arrangementArrayOfLength(n-1).value;
  var l=b.length;
  for (var i=0;i<n;i++){
    for (var j=0;j<l;j++){
      var e=b[j].value;
      for (var k=0;k<n-1;k++){
        if (e[k].value>=i){
          e[k]=add(e[k],create("int",1));
        }
      }
      e.unshift(i);
      a.push(create("array",e));
    }
  }
  return create("array",a);
}

function permutationArrayOfLength(n,m){
  if (typeof n=="object"){
    n=convert("int",n).value;
  }
  if (m===undefined){
    m=n;
  }else if (typeof m=="object"){
    m=convert("int",m).value;
  }
  if (n==0){
    return [[]];
  }
  var a=combinationArrayOfLength(n).value.filter(function(e){return e.length<=m});
  var b=[];
  for (var i=0;i<a.length;i++){
    var e=a[i].value;
    var r=mapArrayToArray(e,arrangementArrayOfLength(e.length));
    for (var j=0;j<r.length;j++){
      b.push(r[j]);
    }
  }
  return create("array",b);
}

function combinationArrayOfLength(n,m){
  if (typeof n=="object"){
    n=convert("int",n).value;
  }
  if (m===undefined){
    m=n;
  }else if (typeof m=="object"){
    m=convert("int",m).value;
  }
  if (n==0){
    return [[]];
  }
  var a=permutationArrayOfLength(n-1).value.filter(function(e){return e.length<m});
  var l=a.length;
  for (var i=0;i<l*2;i+=2){
    var e=a[i].value;
    for (var j=0;j<e.length;j++){
      e[j]=add(e[j],create("int",0));
    }
    e=e.slice(0);
    a[i]=create("array",e);
    e.unshift(create("int",0));
    a.unshift(create("array",e))
  }
  return create("array",a);
}

function mapStrToArray(s,a){
  if (typeof s=="object"){
    s=convert("str",s).value;
  }
  if (typeof a=="object"){
    a=convert("array",a).value;
  }
  var l=s.length;
  var q="";
  for (var i=0;i<a.length;i++){
    var r=convert("int",e[i]).value;
    if (r>=l){
      q+="\u0000";
    }else{
      q+=s[r];
    }
  }
  return create("str",q);
}

function mapStrToArrays(s,a){
  if (typeof s=="object"){
    s=convert("str",s).value;
  }
  if (typeof a=="object"){
    a=convert("array",a).value;
  }
  var l=s.length;
  var r=[];
  for (var i=0;i<a.length;i++){
    var e=a[i];
    r.push(mapStrToArray(s,e));
  }
  return create("array",r);
}

function mapArrayToArray(s,a){
  if (typeof s=="object"){
    s=convert("array",s).value;
  }
  if (typeof a=="object"){
    a=convert("array",a).value;
  }
  var l=s.length;
  var q="";
  for (var i=0;i<a.length;i++){
    var r=convert("int",e[i]).value;
    if (r>=l){
      q.push(create("int",0));
    }else{
      q.push(s[r]);
    }
  }
  return create("str",q);
}

function mapArrayToArrays(s,a){
  if (typeof s=="object"){
    s=convert("str",s).value;
  }
  if (typeof a=="object"){
    a=convert("array",a).value;
  }
  var l=s.length;
  var r=[];
  for (var i=0;i<a.length;i++){
    var e=a[i];
    r.push(mapArrayToArray(s,e));
  }
  return create("array",r);
}

function convertToBinary(value){
  var value=clone(value);
  var t=value.type;
  if (t=="int"){
    var v=value.value;
    var a=Math.abs(v);
    var b="";
    for (var i=0;i<32;i++){
      b=(a&1)+b;
      a>>=1;
    }
    if (v<0){
      return "1"+invertRawBinary(b);
    }else{
      return "0"+b;
    }
  }else if (t=="uint"){
    var v=value.value;
    var b="";
    for (var i=0;i<=32;i++){
      b=(v&1)+b;
      v>>=1;
    }
    return b;
  }else if (t=="superint"){
    var v=value.value;
    var a=v.abs();
    var b="";
    do{
      b=a.and(1)+b;
      a=a.shiftRight(1);
    }while (a.geq(0));
    if (v<0){
      return "1"+invertRawBinary(b);
    }else{
      return "0"+b;
    }
  }else if (t=="superuint"){
    var v=value.value;
    var b="";
    do{
      b=v.and(1)+b;
      v=v.shiftRight(1);
    }while (v.geq(0));
    return b;
  }else if (t=="float"){
    var sign;
    var exponent;
    var fraction;
    var v=value.value;
    if (v<0){
      sign="1";
    }else{
      sign="0";
    }
    v=Math.abs(v);
    if (v===0){ //0
      exponent="00000000";
      fraction="00000000000000000000000";
    }else if (!isFinite(v)){
      exponent="11111111";
      if (isNaN(v)){ //NaN
        fraction="10000000000000000000001";
      }else{ //Infinity
        fraction="00000000000000000000000";
      }
    }else{
      exponent=0x7f;
      while (v<1){
        exponent--;
        v*=2;
      }
      while (v>=2){
        exponent++;
        v/=2;
      }
      exponent=exponent.toString(2);
      while (exponent.length<8){
        exponent="0"+exponent;
      }
      fraction="";
      for (var i=0;i<23;i++){
        v*=2;
        fraction+=v&1;
      }
    }
    return sign+exponent+fraction;
  }else if (t=="double"){
    var sign;
    var exponent;
    var fraction;
    var v=value.value;
    if (v<0){
      sign="1";
    }else{
      sign="0";
    }
    v=Math.abs(v);
    if (v===0){ //0
      exponent="00000000000";
      fraction="0000000000000000000000000000000000000000000000000000";
    }else if (!isFinite(v)){
      exponent="11111111111";
      if (isNaN(v)){ //NaN
        fraction="1000000000000000000000000000000000000000000000000001";
      }else{ //Infinity
        fraction="0000000000000000000000000000000000000000000000000000";
      }
    }else{
      exponent=0x3ff;
      while (v<1){
        exponent--;
        v*=2;
      }
      while (v>=2){
        exponent++;
        v/=2;
      }
      exponent=exponent.toString(2);
      while (exponent.length<11){
        exponent="0"+exponent;
      }
      fraction="";
      for (var i=0;i<52;i++){
        v*=2;
        fraction+=v&1;
      }
    }
    return sign+exponent+fraction;
  }else if (t=="str"){
    var c="";
    for (var i=0;i<value.value;i++){
      var d=value.value[i].toString(2);
      if (d.length==16){
        c+=d;
      }else{
        c+="0".repeat(16-d.length)+d;
      }
    }
    return c;
  }
}

function invertRawBinary(binaryValue){
  return binaryValue.replace(/0/g,"a").replace(/1/g,"0").replace(/a/g,"1");
}

function convertFromBinary(value,type){
  if (type=="int"){
    var v=value.substring(value.length-32);
    var s=v[0];
    var r=v.substring(1);
    var j=0;
    if (s=="0"){
      for (var i=0;i<32;i++){
        j=(j<<1)+Number(r[i]);
      }
      return create(type,j);
    }else{
      r=invertRawBinary(r);
      for (var i=0;i<32;i++){
        j=(j<<1)+Number(r[i]);
      }
      return create(type,-j);
    }
  }else if (type=="uint"){
    var v=value.substring(value.length-32);
    var j=0;
    for (var i=0;i<=32;i++){
      j=(j<<1)+Number(v[i]);
    }
    return create(type,j);
  }else if (type=="superint"){
    var v=value;
    var s=v[0];
    var r=v.substring(1);
    var j=bigInt(0);
    if (s=="0"){
      for (var i=0;i<r.length;i++){
        j=j.shiftLeft(1).add(r[i]);
      }
      return create(type,j);
    }else{
      r=invertRawBinary(r);
      for (var i=0;i<r.length;i++){
        j=j.shiftLeft(1).add(r[i]);
      }
      return create(type,j.negate());
    }
  }else if (type=="superuint"){
    var v=value;
    var j=bigInt(0);
    for (var i=0;i<v.length;i++){
      j=j.shiftLeft(1).add(v[i]);
    }
    return create(type,j);
  }else if (type=="float"){
    var v=value.substring(0,32);
    var sign=v[0];
    var exponent=v.substring(1,9);
    var fraction=v.substring(9);
    var actual=1;
    if (exponent=="11111111"){
      if (fraction=="00000000000000000000000"){
        actual=Infinity;
      }else{
        actual=NaN;
      }
    }else{
      for (var i=0;i<23;i++){
        actual+=fraction[i]*Math.pow(2,-i);
      }
    }
    return create(type,doubleToFloat(actual*Math.pow(2,parseInt(exponent,2)-127)*Math.pow(-1,parseInt(sign,2))));
  }else if (type=="double"){
    var v=value.substring(0,64);
    var sign=v[0];
    var exponent=v.substring(1,12);
    var fraction=v.substring(12);
    var actual=1;
    if (exponent=="11111111111"){
      if (fraction=="0000000000000000000000000000000000000000000000000000"){
        actual=Infinity;
      }else{
        actual=NaN;
      }
    }else{
      for (var i=0;i<52;i++){
        actual+=fraction[i]*Math.pow(2,-i);
      }
    }
    return create(type,actual*Math.pow(2,parseInt(exponent,2)-127)*Math.pow(-1,parseInt(sign,2)));
  }else if (type=="str"){
    var v=value;
    while (v.length%16!==0){
      v+="0";
    }
    var r="";
    for (var i=0;i<v.length;i+=16){
      r+=String.fromCharCode(parseInt(v.substring(i,i+16),2));
    }
    return create(type,r);
  }
}