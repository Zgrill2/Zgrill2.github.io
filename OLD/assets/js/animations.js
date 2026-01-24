var text_chain  = [ "is a software engineer", 
"is a blockchain evangelist", "is a very talented programmer", 
"excels as a technical writer", "excels at coding", "is a security champion", "is a raspberry pi hacker",
"is a whitehat", "is into Dungeons & Dragons", "is a cypherpunk", "is a cyber security professional", 
"is a team player", "is a teammate you'd want to have", "Python programmer extraordinaire", "has used Javascript plenty of times",
"runs Windows on a RaspberryPi", "runs Android on a Nintendo Switch", "uses monero", "uses cryptocurrency", "programs REST APIs",
"programs web servers", "enjoys programming the back-end", "is a full-stack developer", "perfers cli to gui", "uses both vim and spaces",
"watches starcraft esports", "listens to history podcasts", "lists a lot of hobbies on his website"];

for (var t = 0; t < text_chain.length; t++ ) {
    text_chain[t] = text_chain[t] + ".     ";
};
var index = 0;


var f = typeWriter
var delay = 55;

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
  var txtIndex = Math.floor(Math.random()*(txt.length-1)) + 1;
  var statementChangingVar = 0;
  var i = 0;
  var isStatementComplete = 0;
  var nextIndex=Math.floor(Math.random()*(txt.length-1)) + 1;
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

      if (txt[txtIndex].substring(0,i) == txt[nextIndex].substring(0,i)){
        isStatementComplete = 2;
      }
      setTimeout(description, delay);
    } 
    else if (isStatementComplete==2){
      isStatementComplete=0;
      statementChangingVar++;
      txtIndex = nextIndex
      nextIndex = Math.floor(Math.random()*(txt.length-1)) + 1

      setTimeout(description, delay);
  }
  };
  description();
  //Provided by danielhwile https://github.com/danielhwile edited by Zgrill2 https://github.com/Zgrill2
};
