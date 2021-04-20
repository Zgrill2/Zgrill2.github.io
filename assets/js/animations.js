var text_chain  = [ "is a software engineer", 
"is a blockchain evangelist", "is a very talented programmer", 
"is an excellent technical writer", "writes excellent code", "is a security champion"];

for (var t = 0; t < text_chain.length; t++ ) {
    text_chain[t] = text_chain[t] + ".     ";
};
var index = 0;

//$("#description").fadeTo( 1, 0 );

var f = typeWriter
var delay = 50;

f();


function oldAlgorithm(){
    $( "#description" ).stop().html( text_chain[ index ] ).fadeTo( 500, 1, function(){
        index++;
        $( "#description" ).delay( 800 ).fadeTo( 500, 0 );
        if ( index == text_chain.length ) {
            index = 0;
        };
    } );
};


function typeWriter() {
  var txt = text_chain 
  var txtIndex = 0;
  var statementChangingVar = 0;
  var i = 0;
  var isStatementComplete = 0;
  var nextIndex;
  function description() {
    if (i < txt[txtIndex].length && isStatementComplete == 0) {
      $("#description").html(txt[txtIndex].substring(0,i))
      i++;
      setTimeout(description, delay);
      }
    else if (i>=txt[txtIndex].length && isStatementComplete==0) {
      isStatementComplete++;
      setTimeout(description, delay);
    }
    else if (isStatementComplete==1 && i!=0){
      i--;
      $("#description").html(txt[txtIndex].substring(0,i))
      if (txt[txtIndex+1]) {
        nextIndex = txtIndex + 1;
      } else {
        nextIndex = 0;
      };
      if (txt[txtIndex].substring(0,i) == txt[nextIndex].substring(0,i)){
        isStatementComplete = 2;
      }
      setTimeout(description, delay);
    } 
    else if (isStatementComplete==2){
      isStatementComplete=0;
      statementChangingVar++;
      txtIndex = statementChangingVar % txt.length;
      setTimeout(description, delay);
  }
  };
  description();
};