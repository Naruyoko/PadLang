function alignType(a,b){
  if (a.type=="variable"&&b.type=="variable"){
    return [a,b];
  }else if (a.type=="variable"){
    return alignType(a.value,b);
  }else if (b.type=="variable"){
    return alignType(a,b.value);
  }else if (!a.type||!b.type){
    throw "What?";
  }
  var types=["int","uint","superint","superuint","float","double","boolean","str","array","object"];
  /*
  int - 0
  uint - 1
  superint - 2
  superuint - 3
  float - 4
  double - 5
  boolean - 6
  str - 7
  array - 8
  object - 9
  */
  var convtable=[
    [ 0,  ,  ,  ,  ,  ,  ,  ,  ,  ],
    [  , 1,  ,  ,  ,  ,  ,  ,  ,  ],
    [  ,  , 2,  ,  ,  ,  ,  ,  ,  ],
    [  ,  ,  , 3,  ,  ,  ,  ,  ,  ],
    [  ,  ,  ,  , 4,  ,  ,  ,  ,  ],
    [  ,  ,  ,  ,  , 5,  ,  ,  ,  ],
    [  ,  ,  ,  ,  ,  , 6,  ,  ,  ],
    [  ,  ,  ,  ,  ,  ,  , 7,  ,  ],
    [  ,  ,  ,  ,  ,  ,  ,  , 8,  ],
    [  ,  ,  ,  ,  ,  ,  ,  ,  , 9]
  ];
}

function lessThan(a,b){
  var x=alignType(a,b);
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