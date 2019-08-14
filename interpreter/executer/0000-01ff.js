commandList[0x0000]={
  arity:0,
  function:function(inputs){
    var a=[];
    a.push(read("pointer"));
    a.push({
      name:"direction",
      special:true,
      value:create("int",1)
    });
    a.push(read("program"));
    a.push({
      name:"stack",
      special:true,
      value:create("array",[])
    });
    memory=a;
  }
}
commandList[0x0003]={
  arity:0,
  function:function(inputs){
    write("pointer",pop("stack"));
  }
}
commandList[0x0005]={
  arity:0,
  function:function(inputs){
    return create("variable","pointer");
  }
}
commandList[0x0006]={
  arity:0,
  function:function(inputs){
    return create("variable","direction");
  }
}
commandList[0x0007]={
  arity:0,
  function:function(inputs){
    return create("variable","stack");
  }
}
commandList[0x0008]={
  arity:0,
  function:function(inputs){
    return create("variable","program");
  }
}
commandList[0x000a]={
  arity:0,
  function:function(inputs){
    commandStack=[];
  }
}
commandList[0x000c]={
  arity:0,
  function:function(inputs){
    STDIN(function (input){
      return input;
    });
  }
}
commandList[0x000d]={
  arity:1,
  function:function(inputs){
    STDOUT(inputs[0]);
  }
}
commandList[0x0017]={
  arity:1,
  function:function(inputs){
    STDOUT(add(inputs[0],create("str","\u000a")));
  }
}
commandList[0x001a]={
  arity:1,
  function:function(inputs){
    return read(inputs[0]);
  }
}
commandList[0x001b]={
  arity:0,
  function:function(inputs){
    forceExitProgram=true;
  }
}
commandList[0x0020]={
  arity:0,
  function:function(inputs){
    //no-op
  }
}
commandList[0x0022]={
  arity:0,
  function:function(inputs){
    var a="";
    while (charOfProgram().value!="\""&&!isPointerOutsideRange()){
      var c=charOfProgram().value;
      var sequenceChars="abefnrtv\\'\"?";
      var escapedChars=[0x07,0x08,0x1b,0x0c,0x0a,0x0d,0x09,0x0b,0x5c,0x27,0x22,0x3f];
      if (c=="\\"){
        stepPointer();
        var d=charOfProgram().value;
        if (d=="x"){
          var e="";
          while ("0123456789abcdefABCDEF".includes(charOfProgram().value)&&!isPointerOutsideRange()){
            e+=charOfProgram().value;
            stepPointer();
            if (e.length>2){
              break;
            }
          }
          a+=String.fromCharCode(parseInt(e,16));
        }else if (d=="u"){
          var e="";
          while ("0123456789abcdefABCDEF".includes(charOfProgram().value)&&!isPointerOutsideRange()){
            e+=charOfProgram().value;
            stepPointer();
            if (e.length>4){
              break;
            }
          }
          a+=String.fromCharCode(parseInt(e,16));
        }else if ("01234567".includes(d)){
          var e="";
          while ("01234567".includes(charOfProgram().value)&&!isPointerOutsideRange()){
            e+=charOfProgram().value;
            stepPointer();
            if (e.length>3){
              break;
            }
          }
          a+=String.fromCharCode(parseInt(e,8)&0xff);
        }else if (sequenceChars.includes(d)){
          a+=String.fromCharCode(escapedChars[sequenceChars.indexOf(d)]);
          stepPointer();
        }else{
          //undefined sequence character
          stepPointer();
        }
      }else{
        a+=charOfProgram().value;
        stepPointer();
      }
    }
    return create("string",a);
  }
}
commandList[0x0024]={
  arity:2,
  function:function(inputs){
    write(convertToVariable(inputs[1]),inputs[0]);
    return inputs[0];
  }
}
commandList[0x0030]={
  arity:0,
  function:function(inputs){
    return create("int",0);
  }
}
//0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037, 0x0038, 0x0039
for (var i=1;i<=9;i++){
  commandList[0x0030+i]={
    arity:0,
    function:function(inputs){
      var a="";
      while ("0123456789".includes(charOfProgram().value)&&!isPointerOutsideRange()){
        a+=charOfProgram().value;
        stepPointer();
      }
      return create("int",new bigInt(a).mod(4294967296));
    }
  }
}
commandList[0x003b]={
  arity:0,
  function:function(inputs){
    while ("\u000a\u003a\u003b".includes(charOfProgram().value)&&!isPointerOutsideRange()){
      stepPointer();
    }
  }
}
commandList[0x0041]={
  arity:2,
  function:function(inputs){
    var o=read(convertToVariable(inputs[1]));
    write(convertToVariable(inputs[1]),inputs[0]);
    return o;
  }
}
commandList[0x0048]={
  arity:0,
  function:function(inputs){
    STDOUT(create("str","Hello, World!"));
  }
}