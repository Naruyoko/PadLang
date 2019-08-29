var memory;
var commandList=[];
var commandQueue;
var preventPointerUpdate;
var forceExitProgram;
var isExecutionBeingPaused;
var mainReadHistory;
function runProgram(resumeMode=false){
  if (resumeMode){

  }else{
    //Let user copy program
    var x=hexProgram;
    do{
      var x=window.prompt("Copy to clipboard: Ctrl+C, Enter",hexProgram);
      if (x===null){
        return;
      }
    }while (hexProgram!=x);
    dg("STDOUT").value="";

    //execution
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
    commandQueue=[];
    forceExitProgram=false;
    mainReadHistory=[];
  }
  isExecutionBeingPaused=false;
  //exit when pointer is out of bounds
  while (!forceExitProgram&&!isPointerOutsideRange()){
    preventPointerUpdate=false;
    var command=charCodeOfProgram().value;
    mainReadHistory.unshift(charOfProgram().value);
    if (mainReadHistory.length>64){
      mainReadHistory.pop();
    }
    if (commandList[command]){
      queueCommand(command);
    }
    handleQueuedCommands();
    if (isExecutionBeingPaused){
      return;
    }
    if (!preventPointerUpdate){
     stepPointer();
    }
  }
}
function charCodeOfProgram(){
  return charCodeAt(read("program"),read("pointer"));
}
function charOfProgram(){
  return charAt(read("program"),read("pointer"));
}
function queueCommand(command){
  commandQueue.push({
    commandCode:command,
    arity:commandList[command].arity,
    inputs:[]
  });
}
function handleQueuedCommands(){
  for (var i=commandQueue.length-1;i>=0;i--){
    var command=commandQueue[i];
    var arity;
    if (typeof command.arity=="function"){
      arity=command.arity(i);
    }else{
      arity=command.arity;
    }
    if (command.inputs.length>=arity){
      var result=runCommand(command,command.inputs);
      if (isExecutionBeingPaused){
        return;
      }
      afterCommandHasRun(result,i);
    }
  }
}
function runCommand(command,inputs){
  return commandList[command.commandCode].function(inputs);
}
function afterCommandHasRun(result,index){
  if (result!==undefined){
    if (commandQueue.length<=1){
      STDOUT(result);
    }else{
      commandQueue[index-1].inputs.push(result);
    }
  }
  commandQueue.pop();
}
function stepPointer(){
  write("pointer",add(read("pointer"),read("direction")));
}
function isPointerOutsideRange(){
  return lessThan(read("pointer"),create("int",0)).value||gte(read("pointer"),length(read("program"))).value;
}

function pauseExecution(){
  isExecutionBeingPaused=true;
}
function resumeExecution(){
  isExecutionBeingPaused=false;
  stepPointer();
  preventPointerUpdate=true;
  runProgram(true);
}

function STDIN(callback){
  dg("STDIN").value="";
  dg("STDIN").readOnly=false;
  pauseExecution();
  dg("STDIN").onkeyup=function (event){
    if (event.key==="Enter"){
      var result=callback(dg("STDIN").value);
      afterCommandHasRun(result);
      dg("STDIN").readOnly=true;
      dg("STDIN").onkeyup=null;
      resumeExecution();
    }
  }
}
function STDOUT(s){
  if (typeof s=="str"){
    dg("STDOUT").value+=s;
  }else{
    dg("STDOUT").value+=convert("str",s).value;
  }
  return s;
}

function pushStack(pointer){
  if (pointer===undefined){
    pointer=read("pointer");
  }
  pointer=convert("int",pointer);
  var a=read("stack").value;
  a.push(pointer);
  write("stack",create("array",a));
}
function popStack(assignToPointer){
  if (assignToPointer===undefined){
    console.warn("Popped from stack without specifying if assigning to pointer!");
  }
  var a=read("stack").value;
  if (a.length==0){
    return;
  }
  var b=a.pop();
  if (assignToPointer){
    write("pointer",b);
  }
  write("stack",create("array",a));
}

function length(value){
  if (["str","array","object"].includes(value.type)){
    return create("int",value.value.length);
  }
  return create("int",0);
}

function getAt(value,index){
  var value=clone(value);
  if (value.type=="str"){
    return create("str",value.value[index.value]);
  }else if (value.type=="array"){
    return value.value[index.value];
  }else if (value.type=="object"){
    for (var i=0;i<length(value).value;i++){
      if (equal(index,value.value[i][0]).value){
        return value.value[i][1];
      }
    }
    return create("int",0);
  }
  return create("int",0);
}

//modified function from https://stackoverflow.com/a/4460624
function clone(item) {
    if (!item) { return item; } // null, undefined values check

    var types = [ "number", "string", "boolean" ], 
        constructors = [ Number, String, Boolean ], 
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function(type, index) {
        if (typeof item == type) {
            result = constructors[index] ( item );
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