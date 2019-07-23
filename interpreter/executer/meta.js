var memory;
var commands=[];
var commandQueue=[];
function runProgram(){
  programArray=hexProgram.split(" ");
  memory=[];
  memory.push({
    name:"pointer",
    special:true,
    value:create("int",0)
  });
  memory.push({
    name:"direction",
    special:true,
    value:create("int",1)
  });
  memory.push({
    name:"program",
    special:true,
    value:create("str",rawProgram)
  });
  memory.push({
    name:"stack",
    special:true,
    value:create("array",[]);
  });
  //exit when pointer is out of bounds
  while (!(lessThan(read("pointer"),create("int",0))||greaterThan(read("pointer"),length(read("program")))){
    var command=charCodeAt(read("program"),read("pointer));
    if (commands[command]){
      queueCommand(command);
    }
    handleQueuedCommands();
    write("pointer",add(read("pointer"),read("direction")));
  }
}
function queueCommand(command){
  commandStack.push({
    commandHex:command,
    arity:commands[command].arity,
    inputs:[]
  });
}
function handleQueuedCommands(){
  
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
function read(name){
  for (var i=0;i<memory.length;i++){
    if (equal(memory[i].name,name)){
      return clone(memory.value);
    }
  }
  return create("int",0);
}
function write(name,value){
  for (var i=0;i<memory.length;i++){
    if (equal(memory[i].name,name)){
      memory[i].value=clone(value);
    }
  }
  memory.push({
    name:clone(name),
    special:false,
    value:[]
  });
}
function create(type,value){
  return {
    type:type,
    value:clone(value)
  };
}

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
    value.value=value.value.toNumber()
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="int";
    value.value=value.value.mod(4294967296);
    if (value.value.gte(2147483648)){
      value.value=value.value.sub(4294967296);
    }
    value.value=value.value.toNumber()
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
    if (equal(length(value),create("int",0)){
      returrn create("int",0);
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
    value.value=value.value.toNumber()
    return normalize(value);
  }else if (value.type=="superuint"){
    value.type="uint";
    value.value=value.value.mod(4294967296);
    if (value.value.gte(4294967296)){
      value.value=value.value.sub(4294967296);
    }
    value.value=value.value.toNumber()
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
    if (equal(length(value),create("int",0)){
      returrn create("uint",0);
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
    if (equal(length(value),create("int",0)){
      returrn create("superint",0);
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
    if (equal(length(value),create("int",0)){
      returrn create("superuint",0);
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
    if (equal(length(value),create("int",0)){
      returrn create("float",0);
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
    if (equal(length(value),create("int",0)){
      returrn create("double",0);
    }else{
      return convertToDouble(getAt(value,create("int",0)));
    }
  }else if (value.type=="object"){
    return create("double",0);
  }else if (value.type=="variable"){
    return convertToDouble(value.value);
  }
}

function normalize(value){
  var value=clone(value);
  if (value.type=="int"){
    value.value=Math.floor(value.value);
    value.value=value.value%4294967296+4294967296;
    if (value.value>=2147483648){
       value.value-=4294967296;
    }else if (value.value<-2147483649){
       value.value+=4294967296;
    }
    if (!isFinite(value.value)||isNaN(value.value)){
      value.value=0;
    }
    return value;
  }else if (value.type=="uint"){
    value.value=Math.floor(value.value);
    value.value=value.value%4294967296+4294967296;
    if (value.value>=4294967296){
      value.value-=4294967296;
    }else if (value.value<0){
      value.value+=4294967296;
    }
    if (!isFinite(value.value)||isNaN(value.value)){
      value.value=0;
    }
    return value;
  }else if (value.type=="superint"){
    return value;
  }else if (value.type=="superuint"){
    var offset=bigInt.pow(2,value.value.bitLength();
    value.value=value.value.mod(offset).add(offset);
    if (value.value.gte(offset)){
      value.value=value.value.sub(offset);
    }else if (value.value.lt(offset)){
      value.value=value.value.plus(offset);
    }
    return value;
  }else if (value.type=="float"){
    value.value=doubleToFloat(value.value);
    return value;
  }else if (value.type=="double"){
    return value;
  }else if (value.type=="string"){
    return value;
  }else if (value.type=="array"){
    return value;
  }else if (value.type=="object"){
    return value;
  }
}

function binary(value){
  var value=clone(value);
  if (["int","uint","superint","superuint"].includes(value.type){
    var s="";
    while(greaterThan(value,create("int",2))){
      s=modulo(value,2).value+s;
      value=divide(value,2);
    }
    return s;
  }else if (["float","double"].includes(value.type)){
    
  }
}

funciton invertBinary(binaryValue){
  return binaryValue.replace(/0/g,"a").replace(/1/g,"0").replace(/a/g,"1");
}

//function from https://stackoverflow.com/a/4460624
function clone(item) {
    if (!item) { return item; } // null, undefined values check

    var types = [ Number, String, Boolean ], 
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function(type) {
        if (item instanceof type) {
            result = type( item );
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call( item ) === "[object Array]") {
            result = [];
            item.forEach(function(child, index, array) { 
                result[index] = clone( child );
            });
        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                result = item.cloneNode( true );    
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone( item[i] );
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}

//function from https://stackoverflow.com/a/38777853
function doubleToFloat ( d ) {
    if ( Float32Array )
        return new Float32Array( [ d ] )[ 0 ];

    if ( d === 0 )
        return d;

    var sign = 2*(d >= 0) - 1;
    var b = Math.abs( d ).toString( 2 );
    var decimalIndex = b.indexOf( '.' );
    var oneIndex = b.indexOf( '1' );
    var exponent, mantissa, round, result;

    if( decimalIndex === -1 ) {
        exponent = b.length - 1;
        mantissa = b.substr( 1, 23 );
        round = +( mantissa.length === 23 && b[24] === '1' );
        result = sign*( parseInt( '1' + mantissa, 2 ) + round )*Math.pow( 2, exponent - mantissa.length );
    } else if ( decimalIndex === 1 ) {
        exponent = 1 - oneIndex;       
        if ( oneIndex === 0 ) {
            mantissa = '1' + b.substr( 2, 23 );
            round = +( mantissa.length === 24 && b[25] === '1' );
            result = sign*( parseInt( mantissa, 2 ) + round )*Math.pow( 2, 1 - mantissa.length );
        } else {
            mantissa = b.substr( oneIndex, 24 );
            round = +( mantissa.length === 24 && b[oneIndex + 24] === '1' );
            result = sign*( parseInt( mantissa, 2 ) + round )*Math.pow( 2, 1 + exponent - mantissa.length );
        }
    } else {
        exponent = decimalIndex - 1;
        mantissa = b.replace( '.', '' ).substr( 1, 23 );
        round = +( mantissa.length === 23 && b.replace( '.', '' )[24] === '1' );
        result = sign*( parseInt( '1' + mantissa, 2 ) + round )*Math.pow( 2, decimalIndex - mantissa.length - 1 );
    }

    if ( exponent < -126 )
        return 0;
    if ( exponent > 127 )
        return sign*Infinity;

    return result;
}