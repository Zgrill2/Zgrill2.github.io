var text  = [ "is a software engineer", 
"is a blockchain evangalist", "is a very talented programmer", 
"is an excellent technical writer", "writes excellent code", "is a security champion"];
var index = 0;

$("#description").fadeTo( 1, 0 );

setInterval( function(){
    $( "#description" ).stop().html( text[ index ] ).fadeTo( 500, 1, function(){
        index++;
        $( "#description" ).delay( 800 ).fadeTo( 500, 0 );
        if ( index == text.length ) {
            index = 0;
        };
    } );
}, 1800 );