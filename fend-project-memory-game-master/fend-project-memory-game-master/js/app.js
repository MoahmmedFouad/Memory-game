// list of cards
var CardList = ["fa fa-diamond" , "fa fa-paper-plane-o" , "fa fa-anchor" , "fa fa-bolt" , "fa fa-cube" , "fa fa-anchor" , "fa fa-leaf" , "fa fa-bicycle" , "fa fa-diamond" , "fa fa-bomb" , "fa fa-leaf" , "fa fa-bomb" , "fa fa-bolt" , "fa fa-bicycle" , "fa fa-paper-plane-o" , "fa fa-cube" ];

// this variables help me to save some of information
var LastOpenCellName="",open=0,LastOpenCell,moves=0,stars=3,TotalMoves = 0 , check = true , firstClick = 0 , interval;
// this variables for timer 
var sec=0,minuts=0,hour=0;


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
/*
this function to set cards and all variables in the begining of the game 
,when restart and play again
*/
function GamePrepare(){
    moves = 0 , stars = 3 , sec = 0, minuts = 0, hour = 0, TotalMoves=0 ,open = 0 , firstClick = 0; // set all variables
    $(".card").remove();
    CardList = shuffle(CardList);
    for(var i= 0 ;i<16 ;i++){ // create cards 
    var Li = "<li class = " + "card" + "><i class =" + "'" + CardList[i] + "'" + "></i></li";
    $(".deck").append(Li);
    }
    
    $(".deck .card").click(WhenClick); // add Event(click)
    $(".moves").text(0); // set moves
    $(".timer").text("00:00:00"); // set timer
    $(".score-panel .stars").children("li").remove();
    for(var i=0;i<3;i++){ // set stars
        var star = "<li><i class =" +  "'" + "fa fa-star"  + "'" + "></i></li";
        $(".score-panel .stars").append(star);
    }
    clearInterval(interval);
}
// this function to make timer
function SetTimer(){
    
    interval = setInterval(function(){
       sec++;
       if(sec==60){
           sec = 0;
           minuts++;
           if(minuts==60){
                hour++;
                minuts=0;
           }
       }
       var s  , m , h , timer;
       if(sec<10)
           s = "0"+sec;
        else
            s = sec;
        
        if(minuts < 10)
            m = "0"+minuts;
        else
            m = minuts;
        if(hour<10)
            h = "0"+hour;
        else
            h = hour;
        timer = h+":"+m+":"+s;
        $(".timer").text(timer);
        
    },1000);
    
    
}
/*
this function when click on any card 
first check if there is card open or not 
if there make two cards match otherwise tell the user that two cards are wrong then 
close two cards 

then 
if all cards open successfuly tell the user that he/she won

*/
function WhenClick(){
    if(!firstClick){
        SetTimer();
        firstClick = 1;
    }
    if(open===0 && !$(this).hasClass("match")){ // check if no cards open
         check =true;
         $(".deck .card").each(function(){
             if($(this).hasClass("wrong")) // check if no cards with wrong class
                 check = false;
         });
         if(check){  // for open the selected card
             $(this).addClass("show open"); 
             LastOpenCellName =  $(this);
             var li = $(this).children("i");
             LastOpenCell = li.attr("class");
             open = 1;
         }
    }
    else if(!$(this).hasClass("match") && !$(this).hasClass("open")){ // check if card open and didn't match
        var Name, li;
        li = $(this).children("i");
        Name = li.attr("class");
        if(Name === LastOpenCell) // check if this card equal the prviou open card
        {
            $(this).addClass("show match");
            LastOpenCellName.removeClass("open");
            LastOpenCellName.addClass("match");
            LastOpenCellName.shakeUp();
            $(this).shakeUp();
            TotalMoves++;
        }
        else // if two cards not identical
        {
             var ThisElem = $(this);
             // add class open and show and wrong
             ThisElem .addClass("show wrong open");
             LastOpenCellName.addClass("wrong");
            
             // make shake for two cards
             setTimeout(function(){
                   LastOpenCellName.shakeLeft();
                   ThisElem .shakeLeft();
                 
             },1000);
              // delete class open and show and wrong
             setTimeout(function(){     
             LastOpenCellName.removeClass("show wrong open");
             ThisElem.removeClass("show wrong open");     
             },1500);
             
        }
        moves++; // increment number of moves
        $(".moves").text(moves);
        // if number of moves reach to 15 or 25 decrement number of stars
        if(moves==15 || moves==25)
        {
            $(".score-panel .stars").children("li:first-child").remove();
            stars--;
        }
        // check if all cards open
        if(TotalMoves == 8)
        {
          setTimeout(function(){
            var timeandmoves;
            clearInterval();
            $(".Game").hide();
            timeandmoves = "With " + moves + " moves " + "and " + stars  +" stars in " + hour+":"+minuts+":"+sec;
            $(".finalscore").text(timeandmoves);
            $(".congratulations").show();
              
          },1000);
        }
        open = 0;
    }
    
}
// this function to shake the cards 

jQuery.fn.shakeLeft = function(interval,distance,times){
   var jTarget = $(this);
   jTarget.css('position','relative');
   for(var iter=0;iter<(5);iter++){
      jTarget.animate({ left: ((iter%2==0 ? 150 : 150*-1))}, 100); // move to left when even to right when odd
   }
   return jTarget.animate({left:0},100); // return the card to intial position 
}

jQuery.fn.shakeUp = function(){
   
   var jTarget = $(this);
   jTarget.css('position','relative');
   for(var iter=0;iter<(5);iter++){
      jTarget.animate({ top: ((iter%2==0 ? 100 : 100*-1))}, 100);// move to top when even to bottom when odd
   }
   return jTarget.animate({ top: 0},100); // return the card to intial position
};

GamePrepare();
$(".restart").click(GamePrepare);
//SetTimer();

///////////////////////////////////////////////////////////////////////////////////////
// this part special for congratulation model

// when resize the window
$(window).resize(function(){
var hight = ($(window).height() - $(".congratulations").height())/2;
$(".congratulations").css("padding-top",hight);
});

// to make model of congratulation on the middle of the page
var hight = ($(window).height() - $(".congratulations").height())/2;
$(".congratulations").css("padding-top",hight);

// when click play again , hide congratulation section and show game section , start the game  
$(".playagain").click(function(){
   
     $(".congratulations").hide();
     $(".Game").show();
     GamePrepare();
});
