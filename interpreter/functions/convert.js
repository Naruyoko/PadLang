function convert(type,value){
  var value=clone(value);
  if (type==value.type){
    return clone(value);
  }else if (type=="int"){
    convertToInt(value);
  }else if (type=="uint"){
    convertToUint(value);
  }else if (type=="superint"){
    convertToSuperint(value);
  }else if (type=="superuint"){
    convertToSuperuint(value);
  }else if (type=="float"){
    convertToFloat(value);
  }else if (type=="double"){
    convertToDouble(value);
  }else if (type=="boolean"){
    convertToBoolean(value);
  }else if (type=="str"){
    convertToStr(value);
  }else if (type=="array"){
    convertToArray(value);
  }else if (type=="object"){
    convertToObject(value);
  }else if (type=="variable"){
    convertToVariable(value);
  }
}

function convertToInt(value){
  var value=clone(value);
  if (value.type=="int"){
    return value;
  }else if (value.type=="uint"){
    value.type="int";
    return normalize(value);
  }else if (value.type=="superint"){
    value.type="int";
    value.value=value.value.mod(4294967296);
    if (value.value.gte(2147483648)){
      value.value=value.value.sub(4294967296);
    }
    value.value=value.value.toNumber();
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="int";
    value.value=value.value.mod(4294967296);
    if (value.value.gte(2147483648)){
      value.value=value.value.sub(4294967296);
    }
    value.value=value.value.toNumber();
    return normalize(value);
  }else if (value.type=="float"){
    value.type="int";
    return normalize(value);
  }else if (value.type=="double"){
    value.type="int";
    return normalize(value);
  }else if (value.type=="boolean"){
    if (value.value){
      value=create("int",1);
    }else{
      value=create("int",0);
    }
    return normalize(value);
  }else if (value.type=="str"){
    if (value.value.search(/[^0-9\-]/g)==-1&&value.value.substring(1).search(/[^0-9]/g)==-1){
      value.type="superint";
      value.value=bigInt(value.value);
      return convertToInt(value);
    }else{
      return create("int",0);
    } 
  }else if (value.type=="array"){
    if (equal(length(value),create("int",0))){
      return create("int",0);
    }else{
      return convertToInt(getAt(value,create("int",0)));
    }
  }else if (value.type=="object"){
    return create("int",0);
  }else if (value.type=="variable"){
    return convertToInt(value.value);
  }
}

function convertToUint(value){
  var value=clone(value);
  if (value.type=="int"){
    value.type="uint";
    return normalize(value);
  }else if (value.type=="uint"){
    return value;
  }else if (value.type=="superint"){
    value.type="uint";
    value.value=value.value.mod(4294967296);
    if (value.value.gte(4294967296)){
      value.value=value.value.sub(4294967296);
    }
    value.value=value.value.toNumber();
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="uint";
    value.value=value.value.mod(4294967296);
    if (value.value.gte(4294967296)){
      value.value=value.value.sub(4294967296);
    }
    value.value=value.value.toNumber();
    return normalize(value);
  }else if (value.type=="float"){
    value.type="uint";
    return normalize(value);
  }else if (value.type=="double"){
    value.type="uint";
    return normalize(value);
  }else if (value.type=="boolean"){
    if (value.value){
      value=create("uint",1);
    }else{
      value=create("uint",0);
    }
    return normalize(value);
  }else if (value.type=="str"){
    if (value.value.search(/[^0-9\-]/g)==-1&&value.value.substring(1).search(/[^0-9]/g)==-1){
      value.type="superint";
      value.value=bigInt(value.value);
      return convertToUint(value);
    }else{
      return create("superint",0);
    } 
  }else if (value.type=="array"){
    if (equal(length(value),create("int",0))){
      return create("uint",0);
    }else{
      return convertToUint(getAt(value,create("int",0)));
    }
  }else if (value.type=="object"){
    return create("uint",0);
  }else if (value.type=="variable"){
    return convertToUint(value.value);
  }
}

function convertToSuperint(value){
  var value=clone(value);
  if (value.type=="int"){
    value.type="superint";
    value.value=bigInt(value.value);
    return normalize(value);
  }else if (value.type=="uint"){
    value.type="superint";
    value.value=bigInt(value.value);
    return normalize(value);
  }else if (value.type=="superint"){
    return value;
  }else if (value.type=="superuint"){
    value.type="superint";
    return normalize(value);
  }else if (value.type=="float"){
    value.type="superint";
    value.value=bigInt(Math.floor(value.value));
    return normalize(value);
  }else if (value.type=="double"){
    value.type="superint";
    value.value=bigInt(Math.floor(value.value));
    return normalize(value);
  }else if (value.type=="boolean"){
    if (value.value){
      value=create("superint",new bigInt(1));
    }else{
      value=create("superint",new bigInt(0));
    }
    return normalize(value);
  }else if (value.type=="str"){
    if (value.value.search(/[^0-9\-]/g)==-1&&value.value.substring(1).search(/[^0-9]/g)==-1){
      value.type="superint";
      value.value=bigInt(value.value);
      return normalize(value);
    }else{
      return create("superint",new bigInt(0));
    } 
  }else if (value.type=="array"){
    if (equal(length(value),create("int",0))){
      return create("superint",new bigInt(0));
    }else{
      return convertToSuperint(getAt(value,create("int",0)));
    }
  }else if (value.type=="object"){
    return create("superint",new bigInt(0));
  }else if (value.type=="variable"){
    return convertToSuperint(value.value);
  }
}

function convertToSuperuint(value){
  var value=clone(value);
  if (value.type=="int"){
    value.type="superuint";
    value.value=bigInt(value.value);
    return normalize(value);
  }else if (value.type=="uint"){
    value.type="superuint";
    value.value=bigInt(value.value);
    return normalize(value);
  }else if (value.type=="superint"){
    value.type="superuint";
    return normalize(value);
  }else if (value.type=="superuint"){
    return value;
  }else if (value.type=="float"){
    value.type="superuint";
    value.value=bigInt(Math.floor(value.value));
    return normalize(value);
  }else if (value.type=="double"){
    value.type="superuint";
    value.value=bigInt(Math.floor(value.value));
    return normalize(value);
  }else if (value.type=="boolean"){
    if (value.value){
      value=create("superuint",new bigInt(1));
    }else{
      value=create("superuint",new bigInt(0));
    }
    return normalize(value);
  }else if (value.type=="str"){
    if (value.value.search(/[^0-9\-]/g)==-1&&value.value.substring(1).search(/[^0-9]/g)==-1){
      value.type="superuint";
      value.value=bigInt(value.value);
      return normalize(value);
    }else{
      return create("superuint",new bigInt(0));
    } 
  }else if (value.type=="array"){
    if (equal(length(value),create("int",0))){
      return create("superuint",new bigInt(0));
    }else{
      return convertToSuperuint(getAt(value,create("int",0)));
    }
  }else if (value.type=="object"){
    return create("superuint",0);
  }else if (value.type=="variable"){
    return convertToSuperuint(value.value);
  }
}

function convertToFloat(value){
  var value=clone(value);
  if (value.type=="int"){
    value.type="float";
    return normalize(value);
  }else if (value.type=="uint"){
    value.type="float";
    return normalize(value);
  }else if (value.type=="superint"){
    value.type="float";
    value.value=doubleToFloat(value.value.toNumber());
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="float";
    value.value=doubleToFloat(value.value.toNumber());
    return normalize(value);
  }else if (value.type=="float"){
    return value;
  }else if (value.type=="double"){
    value.type="float";
    value.value=doubleToFloat(value.value);
    return normalize(value);
  }else if (value.type=="boolean"){
    if (value.value){
      value=create("float",1);
    }else{
      value=create("float",0);
    }
    return normalize(value);
  }else if (value.type=="str"){
    if (value.value.search(/[^0-9\.\-]/g)==-1&&value.value.substring(1).search(/[^0-9\.]/g)==-1&&!value.value.match(/\./g)&&value.value.match(/\./g).length<2){
      value.type="float";
      value.value=doubleToFloat(parseFloat(value.value));
      return normalize(value);
    }else{
      return create("float",0);
    } 
  }else if (value.type=="array"){
    if (equal(length(value),create("int",0))){
      return create("float",0);
    }else{
      return convertToFloat(getAt(value,create("int",0)));
    }
  }else if (value.type=="object"){
    return create("float",0);
  }else if (value.type=="variable"){
    return convertToFloat(value.value);
  }
}

function convertToDouble(value){
  var value=clone(value);
  if (value.type=="int"){
    value.type="double";
    return normalize(value);
  }else if (value.type=="uint"){
    value.type="double";
    return normalize(value);
  }else if (value.type=="superint"){
    value.type="double";
    value.value=value.value.toNumber();
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="double";
    value.value=value.value.toNumber();
    return normalize(value);
  }else if (value.type=="float"){
    value.type="double";
    return normalize(value);
  }else if (value.type=="double"){
    return value;
  }else if (value.type=="boolean"){
    if (value.value){
      value=create("double",1);
    }else{
      value=create("double",0);
    }
    return normalize(value);
  }else if (value.type=="str"){
    if (value.value.search(/[^0-9\.\-]/g)==-1&&value.value.substring(1).search(/[^0-9\.]/g)==-1&&!value.value.match(/\./g)&&value.value.match(/\./g).length<2){
      value.type="double";
      value.value=parseFloat(value.value);
      return normalize(value);
    }else{
      return create("double",0);
    } 
  }else if (value.type=="array"){
    if (equal(length(value),create("int",0))){
      return create("double",0);
    }else{
      return convertToDouble(getAt(value,create("int",0)));
    }
  }else if (value.type=="object"){
    return create("double",0);
  }else if (value.type=="variable"){
    return convertToDouble(value.value);
  }
}

function convertToBoolean(value){
  var value=clone(value);
  if (value.type=="int"){
    value.type="boolean";
    value.value=value.value!=0;
    return normalize(value);
  }else if (value.type=="uint"){
    value.type="boolean";
    value.value=value.value!=0;
    return normalize(value);
  }else if (value.type=="superint"){
    value.type="boolean";
    value.value=!value.value.eq(0);
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="boolean";
    value.value=!value.value.eq(0);
    return normalize(value);
  }else if (value.type=="float"){
    value.type="boolean";
    value.value=value.value!=0;
    return normalize(value);
  }else if (value.type=="double"){
    value.type="boolean";
    value.value=value.value!=0;
    return normalize(value);
  }else if (value.type=="boolean"){
    return value;
  }else if (value.type=="str"){
    if (value.value=="false"){
      return create("boolean",false);
    }else if (value.value=="true"){
      return create("boolean",true);
    }else{
      return convertToBoolean(convertToDouble(value));
    }
  }else if (value.type=="array"){
    value.type="boolean";
    value.value=value.value.length==0;
    return normalize(value);
  }else if (value.type=="object"){
    value.type="boolean";
    value.value=value.value.length==0;
    return normalize(value);
  }else if (value.type=="variable"){
    return convertToBoolean(value.value);
  }
}

function convertToStr(value){
  var value=clone(value);
  if (value.type=="int"){
    value.type="str";
    value.value=String(value.value);
    return normalize(value);
  }else if (value.type=="uint"){
    value.type="str";
    value.value=String(value.value);
    return normalize(value);
  }else if (value.type=="superint"){
    value.type="str";
    value.value=value.value.toString();
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="str";
    value.value=value.value.toString();
    return normalize(value);
  }else if (value.type=="float"){
    value.type="str";
    value.value=String(value.value);
    return normalize(value);
  }else if (value.type=="double"){
    value.type="str";
    value.value=String(value.value);
    return normalize(value);
  }else if (value.type=="boolean"){
    if (value.value){
      value=create("str","true");
    }else{
      value=create("str","false");
    }
    return normalize(value);
  }else if (value.type=="str"){
    return value;
  }else if (value.type=="array"){
    var s=create("str","");
    for (var i=0;i<length(value).value;i++){
      if (i!==0){
        s=add(s,create("str",","));
      }
      s=add(s,convertToString(getAt(value,create("int",i))));
    }
    return add(create("str","[").add(s,create("str","]")));
  }else if (value.type=="object"){
    var s=create("str","");
    for (var i=0;i<length(value).value;i++){
      if (i!==0){
        s=add(s,create("str",","));
      }
      var p=value.value[i];
      s=add(s,add(convertToString(value,create("int",i)[0]),add(create("str",":"),convertToString(value,create("int",i)[1]))));
    }
    return add(create("str","{").add(s,create("str","}")));
  }else if (value.type=="variable"){
    return convertToString(value.value);
  }
}

function convertToArray(value){
  var value=clone(value);
  var cvalue=clone(value);
  if (value.type=="int"){
    value.type="array";
    value.value=[cvalue];
    return normalize(value);
  }else if (value.type=="uint"){
    value.type="array";
    value.value=[cvalue];
    return normalize(value);
  }else if (value.type=="superint"){
    value.type="array";
    value.value=[cvalue];
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="array";
    value.value=[cvalue];
    return normalize(value);
  }else if (value.type=="float"){
    value.type="array";
    value.value=[cvalue];
    return normalize(value);
  }else if (value.type=="double"){
    value.type="array";
    value.value=[cvalue];
    return normalize(value);
  }else if (value.type=="str"){
    value.type="array";
    value.value=[cvalue];
    return normalize(value);
  }else if (value.type=="array"){
    return value;
  }else if (value.type=="object"){
    value.type="array";
    value.value=[cvalue];
    return normalize(value);
  }else if (value.type=="variable"){
    value.type="array";
    value.value=[cvalue];
    return normalize(value);
  }
}

function convertToObject(value){
  var value=clone(value);
  var cvalue=clone(value);
  if (value.type=="int"){
    value.type="object";
    value.value=[[create("int",0),cvalue]];
    return normalize(value);
  }else if (value.type=="uint"){
    value.type="object";
    value.value=[[create("int",0),cvalue]];
    return normalize(value);
  }else if (value.type=="superint"){
    value.type="object";
    value.value=[[create("int",0),cvalue]];
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="object";
    value.value=[[create("int",0),cvalue]];
    return normalize(value);
  }else if (value.type=="float"){
    value.type="object";
    value.value=[[create("int",0),cvalue]];
    return normalize(value);
  }else if (value.type=="double"){
    value.type="object";
    value.value=[[create("int",0),cvalue]];
    return normalize(value);
  }else if (value.type=="str"){
    value.type="object";
    value.value=[];
    for (var i=0;i<value.value,length;i++){
      value.value.push[create("int",i),cvalue.value.charAt(i)];
    }
    return normalize(value);
  }else if (value.type=="array"){
    value.type="object";
    value.value=[];
    for (var i=0;i<value.value,length;i++){
      value.value.push[create("int",i),cvalue.value[i]];
    }
    return normalize(value);
  }else if (value.type=="object"){
    return value;
  }else if (value.type=="variable"){
    value.type="object";
    value.value=[[create("int",0),cvalue]];
    return normalize(value);
  }
}

function convertToVariable(value){
  var value=clone(value);
  if (value.type=="int"){
    value.type="variable";
    value.value=value;
    return normalize(value);
  }else if (value.type=="uint"){
    value.type="variable";
    value.value=value;
    return normalize(value);
  }else if (value.type=="superint"){
    value.type="variable";
    value.value=value;
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="variable";
    value.value=value;
    return normalize(value);
  }else if (value.type=="float"){
    value.type="variable";
    value.value=value;
    return normalize(value);
  }else if (value.type=="double"){
    value.type="variable";
    value.value=value;
    return normalize(value);
  }else if (value.type=="str"){
    value.type="variable";
    value.value=value;
    return normalize(value);
  }else if (value.type=="array"){
    value.type="variable";
    value.value=value;
    return normalize(value);
  }else if (value.type=="object"){
    value.type="variable";
    value.value=value;
    return normalize(value);
  }else if (value.type=="variable"){
    return value;
  }
}

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