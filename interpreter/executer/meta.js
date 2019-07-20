var memory;
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
  if (
    (
      ["int","uint","superint","superuint"].includes(type)&&
      (typeof value=="number"||value.value)
    )||
    (
      ["float","double"].includes(type)&&
      typeof value=="number"
    )||
    (
      type=="str"&&
      typeof value=="string"
    )||
    (
      type=="array"&&
      Array.isArray(value)
    )||
    (
      type=="object"&&
      typeof value=="object"&&!Array.isArray(value)
    )
  ){
    return {
      type:type,
      value:clone(value)
    };
  }
  return {};
}
function convert(type,value){
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