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
    STDIN(function(input){
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
commandList[0x0021]={
  arity:1,
  function:function(inputs){
    return fac(inputs[0]);
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
    return create("str",a);
  }
}
commandList[0x0023]={
  arity:1,
  function:function(inputs){
    if (["str","array","object"].includes(inputs[0].type)){
      return length(inputs[0]);
    }
  }
}
commandList[0x0024]={
  arity:2,
  function:function(inputs){
    write(convertToVariable(inputs[1]),inputs[0]);
    return inputs[0];
  }
}
commandList[0x0025]={
  arity:2,
  function:function(inputs){
    return mod(inputs[0],inputs[1]);
  }
}
commandList[0x0026]={
  arity:2,
  function:function(inputs){
    var a=convertToRawBoolean(inputs[0]);
    var b=convertToRawBoolean(inputs[1]);
    return create("boolean",a&&b);
  }
}
commandList[0x002a]={
  arity:2,
  function:function(inputs){
    return mul(inputs[0],inputs[1]);
  }
}
commandList[0x002b]={
  arity:2,
  function:function(inputs){
    return add(inputs[0],inputs[1]);
  }
}
commandList[0x002d]={
  arity:2,
  function:function(inputs){
    return sub(inputs[0],inputs[1]);
  }
}
commandList[0x002f]={
  arity:2,
  function:function(inputs){
    return div(inputs[0],inputs[1]);
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
commandList[0x003a]={
  arity:0,
  function:function(inputs){
    commandStack=[];
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
commandList[0x003c]={
  arity:2,
  function:function(inputs){
    return lt(inputs[0],inputs[1]);
  }
}
commandList[0x003d]={
  arity:2,
  function:function(inputs){
    return eq(inputs[0],inputs[1]);
  }
}
commandList[0x003e]={
  arity:2,
  function:function(inputs){
    return gt(inputs[0],inputs[1]);
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
commandList[0x0044]={
  arity:1,
  function:function(inputs){
  }
}
commandList[0x0045]={
  arity:2,
  function:function(inputs){
    var a=convertToRawBoolean(inputs[0]);
    var b=convertToRawBoolean(inputs[1]);
    return create("boolean",a+b==1);
  }
}
commandList[0x0048]={
  arity:0,
  function:function(inputs){
    STDOUT(create("str","Hello, World!"));
  }
}
commandList[0x0049]={
  arity:0,
  function:function(inputs){
    var a="";
    while ("0123456789".includes(charOfProgram().value)&&!isPointerOutsideRange()){
      a+=charOfProgram().value;
      stepPointer();
    }
    return create("superint",new bigInt(a));
  }
}
commandList[0x004f]={
  arity:2,
  function:function(inputs){
    write(convertToVariable(inputs[1]),inputs[0]);
  }
}
commandList[0x0054]={
  arity:0,
  function:function(inputs){
    return create("boolean",true);
  }
}
commandList[0x0055]={
  arity:0,
  function:function(inputs){
    var a="";
    while ("0123456789".includes(charOfProgram().value)&&!isPointerOutsideRange()){
      a+=charOfProgram().value;
      stepPointer();
    }
    return normalize(create("superuint",new bigInt(a)));
  }
}
commandList[0x0056]={
  arity:2,
  function:function(inputs){
    var a=inputs[0].value;
    if (inputs[0].type=="str"){
      var b=convert("str",inputs[1]).value;
      for (var i=0;i<=a.length-b.length;i++){
        if (a.substring(i,i+b.length)==b){
          return create("boolean",true);
        }
      }
      return create("boolean",false);
    }else if (inputs[0].type=="array"){
      for (var i=0;i<a.length;i++){
        var b=inputs[1];
        if (equal(a[i],b)){
          return create("boolean",true);
        }
      }
      return create("boolean",false);
    }
  }
}
commandList[0x005e]={
  arity:2,
  function:function(inputs){
    return pow(inputs[0],inputs[1]);
  }
}
commandList[0x0060]={
  arity:0,
  function:function(inputs){
    return create("str","");
  }
}
commandList[0x0068]={
  arity:0,
  function:function(inputs){
    return create("str","Hello, World!");
  }
}
commandList[0x006a]={
  arity:1,
  function:function(inputs){
    return convertToFloat(inputs[0]);
  }
}
commandList[0x006b]={
  arity:1,
  function:function(inputs){
    return convertToDouble(inputs[0]);
  }
}
commandList[0x006e]={
  arity:2,
  function:function(inputs){
    var a=convertToRawBoolean(inputs[0]);
    var b=convertToRawBoolean(inputs[1]);
    if (a){
      return inputs[1];
    }else{
      return inputs[0];
    }
  }
}
commandList[0x006f]={
  arity:2,
  function:function(inputs){
    var a=convertToRawBoolean(inputs[0]);
    var b=convertToRawBoolean(inputs[1]);
    if (a){
      return inputs[0];
    }else{
      return inputs[1];
    }
  }
}
commandList[0x0074]={
  arity:0,
  function:function(inputs){
    return create("boolean",false);
  }
}
commandList[0x0075]={
  arity:0,
  function:function(inputs){
    var a="";
    while ("0123456789".includes(charOfProgram().value)&&!isPointerOutsideRange()){
      a+=charOfProgram().value;
      stepPointer();
    }
    return normalize(create("uint",new bigInt(a).mod(4294967296)));
  }
}
commandList[0x0076]={
  arity:1,
  function:function(inputs){
    return create("variable",inputs[0]);
  }
}
commandList[0x0077]={
  arity:2,
  function:function(inputs){
    var a=[];
    var x=convert("int",inputs[0]);
    var y=convert("int",inputs[1]);
    if (x<y){
      for (var i=x;i<=y;i++){
        a.push(create("int",i));
      }
    }else{
      for (var i=y;i>=x;i--){
        a.push(create("int",i));
      }
    }
    return create("array",a);
  }
}
commandList[0x0078]={
  arity:1,
  function:function(inputs){
    var a=[];
    var x=convert("int",inputs[0]);
    if (x>0){
      for (var i=0;i<=x;i++){
        a.push(create("int",i));
      }
    }else{
      for (var i=0;i>=x;i--){
        a.push(create("int",i));
      }
    }
    return create("array",a);
  }
}
commandList[0x007c]={
  arity:2,
  function:function(inputs){
    var a=convertToRawBoolean(inputs[0]);
    var b=convertToRawBoolean(inputs[1]);
    return create("boolean",a||b);
  }
}
commandList[0x00a6]={
  arity:0,
  function:function(inputs){
  }
}
commandList[0x00aa]={
  arity:1,
  function:function(inputs){
    if (inputs[0].type=="str"){
      var a=[];
      for (var i=0;i<inputs[0].length;i++){
        a.push(charAt(inputs[0],i));
      }
      return create("array",a);
    }
  }
}
commandList[0x00b1]={
  arity:1,
  function:function(inputs){
    var a=inputs[0];
    if (["int","superint","float","double"].includes(a.type)){
      return mul(a,create("int",-1));
    }
  }
}
commandList[0x00b2]={
  arity:1,
  function:function(inputs){
    var a=inputs[0];
    if (["int","uint","superint","superuint","float","double"].includes(a.type)){
      return pow(a,create("int",2));
    }
  }
}
commandList[0x00b3]={
  arity:1,
  function:function(inputs){
    var a=inputs[0];
    if (["int","uint","superint","superuint","float","double"].includes(a.type)){
      return pow(a,create("int",3));
    }
  }
}
commandList[0x00b9]={
  arity:1,
  function:function(inputs){
    var a=inputs[0];
    if (["int","uint","superint","superuint","float","double"].includes(a.type)){
      return add(a,create("int",1));
    }
  }
}
commandList[0x00ba]={
  arity:1,
  function:function(inputs){
    var a=inputs[0];
    if (["int","uint","superint","superuint","float","double"].includes(a.type)){
      return sub(a,create("int",1));
    }
  }
}
commandList[0x00bf]={
  arity:0,
  function:function(inputs){
  }
}
commandList[0x00cc]={
  arity:1,
  function:function(inputs){
    return create("int",inputs[0]);
  }
}
commandList[0x00cd]={
  arity:1,
  function:function(inputs){
    return create("uint",inputs[0]);
  }
}
commandList[0x00ce]={
  arity:1,
  function:function(inputs){
    return create("superint",inputs[0]);
  }
}
commandList[0x00cf]={
  arity:1,
  function:function(inputs){
    return create("superuint",inputs[0]);
  }
}
commandList[0x00d0]={
  arity:1,
  function:function(inputs){
    var a=convert("str",inputs[0]).value;
    var b=new bigInt(0);
    var c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var d;
    for (var i=a.length-4;i<a.length;i++){

    }
    if (a.substring(0,a.indexOf("=")).search("[^"+c+"]")&&)
    for (var i=0;i<a.length;i++){
      b=b.mul(64).add(c.indexOf(a[i]));
    }
  }
}
commandList[0x00d8]={
  arity:0,
  function:function(inputs){
    return create("array",[]);
  }
}
commandList[0x00f8]={
  arity:0,
  function:function(inputs){
    return create("object",[]);
  }
}