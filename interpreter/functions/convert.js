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
  }else if (value.type=="string"){
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
  }else if (value.type=="string"){
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
  }else if (value.type=="string"){
    if (value.value.search(/[^0-9\-]/g)==-1&&value.value.substring(1).search(/[^0-9]/g)==-1){
      value.type="superint";
      value.value=bigInt(value.value);
      return normalize(value);
    }else{
      return create("superint",0);
    } 
  }else if (value.type=="array"){
    if (equal(length(value),create("int",0))){
      return create("superint",0);
    }else{
      return convertToSuperint(getAt(value,create("int",0)));
    }
  }else if (value.type=="object"){
    return create("superint",0);
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
  }else if (value.type=="string"){
    if (value.value.search(/[^0-9\-]/g)==-1&&value.value.substring(1).search(/[^0-9]/g)==-1){
      value.type="superuint";
      value.value=bigInt(value.value);
      return normalize(value);
    }else{
      return create("superuint",0);
    } 
  }else if (value.type=="array"){
    if (equal(length(value),create("int",0))){
      return create("superuint",0);
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
  }else if (value.type=="string"){
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
  }else if (value.type=="string"){
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

function convertToString(value){
  var value=clone(value);
  if (value.type=="int"){
    value.type="string";
    value.value=String(value.value);
    return normalize(value);
  }else if (value.type=="uint"){
    value.type="string";
    value.value=String(value.value);
    return normalize(value);
  }else if (value.type=="superint"){
    value.type="string";
    value.value=value.value.toString();
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="string";
    value.value=value.value.toString();
    return normalize(value);
  }else if (value.type=="float"){
    value.type="string";
    value.value=String(value.value);
    return normalize(value);
  }else if (value.type=="double"){
    value.type="string";
    value.value=String(value.value);
    return normalize(value);
  }else if (value.type=="string"){
    return value;
  }else if (value.type=="array"){
    var s=create("string","");
    for (var i=0;i<length(value).value;i++){
      if (i!==0){
        s=add(s,create("string",","));
      }
      s=add(s,convertToString(getAt(value,create("int",i))));
    }
    return add(create("string","[").add(s,create("string","]")));
  }else if (value.type=="object"){
    var s=create("string","");
    for (var i=0;i<length(value).value;i++){
      if (i!==0){
        s=add(s,create("string",","));
      }
      var p=value.value[i];
      s=add(s,add(convertToString(value,create("int",i)[0]),add(create("string",":"),convertToString(value,create("int",i)[1]))));
    }
    return add(create("string","{").add(s,create("string","}")));
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
  }else if (value.type=="string"){
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
  }else if (value.type=="string"){
    value.type="object";
    value.value=[[create("int",0),cvalue]];
    return normalize(value);
  }else if (value.type=="array"){
    value.type="object";
    value.value=[[create("int",0),cvalue]];
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
  }else if (value.type=="string"){
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