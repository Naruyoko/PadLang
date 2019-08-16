function alignType(a,b){
  if (a.type=="variable"&&b.type=="variable"){
    return [a,b,"variable"];
  }else if (a.type=="variable"){
    return alignType(a.value,b);
  }else if (b.type=="variable"){
    return alignType(a,b.value);
  }else if (!a.type||!b.type){
    throw "What?";
  }
  var types=["int","uint","superint","superuint","float","double","boolean","str","array","object"];
  /*
  int - 0
  uint - 1
  superint - 2
  superuint - 3
  float - 4
  double - 5
  boolean - 6
  str - 7
  array - 8
  object - 9
  */
  var convtable=[
    //second
    //0  1  2  3  4  5  6  7  8  9
    [ 0, 0, 2, 2, 4, 5, 0, 7, 8, 9], //0  f
    [ 1, 1, 3, 3, 4, 5, 1, 7, 8, 9], //1  i
    [ 2, 2, 2, 2, 4, 5, 2, 7, 8, 9], //2  r
    [ 3, 3, 3, 3, 4, 5, 3, 7, 8, 9], //3  s
    [ 4, 4, 4, 4, 4, 5, 4, 7, 8, 9], //4  t
    [ 5, 5, 5, 5, 5, 5, 5, 7, 8, 9], //5
    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], //6
    [ 7, 7, 7, 7, 7, 7, 7, 7, 7, 9], //7
    [ 8, 8, 8, 8, 8, 8, 8, 7, 8, 9], //8
    [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]  //9
  ];
  var t=types[convtable[types.indexOf(a.type)][types.indexOf(b.type)]];
  return [convert(t,a),convert(t,b),t];
}

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
  if ((typeof a=="string"||typeof b=="string")&&a!=b){
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