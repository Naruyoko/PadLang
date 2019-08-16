function add(a,b){}

function subtract(a,b){}
function sub(a,b){
  return subtract(a,b);
}

function multiply(a,b){}
function mul(a,b){
  return multiply(a,b);
}

function divide(a,b){}
function div(a,b){
  return divide(a,b);
}

function modulo(a,b){}
function mod(a,b){
  return modulo(a,b);
}

function power(a,b){}
function pow(a,b){
  return power(a,b);
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
    //TODO:
  }
}

function invertBinary(binaryValue){
  return binaryValue.replace(/0/g,"a").replace(/1/g,"0").replace(/a/g,"1");
}