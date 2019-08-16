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
    return normalize(create(t,a.value.add(b.value)));
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
        if (equal(d,a.value[j][0])){
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
    return normalize(create(t,a.value.sub(b.value)));
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
      if (equal(c[i],cb)){
        c.splice(i,1);
        break;
      }
    }
    return normalize(create("array",c));
  }else if (t=="array"){
    var c=a.value.slice(0);
    for (var i=0;i<b.value.length;i++){
      for (var j=c.length-1;j>=0;j--){
        if (equal(c[j],b.value[i])){
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
        if (equal(c[j],b.value[i])){
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
    return normalize(create(t,a.value.mul(b.value)));
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
    return normalize(create(t,a.value.div(b.value)));
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
    return normalize(create(t,bigInt.pow(a.value,b.value)));
  }else if (["float","double"].includes(t)){
    return normalize(create(t,Math.pow(a.value,b.value)));
  }else if (t=="variable"){
    return create(t,divide(a.value,b.value));
  }
}
function pow(a,b){
  return power(a,b);
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