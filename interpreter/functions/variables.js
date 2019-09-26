function read(name){
  var cname=clone(name);
  if (name.type=="variable"){
    name=name.value;
  }
  var namespacename;
  var isvariablelookingforvariable;
  if (typeof name=="string"||name.type){
    namespacename=name;
    isvariablelookingforvariable=false;
  }else if (name instanceof Array){
    namespacename=name[0];
    isvariablelookingforvariable=true;
  }else{
    console.log(cname);
    throw new Error("Something other than a String or Array passed as variable name.");
  }
  var e=create("int",0);
  for (var i=0;i<memory.length;i++){
    if (equal(memory[i].name,namespacename).value){
      e=clone(memory[i].value);
      break;
    }
  }
  if (isvariablelookingforvariable){
    if (name.length>1){
      var properties=name.slice(1);
      e=readProperty(e,properties);
    }
  }
  return e;
}
function readProperty(namespace,propertyNestArray){
  var e;
  if (namespace.type=="str"){
    var property=convert("int",propertyNestArray[0]).value;
    e=charAt(namespace,property);
  }else if (namespace.type=="array"){
    var property=convert("int",propertyNestArray[0]).value;
    if (property<0||property>=namespace.value.length){
      e=create("int",0);
    }else{
      e=namespace.value[property]
    }
  }else if (namespace.type=="object"){
    var property=propertyNestArray[0];
    var v=namespace.value;
    var l=v.length;
    e=create("int",0);
    for (var i=0;i<l;i++){
      if (equal(v[i][0],property)){
        e=v[i][1];
        break;
      }
    }
  }else{
    e=namespace;
  }
  if (propertyNestArray.length>1){
    var properties=propertyNestArray.slice(1);
    e=readProperty(e,properties);
  }
  return clone(e);
}

function write(name,value){
  var cname=clone(name);
  if (name=="pointer"){
    preventPointerUpdate=true;
  }
  if (name.type=="variable"){
    name=name.value;
  }
  var namespacename;
  var isvariablelookingforvariable;
  if (typeof name=="string"||name.type){
    namespacename=name;
    isvariablelookingforvariable=false;
  }else if (name instanceof Array){
    namespacename=name[0];
    isvariablelookingforvariable=true;
  }else{
    console.log(cname);
    throw new Error("Something other than a String or Array passed as variable name.");
  }
  var e=-1;
  var f=clone(value);
  for (var i=0;i<memory.length;i++){
    if (equal(memory[i].name,namespacename).value){
      if (isvariablelookingforvariable&&name.length>1){
        var properties=name.slice(1);
        f=writeProperty(memory[i].value,properties,value);
      }
      e=i;
      break;
    }
  }
  if (e==-1){
    memory.push({
      name:clone(name),
      special:false,
      value:f
    });
  }else{
    memory[i].value=f;
  }
}
function writeProperty(namespace,propertyNestArray,value){
  var e;
  if (namespace.type=="str"){
    var v=namespace.value;
    var i=convert("int",propertyNestArray[0]).value;
    var f=convert("str",value).value;
    if (i>=0){
      if (propertyNestArray.length>1){
        var properties=propertyNestArray.slice(1);
        f=writeProperty(create("str",v[i]),properties,value).value;
      }
      if (i>v.length){
        f="\u0000".repeat(i-v.length)+f;
      }
      e=create("str",v.substring(0,i)+f+v.substring(i+1));
    }else{
      e=clone(v);
    }
  }else if (namespace.type=="array"){
    var v=namespace.value;
    var i=convert("int",propertyNestArray[0]).value;
    var f=value;
    if (i>=0){
      if (propertyNestArray.length>1){
        if (i>=v.length){
          f=clone(value);
        }else{
          var properties=propertyNestArray.slice(1);
          f=writeProperty(v[i],properties,value);
        }
      }
      e=v.slice(0,i);
      if (i>=v.length){
        for (var j=v.length;j<i;j++){
          e.push(create("int",0));
        }
      }
      e.push(f);
      for (var j=i+1;j<v.length;j++){
        e.push(clone(v[j]));
      }
    }else{
      e=clone(v);
    }
  }else if (namespace.type=="object"){
    var property=propertyNestArray[0];
    var properties=name.slice(1);
    var v=namespace.value;
    e=clone(v);
    var l=v.length;
    for (var i=0;i<l;i++){
      if (equal(v[i][0],property)){
        var f=value;
        if (propertyNestArray.length>1){
          var properties=propertyNestArray.slice(1);
          f=writeProperty(v[i][1],properties,value);
        }
        e[i][1]=f;
        break;
      }
    }
  }else{
    e=namespace;
  }
  return clone(e);
}

function create(type,value){
  value=clone(value);
  return normalize({
    type:type,
    value:clone(value)
  });
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
    var offset=new bigInt(2).pow(value.value.bitLength());
    value.value=value.value.mod(offset).plus(offset);
    if (value.value.geq(offset)){
      value.value=value.value.minus(offset);
    }else if (value.value.lt(offset)){
      value.value=value.value.plus(offset);
    }
    return value;
  }else if (value.type=="float"){
    value.value=doubleToFloat(value.value);
    return value;
  }else if (value.type=="double"){
    return value;
  }else if (value.type=="boolean"){
    return value;
  }else if (value.type=="str"){
    return value;
  }else if (value.type=="array"){
    return value;
  }else if (value.type=="object"){
    return value;
  }else if (value.type=="variable"){
    return value;
  }
}

function pushProperty(name,property){
  name=convert("variable",name);
  if (!(name.value instanceof Array)){
    name.value=[name.value];
  }
  name.value.push(clone(property));
  return name;
}

function popProperty(name){
  name=convert("variable",name);
  if (name.value instanceof Array&&name.value.length>1){
    name.value.pop();
  }
  return name;
}