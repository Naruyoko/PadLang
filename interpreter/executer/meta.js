var memory;
var commands=[];
var commandQueue=[];
function runProgram(){
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
    value:create("array",[])
  });
  //exit when pointer is out of bounds
  while (!(lessThan(read("pointer"),create("int",0))||greaterThan(read("pointer"),length(read("program"))))){
    var command=charCodeAt(read("program"),read("pointer"));
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
    var offset=bigInt.pow(2,value.value.bitLength());
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
  if (["int","uint","superint","superuint"].includes(value.type)){
    var s="";
    while(greaterThan(value,create("int",2))){
      s=modulo(value,2).value+s;
      value=divide(value,2);
    }
    return s;
  }else if (["float","double"].includes(value.type)){
    
  }
}

function invertBinary(binaryValue){
  return binaryValue.replace(/0/g,"a").replace(/1/g,"0").replace(/a/g,"1");
}

function length(value){
  if (["string","array","object"].includes(value.type)){
    return create("int",value.value.length);
  }
  return create("int",0);
}

function getAt(value,index){
  var value=clone(value);
  if (value.type=="string"){
    return create("string",value.value[index.value]);
  }else if (value.type=="array"){
    return value.value[index.value];
  }else if (value.type=="object"){
    for (var i=0;i<length(value).value;i++){
      if (equal(index,value.value[i][0])){
        return value.value[i][1];
      }
    }
    return create("int",0);
  }
  return create("int",0);
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