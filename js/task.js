/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	//"instructions/instruct-2.html",
	//"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	//"instructions/instruct-2.html",
	//"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
* Boundary Test      *
********************/
var BoundaryExperiment = function() {

	var stimon, // time word is presented
	    listening = false;

	
	var trialTime = 1000;
	var trialID = 0;
	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');
	
	//gets the canvas from stage.html
    var canvas = document.getElementById('image_canvas');
    //gets the context of the canvas
    var ctx = canvas.getContext('2d');
    //sets the font (modify the number to change the font size)
    ctx.font="bold 50px Arial";
	
	
	//stims = _.shuffle(stims);

	//the main trial function, calls itself after it ends for each subsequent trial
    function nextTrial(millisec){
        //sets the #press_space element to an empty header (not completely empty as it is modified later)
        d3.select("#press_space").html('<h2 id="prompt2"></h2>');
        //clears the canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.lineWidth = 5;
        ctx.strokeStyle="black";
        //draws an X on the screen, this x lasts on the screen for as long as the parameter "millisec" (check setTimeout in next line)
        drawX(ctx,canvas.width*0.5,canvas.height*0.5);
        trialID+=1;
        setTimeout(function() {
            //used in timeout function
			var center = new Point(200,200);
			drawHexTile(ctx,center);

        },millisec);
    }

	
	var response_handler = function(e) {
		if (!listening) return;

		var keyCode = e.keyCode,
			response;

		switch (keyCode) {
			case 82:
				// "R"
				response="red";
				break;
			case 71:
				// "G"
				response="green";
				break;
			case 66:
				// "B"
				response="blue";
				break;
			default:
				response = "";
				break;
		}
		if (response.length>0) {
			listening = false;
			
			
			//calls nextTrial again after trialTime amount of time
            //third parameter to timeout is next trial parameter
            setTimeout(nextTrial,trialTime,trialTime);
		}
	};

	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};


	// Register the response handler that is defined above to handle any
	// key down events.
	$("body").focus().keydown(response_handler); 

	// Start the test
	next();
	
	//start text (prompting to press space to start), reward is initialized to zero
    d3.select("#press_space").html('<h2 id="prompt2">Press <b>Space</b> to start.</h2>');
    d3.select("#reward_total").html('<div id = "reward_total" style="color:black; text-align:center;font-size:30px; font-' +
        'weight:10;margin:20px"></div>');

    // Start the test with space
    $(document).keydown(function(e){
            if(e.keyCode == 32){
                //only runs if it's actually the start of the test
                if(start){
                    start=false;
                    //basic instructions at the start are removed when space is pressed, nextTrial is called
                    d3.select("#press_space").html('<h2 id="prompt2"></h2>');
                    d3.select("#reward_total").html('<div id = "reward_total" style="color:black; text-align:center;font-size:30px;'+ 
                        'font-weight:10;margin:20px">Total Reward: <span id="total">0</span></div>');
                    setTimeout(nextTrial,trialTime,trialTime);
                }
                
            }
                
        });
};


/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){finish()}); 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new BoundaryExperiment(); } // what you want to do when you are done with instructions
    );
});
