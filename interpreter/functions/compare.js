function lessThan(a,b){
  var x=alignType(a,b);
  a=x[0];
  b=x[1];
  var t=x[2];
  if (["int","uint","float","double"].includes(t)){
    return create("boolean",a.value<b.value);
  }else if (["superint","superuint"].includes(t)){
    return create("boolean",a.value.lt(b.value));
  }else if (t=="boolean"){
    return create("boolean",!a.value&&b.value)
  }else if (t=="str"){
    if (a.value.length>b.value.length){
      return create("boolean",false);
    }
    for (var i=0;i<a.value.length;i++){
      if (charCodeAt(a).value<charCodeAt(b).value){
        return create("boolean",true);
      }else if (charCode(a).value>charCodeAt(b).value){
        return create("boolean",false);
      }
    }
    return create("boolean",a.value.length!=b.value.length);
  }else if (t=="array"){
    if (a.value.length>b.value.length){
      return create("boolean",false);
    }
    for (var i=0;i<a.value.length;i++){
      if (lessThan(charCodeAt(a).value,charCodeAt(b).value)){
        return create("boolean",true);
      }else if (greaterThan(charCode(a).value>charCodeAt(b).value)){
        return create("boolean",false);
      }
    }
    return create("boolean",a.value.length!=b.value.length);
  }else if (t=="object"){
    return create("boolean",false);
  }else if (t=="variable"){
    return lessThan(a.value,b.value);
  }
}
function lt(a,b){
  return lessThan(a,b);
}
function lessThanOrEqual(a,b){
  return create("boolean",equal(a,b).value||lessThan(a,b).value);
}
function lte(a,b){
  return lessThanOrEqual(a,b);
}

function greaterThan(a,b){
  var x=alignType(a,b);
  a=x[0];
  b=x[1];
  var t=x[2];
  if (["int","uint","float","double"].includes(t)){
    return create("boolean",a.value>b.value);
  }else if (["superint","superuint"].includes(t)){
    return create("boolean",a.value.gt(b.value));
  }else if (t=="boolean"){
    return create("boolean",a.value&&!b.value)
  }else if (t=="str"){
    if (a.value.length<b.value.length){
      return create("boolean",false);
    }
    for (var i=0;i<a.value.length;i++){
      if (charCodeAt(a).value>charCodeAt(b).value){
        return create("boolean",true);
      }else if (charCode(a).value<charCodeAt(b).value){
        return create("boolean",false);
      }
    }
    return create("boolean",a.value.length!=b.value.length);
  }else if (t=="array"){
    if (a.value.length<b.value.length){
      return create("boolean",false);
    }
    for (var i=0;i<a.value.length;i++){
      if (greaterThan(charCodeAt(a).value,charCodeAt(b).value)){
        return create("boolean",true);
      }else if (greaterThan(charCode(a).value>charCodeAt(b).value)){
        return create("boolean",false);
      }
    }
    return create("boolean",a.value.length!=b.value.length);
  }else if (t=="object"){
    return create("boolean",false);
  }else if (t=="variable"){
    return greaterThan(a.value,b.value);
  }
}
function gt(a,b){
  return greaterThan(a,b);
}
function greaterThanOrEqual(a,b){
  return create("boolean",equal(a,b).value||greaterThan(a,b).value);
}
function gte(a,b){
  return greaterThanOrEqual(a,b);
}

function equal(a,b){
  if (a.special!=b.special){
    return create("boolean",false);
  }
  if (typeof a!=typeof b){
    return create("boolean",false);
  }
  if (["number","string"].includes(typeof a)&&a!=b){
    return create("boolean",false);
  }
  if (a instanceof Array&&b instanceof Array){
    if (a.length!=b.length){
      return false;
    }
    for (var i=0;i<a.length;i++){
      if (!equal(a[i],b[i])){
        return false;
      }
    }
    return true;
  }
  if (a==b){
    return create("boolean",true);
  }
  if (!equal(a.type,b.type)){
    return create("boolean",false);
  }
  return equal(a.value,b.value);
}
function eq(a,b){
  return equal(a,b);
}