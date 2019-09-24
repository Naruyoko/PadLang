commandList[0x0000]={
  arity:0,
  function:function(inputs,commandRootIndex){
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
  function:function(inputs,commandRootIndex){
    popStack(true);
  }
}
commandList[0x0005]={
  arity:0,
  function:function(inputs,commandRootIndex){
    return create("variable","pointer");
  }
}
commandList[0x0006]={
  arity:0,
  function:function(inputs,commandRootIndex){
    return create("variable","direction");
  }
}
commandList[0x0007]={
  arity:0,
  function:function(inputs,commandRootIndex){
    return create("variable","stack");
  }
}
commandList[0x0008]={
  arity:0,
  function:function(inputs,commandRootIndex){
    return create("variable","program");
  }
}
commandList[0x000a]={
  arity:0,
  function:function(inputs,commandRootIndex){
    commandStack=[];
  }
}
commandList[0x000c]={
  arity:0,
  function:function(inputs,commandRootIndex){
    STDIN(function(input){
      return input;
    });
  }
}
commandList[0x000d]={
  arity:1,
  function:function(inputs,commandRootIndex){
    STDOUT(inputs[0]);
  }
}
commandList[0x0017]={
  arity:1,
  function:function(inputs,commandRootIndex){
    STDOUT(add(inputs[0],create("str","\u000a")));
  }
}
commandList[0x001a]={
  arity:1,
  function:function(inputs,commandRootIndex){
    return read(inputs[0]);
  }
}
commandList[0x001b]={
  arity:0,
  function:function(inputs,commandRootIndex){
    forceExitProgram=true;
  }
}
commandList[0x0020]={
  arity:0,
  function:function(inputs,commandRootIndex){
    //no-op
  }
}
commandList[0x0021]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var t=a.type;
    if (["int","uint","superint","superuint","float","double"].includes(t)){
      return fac(a);
    }else if (t=="str"){
      return mapStrToArrays(a,arrangementArrayOfLength(length(a)));
    }else if (t=="array"){
      return mapArrayToArrays(a,arrangementArrayOfLength(length(a)));
    }
  }
}
commandList[0x0022]={
  arity:0,
  function:function(inputs,commandRootIndex){
    var a="";
    var sequenceChars="abefnrtv\\'\"?";
    var escapedChars=[0x07,0x08,0x1b,0x0c,0x0a,0x0d,0x09,0x0b,0x5c,0x27,0x22,0x3f];
    stepPointer();
    while (charOfProgram().value!="\""&&!isPointerOutsideRange()){
      var c=charOfProgram().value;
      if (c=="\\"){
        stepPointer();
        var d=charOfProgram().value;
        if (d=="x"){
          var e="";
          stepPointer();
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
          stepPointer();
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
          stepPointer();
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
    stepPointer();
    return create("str",a);
  }
}
commandList[0x0023]={
  arity:1,
  function:function(inputs,commandRootIndex){
    if (["str","array","object"].includes(inputs[0].type)){
      return length(inputs[0]);
    }
  }
}
commandList[0x0024]={
  arity:2,
  function:function(inputs,commandRootIndex){
    write(convertToVariable(inputs[1]),inputs[0]);
    return inputs[0];
  }
}
commandList[0x0025]={
  arity:2,
  function:function(inputs,commandRootIndex){
    return mod(inputs[0],inputs[1]);
  }
}
commandList[0x0026]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=convertToRawBoolean(inputs[0]);
    var b=convertToRawBoolean(inputs[1]);
    return create("boolean",a&&b);
  }
}
commandList[0x0027]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=inputs[1];
    if (a.type=="str"){
      a=a.value;
      b=convert("uint",b).value;
      if (b>=a.length){
        return create("str","");
      }else{
        return create("str",a[b]);
      }
    }else if (a.type=="array"){
      a=a.value;
      b=convert("uint",b).value;
      if (b>=a.length){
        return create("int",0);
      }else{
        return clone(a[b]);
      }
    }else if (a.type=="object"){
      a=a.value;
      for (var i=0;i<a.length;i++){
        if (equal(a[i][0],b).value){
          return clone(a[i][1]);
        }
      }
      return create("int",0);
    }
  }
}
commandList[0x002a]={
  arity:2,
  function:function(inputs,commandRootIndex){
    return mul(inputs[0],inputs[1]);
  }
}
commandList[0x002b]={
  arity:2,
  function:function(inputs,commandRootIndex){
    return add(inputs[0],inputs[1]);
  }
}
commandList[0x002d]={
  arity:2,
  function:function(inputs,commandRootIndex){
    return sub(inputs[0],inputs[1]);
  }
}
commandList[0x002f]={
  arity:2,
  function:function(inputs,commandRootIndex){
    return div(inputs[0],inputs[1]);
  }
}
commandList[0x0030]={
  arity:0,
  function:function(inputs,commandRootIndex){
    return create("int",0);
  }
}
//0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037, 0x0038, 0x0039
for (var i=1;i<=9;i++){
  commandList[0x0030+i]={
    arity:0,
    function:function(inputs,commandRootIndex){
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
  function:function(inputs,commandRootIndex){
    commandStack=[];
  }
}
commandList[0x003b]={
  arity:0,
  function:function(inputs,commandRootIndex){
    stepPointer();
    while (!"\u000a\u003a\u003b".includes(charOfProgram().value)&&!isPointerOutsideRange()){
      stepPointer();
    }
  }
}
commandList[0x003c]={
  arity:2,
  function:function(inputs,commandRootIndex){
    return lt(inputs[0],inputs[1]);
  }
}
commandList[0x003d]={
  arity:2,
  function:function(inputs,commandRootIndex){
    return eq(inputs[0],inputs[1]);
  }
}
commandList[0x003e]={
  arity:2,
  function:function(inputs,commandRootIndex){
    return gt(inputs[0],inputs[1]);
  }
}
commandList[0x003f]={
  arity:3,
  function:function(inputs,commandRootIndex){
    if (convert("boolean",inputs[0]).value){
      return inputs[1];
    }else{
      return inputs[2];
    }
  }
}
commandList[0x0041]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var o=read(convertToVariable(inputs[1]));
    write(convertToVariable(inputs[1]),inputs[0]);
    return o;
  }
}
commandList[0x0042]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("int",inputs[1]);
    var t=a.type;
    if (["int","uint","superint","superuint","float","double"].includes(t)){
      return cmb(a,b);
    }else if (t=="str"){
      var c=mapStrToArrays(a,combinationArrayOfLength(length(a,b)));
      /*c=c.value;
      var d=[];
      for (var i=0;i<c.length;i++){ //duplicate remover
        var e=c[i];
        for (var j=0;j<d.length;j++){
          if (equal(e,d[j])){
            break;
          }
        }
        if (j==d.length){
          d.push(e);
        }
      }*/
      return c;
    }else if (t=="array"){
      var c=mapArrayToArrays(a,combinationArrayOfLength(length(a,b)));
      /*c=c.value;
      var d=[];
      for (var i=0;i<c.length;i++){ //duplicate remover
        var e=c[i];
        for (var j=0;j<d.length;j++){
          if (equal(e,d[j])){
            break;
          }
        }
        if (j==d.length){
          d.push(e);
        }
      }*/
      return c;
    }
  }
}
commandList[0x0044]={
  arity:1,
  function:function(inputs,commandRootIndex){
  }
}
commandList[0x0045]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=convertToRawBoolean(inputs[0]);
    var b=convertToRawBoolean(inputs[1]);
    return create("boolean",a+b==1);
  }
}
commandList[0x0048]={
  arity:0,
  function:function(inputs,commandRootIndex){
    STDOUT(create("str","Hello, World!"));
  }
}
commandList[0x0049]={
  arity:0,
  function:function(inputs,commandRootIndex){
    var a="";
    stepPointer();
    while ("0123456789".includes(charOfProgram().value)&&!isPointerOutsideRange()){
      a+=charOfProgram().value;
      stepPointer();
    }
    return create("superint",new bigInt(a));
  }
}
commandList[0x004a]={
  arity:0,
  function:function(inputs,commandRootIndex){
    popStack(true);
  }
}
commandList[0x004c]={
  arity:0,
  function:function(inputs,commandRootIndex){
    pushStack();
  }
}
commandList[0x004d]={
  arity:1,
  function:function(inputs,commandRootIndex){
    popStack(convert("boolean",inputs[0]).value);
  }
}
commandList[0x004e]={
  arity:1,
  function:function(inputs,commandRootIndex){
    popStack(!convert("boolean",inputs[0]).value);
  }
}
commandList[0x004f]={
  arity:2,
  function:function(inputs,commandRootIndex){
    write(convertToVariable(inputs[1]),inputs[0]);
  }
}
commandList[0x0050]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("int",inputs[1]);
    var t=a.type;
    if (["int","uint","superint","superuint","float","double"].includes(t)){
      return cmb(a,b);
    }else if (t=="str"){
      var c=mapStrToArrays(a,combinationArrayOfLength(length(a,b)));
      c=c.value;
      var d=[];
      for (var i=0;i<c.length;i++){ //duplicate remover
        var e=c[i];
        for (var j=0;j<d.length;j++){
          if (equal(e,d[j])){
            break;
          }
        }
        if (j==d.length){
          d.push(e);
        }
      }
      return create("array",d);
    }else if (t=="array"){
      var c=mapArrayToArrays(a,combinationArrayOfLength(length(a,b)));
      c=c.value;
      var d=[];
      for (var i=0;i<c.length;i++){ //duplicate remover
        var e=c[i];
        for (var j=0;j<d.length;j++){
          if (equal(e,d[j])){
            break;
          }
        }
        if (j==d.length){
          d.push(e);
        }
      }
      return create("array",a);
    }
  }
}
commandList[0x0054]={
  arity:0,
  function:function(inputs,commandRootIndex){
    return create("boolean",true);
  }
}
commandList[0x0055]={
  arity:0,
  function:function(inputs,commandRootIndex){
    var a="";
    stepPointer();
    while ("0123456789".includes(charOfProgram().value)&&!isPointerOutsideRange()){
      a+=charOfProgram().value;
      stepPointer();
    }
    return normalize(create("superuint",new bigInt(a)));
  }
}
commandList[0x0056]={
  arity:2,
  function:function(inputs,commandRootIndex){
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
        if (equal(a[i],b).value){
          return create("boolean",true);
        }
      }
      return create("boolean",false);
    }
  }
}
commandList[0x0057]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=inputs[1];
    var c;
    var r;
    if (inputs[0].type=="variable"){
      var a=read(a);
    }
    if (a.type=="str"){
      a=convert("str",a).value;
      b=convert("str",b).value;
      c="";
      for (var i=0;i<a.length;){
        if (a.substring(i,b.length)==b){
          i+=Math.max(b.length,1);
        }else{
          c+=a[i];
          i++;
        }
      }
      r=create("str",c);
    }else if (a.type=="array"){
      a=convert("array",a).value;
      c=[];
      for (var i=0;i<a.length;i++){
        if (!equal(a[i],b).value){
          c.push(a[i]);
        }
      }
      r=create("array",c);
    }else{
      r=clone(a);
    }
    if (inputs[0].type=="variable"){
      write(inputs[0],r);
    }
    return r;
  }
}
commandList[0x0058]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=inputs[1];
    var c;
    var r;
    if (inputs[0].type=="variable"){
      var a=read(a);
    }
    if (a.type=="str"){
      a=convert("str",a).value;
      b=convert("str",b).value;
      c="";
      for (var i=0;i<a.length;){
        if (a.substring(i,b.length)==b){
          i+=Math.max(b.length,1);
        }else{
          c+=a[i];
          i++;
        }
      }
      r=create("str",c);
    }else if (a.type=="array"){
      a=convert("array",a).value;
      c=[];
      for (var i=0;i<a.length;i++){
        if (!equal(a[i],b).value){
          c.push(a[i]);
        }
      }
      r=create("array",c);
    }else{
      r=clone(a);
    }
    if (inputs[0].type=="variable"){
      write(inputs[0],r);
    }
  }
}
commandList[0x0057]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=inputs[1];
    var c;
    var r;
    if (inputs[0].type=="variable"){
      var a=read(a);
    }
    if (a.type=="str"){
      a=convert("str",a).value;
      b=convert("str",b).value;
      c="";
      for (var i=0;i<a.length;){
        if (a.substring(i,b.length)==b){
          i+=Math.max(b.length,1);
        }else{
          c+=a[i];
          i++;
        }
      }
      r=create("str",c);
    }else if (a.type=="array"){
      a=convert("array",a).value;
      c=[];
      for (var i=0;i<a.length;i++){
        if (!equal(a[i],b).value){
          c.push(a[i]);
        }
      }
      r=create("array",c);
    }else{
      r=clone(a);
    }
    return r;
  }
}
commandList[0x005e]={
  arity:2,
  function:function(inputs,commandRootIndex){
    return pow(inputs[0],inputs[1]);
  }
}
commandList[0x0060]={
  arity:0,
  function:function(inputs,commandRootIndex){
    return create("str","");
  }
}
commandList[0x0061]={
  arity:1,
  function:function(inputs,commandRootIndex){
    return create("array",[clone(inputs[0])]);
  }
}
commandList[0x0062]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("int",inputs[1]);
    var t=a.type;
    if (["int","uint","superint","superuint","float","double"].includes(t)){
      return prm(a,b);
    }else if (t=="str"){
      var c=mapStrToArrays(a,permutationArrayOfLength(length(a,b)));
      /*c=c.value;
      var d=[];
      for (var i=0;i<c.length;i++){ //duplicate remover
        var e=c[i];
        for (var j=0;j<d.length;j++){
          if (equal(e,d[j])){
            break;
          }
        }
        if (j==d.length){
          d.push(e);
        }
      }*/
      return c;
    }else if (t=="array"){
      var c=mapArrayToArrays(a,permutationArrayOfLength(length(a,b)));
      /*c=c.value;
      var d=[];
      for (var i=0;i<c.length;i++){ //duplicate remover
        var e=c[i];
        for (var j=0;j<d.length;j++){
          if (equal(e,d[j])){
            break;
          }
        }
        if (j==d.length){
          d.push(e);
        }
      }*/
      return c;
    }
  }
}
commandList[0x0063]={
  arity:1,
  function:function(inputs,commandRootIndex){
    if (convert("boolean",inputs[0]).value){
    }else{
      var a=1;
      stepPointer();
      for (;a>0&&!isPointerOutsideRange();stepPointer()){
        var c=charOfProgram().value;
        if (c=="\u0022"){
          var s=0;
          do{
            if (c!="\u005c"){
              s=0;
            }
            stepPointer();
            c=charOfProgram().value;
            if (c=="\u005c"){
              s++;
              s=s&1;
            }
          }while(c!="\u0022"&&s==0)
          stepPointer();
          c=charOfProgram().value;
        }
        if (c=="\u0063"){
          if (c=="\u0064"){
            a++;
          }
        }else if (c=="\u0066"){
          a--;
        }else if (a==1&&c=="\u0065"){
          a--;
        }
      }
    }
  }
}
commandList[0x0064]={
  arity:0,
  function:function(inputs,commandRootIndex){
    //no-op
  }
}
commandList[0x0065]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=1;
    stepPointer();
    for (;a>0&&!isPointerOutsideRange();stepPointer()){
      var c=charOfProgram().value;
      if (c=="\u0022"){
        var s=0;
        do{
          if (c!="\u005c"){
            s=0;
          }
          stepPointer();
          c=charOfProgram().value;
          if (c=="\u005c"){
            s++;
            s=s&1;
          }
        }while(c!="\u0022"&&s==0)
        stepPointer();
        c=charOfProgram().value;
      }
      if (c=="\u0063"){
        if (c=="\u0064"){
          a++;
        }
      }else if (c=="\u0066"){
        a--;
      }
    }
  }
}
commandList[0x0066]={
  arity:0,
  function:function(inputs,commandRootIndex){
    //no-op
  }
}
commandList[0x0068]={
  arity:0,
  function:function(inputs,commandRootIndex){
    return create("str","Hello, World!");
  }
}
commandList[0x0069]={
  arity:0,
  function:function(inputs,commandRootIndex){
    var a="";
    stepPointer();
    while ("0123456789".includes(charOfProgram().value)&&!isPointerOutsideRange()){
      a+=charOfProgram().value;
      stepPointer();
    }
    return create("int",new bigInt(a).mod(4294967296));
  }
}
commandList[0x006a]={
  arity:1,
  function:function(inputs,commandRootIndex){
    return convertToFloat(inputs[0]);
  }
}
commandList[0x006b]={
  arity:1,
  function:function(inputs,commandRootIndex){
    return convertToDouble(inputs[0]);
  }
}
commandList[0x006e]={
  arity:2,
  function:function(inputs,commandRootIndex){
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
  function:function(inputs,commandRootIndex){
    var a=convertToRawBoolean(inputs[0]);
    var b=convertToRawBoolean(inputs[1]);
    if (a){
      return inputs[0];
    }else{
      return inputs[1];
    }
  }
}
commandList[0x0070]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("int",inputs[1]);
    var t=a.type;
    if (["int","uint","superint","superuint","float","double"].includes(t)){
      return prm(a,b);
    }else if (t=="str"){
      var c=mapStrToArrays(a,permutationArrayOfLength(length(a,b)));
      c=c.value;
      var d=[];
      for (var i=0;i<c.length;i++){ //duplicate remover
        var e=c[i];
        for (var j=0;j<d.length;j++){
          if (equal(e,d[j])){
            break;
          }
        }
        if (j==d.length){
          d.push(e);
        }
      }
      return create("array",d);
    }else if (t=="array"){
      var c=mapArrayToArrays(a,permutationArrayOfLength(length(a,b)));
      c=c.value;
      var d=[];
      for (var i=0;i<c.length;i++){ //duplicate remover
        var e=c[i];
        for (var j=0;j<d.length;j++){
          if (equal(e,d[j])){
            break;
          }
        }
        if (j==d.length){
          d.push(e);
        }
      }
      return create("array",d);
    }
  }
}
commandList[0x0072]={
  arity:1,
  function:function(inputs,commandRootIndex){
    if (convert("boolean",inputs[0]).value){
      pushStack(commandRootIndex);
    }else{
      var a=1;
      stepPointer();
      for (;a>0&&!isPointerOutsideRange();stepPointer()){
        var c=charOfProgram().value;
        if (c=="\u0022"){
          var s=0;
          do{
            if (c!="\u005c"){
              s=0;
            }
            stepPointer();
            c=charOfProgram().value;
            if (c=="\u005c"){
              s++;
              s=s&1;
            }
          }while(c!="\u0022"&&s==0)
          stepPointer();
          c=charOfProgram().value;
        }
        if (c=="\u0072"){
          a++;
        }else if (c=="\u004b"){
          a--;
        }
      }
    }
  }
}
commandList[0x0074]={
  arity:0,
  function:function(inputs,commandRootIndex){
    return create("boolean",false);
  }
}
commandList[0x0075]={
  arity:0,
  function:function(inputs,commandRootIndex){
    var a="";
    stepPointer();
    while ("0123456789".includes(charOfProgram().value)&&!isPointerOutsideRange()){
      a+=charOfProgram().value;
      stepPointer();
    }
    return normalize(create("uint",new bigInt(a).mod(4294967296)));
  }
}
commandList[0x0076]={
  arity:1,
  function:function(inputs,commandRootIndex){
    return create("variable",inputs[0]);
  }
}
commandList[0x0077]={
  arity:2,
  function:function(inputs,commandRootIndex){
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
  function:function(inputs,commandRootIndex){
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
  function:function(inputs,commandRootIndex){
    var a=convertToRawBoolean(inputs[0]);
    var b=convertToRawBoolean(inputs[1]);
    return create("boolean",a||b);
  }
}
commandList[0x007e]={
  arity:1,
  function:function(inputs,commandRootIndex){
    return convertFromBinary(invertRawBinary(convertToBinary(inputs[0])));
  }
}
commandList[0x00a2]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    write(inputs[0],add(a,create("int",1)));
    return a;
  }
}
commandList[0x00a3]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    write(inputs[0],sub(a,create("int",1)));
    return a;
  }
}
commandList[0x00a4]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    write(inputs[0],add(a,create("int",1)));
  }
}
commandList[0x00a5]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    write(inputs[0],sub(a,create("int",1)));
  }
}
commandList[0x00a6]={
  arity:0,
  function:function(inputs,commandRootIndex){
  }
}
commandList[0x00aa]={
  arity:1,
  function:function(inputs,commandRootIndex){
    if (inputs[0].type=="str"){
      var a=[];
      for (var i=0;i<inputs[0].length;i++){
        a.push(charAt(inputs[0],i));
      }
      return create("array",a);
    }
  }
}
commandList[0x00af]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    a=add(a,create("int",1));
    write(inputs[0],a);
    return a;
  }
}
commandList[0x00b0]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    a=sub(a,create("int",1));
    write(inputs[0],a);
    return a;
  }
}
commandList[0x00b1]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    if (["int","superint","float","double"].includes(a.type)){
      return mul(a,create("int",-1));
    }else if (a.type=="str"){
      return reverseStr(a);
    }else if (a.type=="array"){
      return reverseArray(a);
    }
  }
}
commandList[0x00b2]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    if (["int","uint","superint","superuint","float","double"].includes(a.type)){
      return pow(a,create("int",2));
    }
  }
}
commandList[0x00b3]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    if (["int","uint","superint","superuint","float","double"].includes(a.type)){
      return pow(a,create("int",3));
    }
  }
}
commandList[0x00b9]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    if (["int","uint","superint","superuint","float","double"].includes(a.type)){
      return add(a,create("int",1));
    }
  }
}
commandList[0x00ba]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    if (["int","uint","superint","superuint","float","double"].includes(a.type)){
      return sub(a,create("int",1));
    }
  }
}
commandList[0x00bf]={
  arity:0,
  function:function(inputs,commandRootIndex){
  }
}
commandList[0x00c0]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=clone(inputs[1]);
    var r;
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    a.push(b);
    r=create("array",a);
    if (inputs[0].type=="variable"){
      write(inputs[0],r);
    }
    return r;
  }
}
commandList[0x00c1]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var r;
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    b=a.pop();
    r=create("array",a);
    if (inputs[0].type=="variable"){
      write(inputs[0],r);
    }
    return r;
  }
}
commandList[0x00c2]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=clone(inputs[1]);
    var r;
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    a.unshift(b);
    r=create("array",a);
    if (inputs[0].type=="variable"){
      write(inputs[0],r);
    }
    return r;
  }
}
commandList[0x00c3]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var r;
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    b=a.shift();
    if (inputs[0].type=="variable"){
      write(inputs[0],create("array",a));
    }
    return b;
  }
}
commandList[0x00c4]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=clone(inputs[1]);
    var c=convert("uint",inputs[2]).value;
    var r;
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    a.splice(c,0,b);
    for (var i=0;i<a.length;i++){
      if (a[i]===null){
        a[i]=create("int",0);
      }
    }
    r=create("array",a);
    if (inputs[0].type=="variable"){
      write(inputs[0],r);
    }
    return r;
  }
}
commandList[0x00c5]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("uint",inputs[1]).value;
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    if (b<a.length){
      b=a.splice(b,1)[0];
    }else{
      b=create("int",0);
    }
    if (inputs[0].type=="variable"){
      write(inputs[0],create("array",a));
    }
    return b;
  }
}
commandList[0x00c6]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("array",inputs[1]).value;
    var c=convert("uint",inputs[2]).value;
    var r;
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    for (var i=0;i<b.length;i++){
      a.splice(c+i,0,b[i]);
    }
    for (var i=0;i<a.length;i++){
      if (a[i]===null){
        a[i]=create("int",0);
      }
    }
    var r=create("array",a);
    if (inputs[0].type=="variable"){
      write(inputs[0],r);
    }
    return r;
  }
}
commandList[0x00c7]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("uint",inputs[1]).value;
    var c=convert("uint",inputs[2]).value;
    var d=[];
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    for (var i=0;i<b;i++){
      if (c<a.length){
        d.push(a.splice(b,1)[0]);
      }else{
        d.push(create("int",0));
      }
    }
    if (inputs[0].type=="variable"){
      write(inputs[0],create("array",a));
    }
    return create("array",d);
  }
}
commandList[0x00c8]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("uint",inputs[1]).value;
    var c=convert("uint",inputs[2]).value;
    var d=[];
    if (inputs[0].type=="variable"){
      a=convert("array",read(inputs[0])).value;
    }else{
      a=convert("array",inputs[0]).value;
    }
    for (var i=0;i<b;i++){
      if (c+i<a.length){
        d.push(clone(a[c+i]));
      }else{
        d.push(create("int",0));
      }
    }
    return create("array",d);
  }
}
commandList[0x00c9]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("str",inputs[1]).value;
    var c=convert("uint",inputs[2]).value;
    if (inputs[0].type=="variable"){
      a=convert("str",read(a)).value;
    }else{
      a=convert("str",a).value;
    }
    if (c>a.length){
      a+="\u0000".repeat(c-a.length);
    }
    a=a.substring(0,c)+b+a.substring(c);
    r=create("str",a);
    if (inputs[0].type=="variable"){
      write(inputs[0],r);
    }
    return r;
  }
}
commandList[0x00ca]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("uint",inputs[1]).value;
    var c=convert("uint",inputs[2]).value;
    if (inputs[0].type=="variable"){
      a=convert("str",read(a)).value;
    }else{
      a=convert("str",a).value;
    }
    if (b+c<=a.length){
      a=a.substring(b,b+c);
    }else{
      a=a.substring(b)+"\u0000".repeat(b+c-a.length);
    }
    return create("str",a);
  }
}
commandList[0x00cb]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("uint",inputs[1]).value;
    var c=convert("uint",inputs[2]).value;
    if (inputs[0].type=="variable"){
      a=convert("str",read(a)).value;
    }else{
      a=convert("str",a).value;
    }
    if (c<=b){
      return create("str","");
    }
    if (c<=a.length){
      a=a.substring(b,c);
    }else{
      a=a.substring(b)+"\u0000".repeat(c-a.length);
    }
    return create("str",a);
  }
}
commandList[0x00cc]={
  arity:1,
  function:function(inputs,commandRootIndex){
    return create("int",inputs[0]);
  }
}
commandList[0x00cd]={
  arity:1,
  function:function(inputs,commandRootIndex){
    return create("uint",inputs[0]);
  }
}
commandList[0x00ce]={
  arity:1,
  function:function(inputs,commandRootIndex){
    return create("superint",inputs[0]);
  }
}
commandList[0x00cf]={
  arity:1,
  function:function(inputs,commandRootIndex){
    return create("superuint",inputs[0]);
  }
}
commandList[0x00d0]={
  arity:1,
  function:function(inputs,commandRootIndex){
    return base64ToSuperint(inputs[0]);
  }
}
commandList[0x00d1]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=convert("str",inputs[0]).value;
    var b=new bigInt(0);
    var c="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwx";
    var d;
    var e;
    if (a[0]=="0"){
      e=a[1];
      var f="btqpshondUDTRPxHOEvS";
      var g=[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,60];
      if (f.includes(e)){
        d=g[f.indexOf(e)];
        a=a.substring(2);
      }else{
        d=8;
        a=a.substring(1);
      }
    }else{
      d=10;
    }
    if (d<36){
      a=a.toLowerCase();
    }
    a=a.replace(new RegExp("[^"+c.substring(0,d)+"]","g"),"");
    for (var i=0;i<a.length&&a[i]!="=";i++){
      b=b.times(d).plus(c.indexOf(a[i]));
    }
    return create("superint",b);
  }
}
commandList[0x00d2]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=convert("superuint",inputs[0]).value;
    var b="";
    var c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    do{
      b=c[a.mod(64).toJSNumber()]+b;
      a=a.divide(64);
    }while (a.gt(0));
    while (b.length%4!=0){
      b+="="
    }
    return create("str",b);
  }
}
commandList[0x00d3]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    if (["int","uint","superint","superuint","float","double"]){
      return superintToBase64(convert("superint",a));
    }else{
      return strToBase64(a);
    }
  }
}
commandList[0x00d4]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=convert("superuint",inputs[0]).value;
    var b="";
    do{
      b=String.fromCharCode(a.mod(65536).toJSNumber())+b;
      a=a.divide(65536);
    }while (a.gt(0));
    return create("str",b);
  }
}
commandList[0x00d8]={
  arity:0,
  function:function(inputs,commandRootIndex){
    return create("array",[]);
  }
}
commandList[0x00d9]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("str",inputs[1]).value;
    var c=convert("uint",inputs[2]).value;
    var r;
    if (inputs[0].type=="variable"){
      a=convert("str",read(a)).value;
    }else{
      a=convert("str",a).value;
    }
    if (c>a.length){
      a+="\u0000".repeat(c-a.length);
    }
    a=a.substring(0,c)+b+a.substring(c);
    return create("str",r);
  }
}
commandList[0x00dd]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=convert("superuint",inputs[0]).value;
    var b="";
    var c=convert("str",inputs[1]).value;
    if (c.length==0){
      return create("str","");
    }else if (c.length==1){
      for (var i=0;a.gt(i);i++){
        b+=c;
      }
      return create("str",b);
    }else{
      do{
        b=c[a.mod(c.length).toJSNumber()]+b;
        a=a.divide(c.length);
      }while (a.gt(0));
      return create("str",b);
    }
  }
}
commandList[0x00de]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=convert("str",inputs[0]).value;
    var b=new bigInt(0);
    for (var i=0;i<a.length;i++){
      var c=a.charCodeAt(i);
      if (c<256){
        b=b.times(256).plus(c);
      }
    }
    return create("superint",b);
  }
}
commandList[0x00df]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=convert("str",inputs[0]).value;
    var b=new bigInt(0);
    for (var i=0;i<a.length;i++){
      var c=a.charCodeAt(i);
      if (c<65536){
        b=b.times(65536).plus(c);
      }
    }
    return create("superint",b);
  }
}
commandList[0x00e0]={
  arity:0,
  function:function(inputs,commandRootIndex){
    var a="";
    for (var i=0;i<0x7f;i++){
      var b=String.fromCharCode(i);
      a+=b;
    }
    return create("str",a);
  }
}
commandList[0x00e1]={
  arity:0,
  function:function(inputs,commandRootIndex){
    var a="";
    //https://github.com/slevithan/xregexp/blob/2b652889fc14524d20f85604f291f725347f8033/src/addons/unicode-categories.js#L26-L31
    var r=/[\0-\x1F\x7F]/;
    for (var i=0;i<0x7f;i++){
      var b=String.fromCharCode(i);
      if (!r.test(b)){
        a+=b;
      }
    }
    return create("str",a);
  }
}
commandList[0x00e2]={
  arity:0,
  function:function(inputs,commandRootIndex){
    var a="";
    for (var i=0;i<0xff;i++){
      var b=String.fromCharCode(i);
      a+=b;
    }
    return create("str",a);
  }
}
commandList[0x00e3]={
  arity:0,
  function:function(inputs,commandRootIndex){
    var a="";
    //https://github.com/slevithan/xregexp/blob/2b652889fc14524d20f85604f291f725347f8033/src/addons/unicode-categories.js#L26-L31
    var r=/[\0-\x1F\x7F-\x9F\xAD]/;
    for (var i=0;i<0xff;i++){
      var b=String.fromCharCode(i);
      if (!r.test(b)){
        a+=b;
      }
    }
    return create("str",a);
  }
}
commandList[0x00e4]={
  arity:0,
  function:function(inputs,commandRootIndex){
    var a="";
    for (var i=0;i<0xffff;i++){
      var b=String.fromCharCode(i);
      a+=b;
    }
    return create("str",a);
  }
}
commandList[0x00e5]={
  arity:0,
  function:function(inputs,commandRootIndex){
    var a="";
    //https://github.com/slevithan/xregexp/blob/2b652889fc14524d20f85604f291f725347f8033/src/addons/unicode-categories.js#L26-L31
    var r=/[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/;
    for (var i=0;i<0xffff;i++){
      var b=String.fromCharCode(i);
      if (!r.test(b)){
        a+=b;
      }
    }
    return create("str",a);
  }
}
commandList[0x00e8]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=clone(inputs[1]);
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    a.push(b);
    return create("array",a);
  }
}
commandList[0x00e9]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=clone(inputs[1]);
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    var b=a.pop();
    return b;
  }
}
commandList[0x00ea]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=clone(inputs[1]);
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    a.unshift(b);
    return create("array",a);
  }
}
commandList[0x00eb]={
  arity:1,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=clone(inputs[1]);
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    var b=a.shift();
    return b;
  }
}
commandList[0x00ec]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=clone(inputs[1]);
    var c=convert("uint",inputs[2]).value;
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    a.splice(c,0,b);
    for (var i=0;i<a.length;i++){
      if (a[i]===null){
        a[i]=create("int",0);
      }
    }
    return create("array",a);
  }
}
commandList[0x00ed]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("uint",inputs[1]).value;
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    if (b<a.length){
      b=a.splice(b,1)[0];
    }else{
      b=create("int",0);
    }
    return b;
  }
}
commandList[0x00ee]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("array",inputs[1]).value;
    var c=convert("uint",inputs[2]).value;
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    for (var i=0;i<b.length;i++){
      a.splice(c+i,0,b[i]);
    }
    for (var i=0;i<a.length;i++){
      if (a[i]===null){
        a[i]=create("int",0);
      }
    }
    return create("array",a);
  }
}
commandList[0x00ef]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=convert("uint",inputs[1]).value;
    var c=convert("uint",inputs[2]).value;
    var d=[];
    if (inputs[0].type=="variable"){
      a=convert("array",read(a)).value;
    }else{
      a=convert("array",a).value;
    }
    for (var i=0;i<b;i++){
      if (c<a.length){
        d.push(a.splice(b,1)[0]);
      }else{
        d.push(create("int",0));
      }
    }
    return create("array",d);
  }
}
commandList[0x00f1]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=inputs[1];
    var c=inputs[2];
    var d;
    var r;
    if (inputs[0].type=="variable"){
      var a=read(a);
    }
    if (a.type=="str"){
      a=convert("str",a).value;
      b=convert("str",b).value;
      c=convert("str",c).value;
      d="";
      for (var i=0;i<a.length;){
        if (a.substring(i,b.length)==b){
          d+=c;
          i+=Math.max(b.length,1);
        }else{
          d+=a[i];
          i++;
        }
      }
      r=create("str",d);
    }else if (a.type=="array"){
      a=convert("array",a).value;
      d=[];
      for (var i=0;i<a.length;i++){
        if (equal(a[i],b).value){
          d.push(c);
        }else{
          d.push(a[i]);
        }
      }
      r=create("array",d);
    }else{
      r=clone(a);
    }
    if (inputs[0].type=="variable"){
      write(inputs[0],r);
    }
    return r;
  }
}
commandList[0x00f2]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=inputs[1];
    var c=inputs[2];
    var d;
    var r;
    if (inputs[0].type=="variable"){
      var a=read(a);
    }
    if (a.type=="str"){
      a=convert("str",a).value;
      b=convert("str",b).value;
      c=convert("str",c).value;
      d="";
      for (var i=0;i<a.length;){
        if (a.substring(i,b.length)==b){
          d+=c;
          i+=Math.max(b.length,1);
        }else{
          d+=a[i];
          i++;
        }
      }
      r=create("str",d);
    }else if (a.type=="array"){
      a=convert("array",a).value;
      d=[];
      for (var i=0;i<a.length;i++){
        if (equal(a[i],b).value){
          d.push(c);
        }else{
          d.push(a[i]);
        }
      }
      r=create("array",d);
    }else{
      r=clone(a);
    }
    if (inputs[0].type=="variable"){
      write(inputs[0],r);
    }
  }
}
commandList[0x00f3]={
  arity:3,
  function:function(inputs,commandRootIndex){
    var a=inputs[0];
    var b=inputs[1];
    var c=inputs[2];
    var d;
    var r;
    if (inputs[0].type=="variable"){
      var a=read(a);
    }
    if (a.type=="str"){
      a=convert("str",a).value;
      b=convert("str",b).value;
      c=convert("str",c).value;
      d="";
      for (var i=0;i<a.length;){
        if (a.substring(i,b.length)==b){
          d+=c;
          i+=Math.max(b.length,1);
        }else{
          d+=a[i];
          i++;
        }
      }
      r=create("str",d);
    }else if (a.type=="array"){
      a=convert("array",a).value;
      d=[];
      for (var i=0;i<a.length;i++){
        if (equal(a[i],b).value){
          d.push(c);
        }else{
          d.push(a[i]);
        }
      }
      r=create("array",d);
    }else{
      r=clone(a);
    }
    return r;
  }
}
commandList[0x00f4]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    var b=inputs[1];
    var r=add(a,b);
    write(convertToVariable(inputs[0]),r);
    return r;
  }
}
commandList[0x00f5]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    var b=inputs[1];
    var r=sub(a,b);
    write(convertToVariable(inputs[0]),r);
    return r;
  }
}
commandList[0x00f8]={
  arity:0,
  function:function(inputs,commandRootIndex){
    return create("object",[]);
  }
}
commandList[0x00fa]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    var b=inputs[1];
    var r=add(a,b);
    write(convertToVariable(inputs[0]),r);
  }
}
commandList[0x00fb]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    var b=inputs[1];
    var r=sub(a,b);
    write(convertToVariable(inputs[0]),r);
  }
}
commandList[0x00fc]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    var b=inputs[1];
    var r=add(b,a);
    write(convertToVariable(inputs[0]),r);
    return r;
  }
}
commandList[0x00fd]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    var b=inputs[1];
    var r=sub(b,a);
    write(convertToVariable(inputs[0]),r);
    return r;
  }
}
commandList[0x00fe]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    var b=inputs[1];
    var r=add(b,a);
    write(convertToVariable(inputs[0]),r);
  }
}
commandList[0x00ff]={
  arity:2,
  function:function(inputs,commandRootIndex){
    var a=read(inputs[0]);
    var b=inputs[1];
    var r=sub(b,a);
    write(convertToVariable(inputs[0]),r);
  }
}