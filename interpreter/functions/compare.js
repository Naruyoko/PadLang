function alignType(a,b){
  if (a.type=="variable"&&b.type=="variable"){
    return [a,b];
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
  return [convert(t,a),convert(t,b)];
}

function lessThan(a,b){
  var x=alignType(a,b);
}
function lessThanOrEqual(a,b){
  return equal(a,b)||lessThan(a,b);
}

function greaterThan(a,b){
  var x=alignType(a,b);
}
function greaterThanOrEqual(a,b){
  return equal(a,b)||greaterThan(a,b);
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