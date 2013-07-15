// Main Questions/Glaring Issues
// 1. Minor issue: when clicking search field previous input does not vanish
// 2. search results dropping down after error message
// 3. icons in buttons
// 4. Delete buttons wont show after delete
// 5. get checkbox delete and input on same line

// Step 1 of Twitter
var encoded1 = encodeURIComponent('fEHJVzLzqYjRz9Ico8ZflA');//, 'UTF-8');
var encoded2 = encodeURIComponent('oak7BhaW8hmhA2nR74aCTVOEzRuhJoKYQ4CQezNfKw');
var totalEncoding = encoded1 + ':' + encoded2;
var baseString = window.btoa(totalEncoding);

// Step 2 of Twitter
$.ajax({
	url: 'https://api.twitter.com/oauth2/token',
	type: 'POST',
	datatype: 'json',
	data: 'grant_type=client_credentials',
	success: function() {alert("Success");},
	error: function() {alert("Failure!");},
	beforeSend: function (xhr){xhr.setRequestHeader('Authorization', 'Basic ' + baseString); xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')}
});



$(document).ready(function(){

	// Hide a lot of CSS stuff right after page load and let user display what they want
	window.onload = function(){
		$('#successfulSearch').hide();
		$('#failedSearch').hide();
		$('#tooMany').hide();
		$('#none').hide();
		$('#sameInput').hide();
		$('#enoughInput').hide();
		$('#graph').hide();
		$('#searchOption1').hide();
		$('.delete1').hide();
		$('#searchOption2').hide();
		$('.delete2').hide();
		$('#searchOption3').hide();
		$('.delete3').hide();
		$('#searchOption4').hide();
		$('.delete4').hide();
		$('#searchOption5').hide();
		$('.delete5').hide();
	};

	// Set counter variable for click function
	var count = 0;

	// Set counter variable to figure out which button was deleted
	var whichButton = 0;
	// Set number of input to verify
	var whichToUse = 0;
	// Delete button pressed
	var deletePressed = false;


	// Keep track of input to make sure there are no duplicates
	var enteredInput = new Array();
	enteredInput[0], enteredInput[1], enteredInput[2], enteredInput[3], enteredInput[4] = '';

	// Display the input as checkboxes to graph
	function displayCheckboxes(){

		// Hide graph
		$('#graph').hide();

		// Button is clicked, increment counter; cannot exceed 5 inputs
		count++;

		// Verify that there is room for more input
		if (count > 5)
		{
			$('#tooMany').show().delay(1500).fadeOut();
			count--;
			return;
		}

		// Retrieve input
		var retrievedSearch = $('#userInput').val();

		// Check to make sure there is input
		if (retrievedSearch == '')
		{
			count--;
			$('#none').show().delay(1500).fadeOut();
			return;
		}

		// Check for hashtag, and if no hashtag append one to beginning
		if (retrievedSearch[0] != '#')
				retrievedSearch = '#' + retrievedSearch;

		// Check for duplicate input
		for (var i = 0; i < 5; i++)//enteredInput.length; i++)
		{
			if(retrievedSearch == enteredInput[i])
			{			
				count--;
				$('#sameInput').show().delay(1500).fadeOut();
				return;
			}
		}	
		
		// Check for double hashtags
		for (var i = 1; i < retrievedSearch.length; i++)
		{
			if (retrievedSearch[i] == '#')
			{
				count--;
				$('#failedSearch').show().delay(3000).fadeOut();
				return;
			}
		}

		// Helps to keep track of div tags
		var findDiv = '#searchOption';
		var findDel = '.delete';
		var findTag = 'Option';

		// If delete was pressed, make sure to put new input in old spot of where the one was deleted
		if(deletePressed)
		{
			whichToUse = whichButton;
			deletePressed = false;
		}

		// Else no delete pressed used the normal numbers
		else
			whichToUse = count;

		// Scan tweet for anything other than numbers, letters, underscores, and initial hashtag
		// If valid, add to search list
		if (/^[0-9A-Za-z_#]+$/.test(retrievedSearch))
		{
			// Keep track of div tags
			findDiv += whichToUse;
			findDel += whichToUse;
			findTag += whichToUse;

			// Keep track of input to check duplicates
			enteredInput[whichToUse-1] = retrievedSearch;

			// insert retrieved search with a space before
			var toDisplay = ' ' + retrievedSearch;
			document.getElementById(findTag).innerHTML = toDisplay;

			// Display the text and the delete button
			$(findDiv).show();
			$(findDel).show();
			$(findTag).show();

			// If five inputs display enough Input
			if(count == 5)
				$('#enoughInput').show().delay(2500).fadeOut();
			// Else display successful search
			else
				$('#successfulSearch').show().delay(1000).fadeOut();
		}

		// Else display error message, decrement count
		else
		{
			count--;
			$('#failedSearch').show().delay(3000).fadeOut();
		}

	}

	// Add button clicked
	$('.add').click(displayCheckboxes);


	// Enter key pressed equivalent to add button
	$('#userInput').keyup(function(event) {
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '13') {
	        displayCheckboxes();   
	    }
	});

	// Press update now key
	$('#update').click(function(){
		$('#graph').show();
	})

	$('.delete1').click(function(){
		// Decrement count
		count--;
		// Set some variable to be 1
		whichButton = 1;
		// delete entered input from the dupliate array
		enteredInput[0] = '';
		// Set deletepressed to true
		deletePressed = true;
		// Hide the checkbox
		$('#searchOption1').hide();
		// Hide the delete button
		$('.delete1').hide();
		// Hide the input
		$('#Option1').hide();
	});

	$('.delete1').click(function(){
		// Decrement count
		count--;
		// Set some variable to be 1
		whichButton = 1;
		// delete entered input from the dupliate array
		enteredInput[0] = '';
		// Set deletepressed to true
		deletePressed = true;
		// Hide the checkbox
		$('#searchOption1').hide();
		// Hide the delete button
		$('.delete1').hide();
		// Hide the input
		$('#Option1').hide();
	});

	$('.delete2').click(function(){
		// Decrement count
		count--;
		// Set some variable to be 1
		whichButton = 2;
		// delete entered input from the dupliate array
		enteredInput[1] = '';
		// Set deletepressed to true
		deletePressed = true;
		// Hide the checkbox
		$('#searchOption2').hide();
		// Hide the delete button
		$('.delete2').hide();
		// Hide the input
		$('#Option2').hide();
	});

	$('.delete3').click(function(){
		// Decrement count
		count--;
		// Set some variable to be 1
		whichButton = 3;
		// delete entered input from the dupliate array
		enteredInput[2] = '';
		// Set deletepressed to true
		deletePressed = true;
		// Hide the checkbox
		$('#searchOption3').hide();
		// Hide the delete button
		$('.delete3').hide();
		// Hide the input
		$('#Option3').hide();
	});

	$('.delete4').click(function(){
		// Decrement count
		count--;
		// Set some variable to be 1
		whichButton = 4;
		// delete entered input from the dupliate array
		enteredInput[3] = '';
		// Set deletepressed to true
		deletePressed = true;
		// Hide the checkbox
		$('#searchOption4').hide();
		// Hide the delete button
		$('.delete4').hide();
		// Hide the input
		$('#Option4').hide();
	});

	$('.delete5').click(function(){
		// Decrement count
		count--;
		// Set some variable to be 1
		whichButton = 5;
		// delete entered input from the dupliate array
		enteredInput[4] = '';
		// Set deletepressed to true
		deletePressed = true;
		// Hide the checkbox
		$('#searchOption5').hide();
		// Hide the delete button
		$('.delete5').hide();
		// Hide the input
		$('#Option5').hide();
	});
}); // end ready