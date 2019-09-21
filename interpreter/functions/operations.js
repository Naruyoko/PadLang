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

function binary(value){
  var value=clone(value);
  if (["int","uint","superint","superuint"].includes(value.type)){
    var s="";
    while(greaterThan(value,create("int",2))){
      s=modulo(value,2).value+s;
      value=divide(value,2);
    }
    return s;
  }else if (["float","double"].includes(value.type)){
    //TODO:
  }else if (value.type=="str"){
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

function invertBinary(binaryValue){
  return binaryValue.replace(/0/g,"a").replace(/1/g,"0").replace(/a/g,"1");
}