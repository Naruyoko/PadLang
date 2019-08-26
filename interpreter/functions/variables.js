function read(name){
  if (name.type=="variable"){
    name=name.value;
  }
  for (var i=0;i<memory.length;i++){
    if (equal(memory[i].name,name).value){
      return clone(memory[i].value);
    }
  }
  return create("int",0);
}
function write(name,value){
  value=clone(value);
  if (name=="pointer"){
    preventPointerUpdate=true;
  }
  if (name.type=="variable"){
    name=name.value;
  }
  for (var i=0;i<memory.length;i++){
    if (equal(memory[i].name,name).value){
      memory[i].value=clone(value);
      return;
    }
  }
  memory.push({
    name:clone(name),
    special:false,
    value:clone(value)
  });
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