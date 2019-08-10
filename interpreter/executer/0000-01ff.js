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
    return promptUser();
  }
}
commandList[0x000d]={
  arity:1,
  function:function(inputs){
    outputText(inputs[0]);
  }
}
commandList[0x0017]={
  arity:1,
  function:function(inputs){
    outputText(add(inputs[0],create("str","\u000a")));
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
commandList[0x0048]={
  arity:0,
  function:function(inputs){
    outputText(create("str","Hello, World!"));
  }
}