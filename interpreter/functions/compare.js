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
  return equal(a,b)||lessThan(a,b);
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
  return equal(a,b)||greaterThan(a,b);
}
function gte(a,b){
  return greaterThanOrEqual(a,b);
}

function equal(a,b){
  if (a.special!=b.special){
    return false;
  }
  if ((typeof a=="str"||typeof b=="str")&&a!=b){
    return false;
  }
  if (a==b){
    return true;
  }
  if (!equal(a.name,b.name)){
    return false;
  }
  return equal(a.value,b.value);
}
function eq(a,b){
  return equal(a,b);
}