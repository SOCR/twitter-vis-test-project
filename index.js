// Glaring Issues
// 1. search results dropping down after error message
// 2. get checkbox delete and input on same line
// 3. sync progress bar with graph
// 4. badge to display count
// 5. dropdown menu for stats metrics
// 6. after delete nothing reappears

// Twitter Stuff
// 1. verify user exists
// 2. displaying information in wrong boxes
// 3. regex does not detect space

/* 
	Twitter Pseudocode
	1. Check whether user searched for is not protected
		if so, continue
		if not, ask for new input
	2. For graph retrieval
		We need: created_at, text, .user.name
	3. d3
*/

$(document).ready(function(){

	// Hide a lot of CSS stuff right after page load and let user display what they want
	window.onload = function(){
		$('#successfulSearch').hide();
		$('#failedSearch').hide();
		$('#protectedUser').hide();
		$('#tooMany').hide();
		$('#none').hide();
		$('#sameInput').hide();
		$('#enoughInput').hide();
		$('#graph').hide();
		$('.progress').hide();
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

	// Create new array for json parse
	var tweets = new Array();

	var screen_name, numberOfFollowers, URL, numberOfStatuses,dateOfOrigin, photo, name, protection = '';

	// Create new array for json parse description
	//var userinfo = new Array();

	// Set up first part of query
	var first = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20FROM%20twitter.statuses.user_timeline%20WHERE%20%20consumer_key%20%3D%20'fEHJVzLzqYjRz9Ico8ZflA'%20and%20consumer_secret%20%3D%20'oak7BhaW8hmhA2nR74aCTVOEzRuhJoKYQ4CQezNfKw'%0Aand%20access_token%20%3D%20'1594253827-Tj2P420D7VrJhAEjZOkX8P8pANG3eLIo4eCDwkx'%0Aand%20access_token_secret%20%3D%20'L7FRshIA3VosFMsKhZRMcwMrikdV0YUi1s2flnFevw'%20and%20screen_name%3D%22"
	
	// Set up second part of query
	var second = "%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="		

	function displayDescription() {
		//Retrieve desired information depending on input
		screen_name = tweets[0].user.screen_name;
		numberOfFollowers = tweets[0].user.followers_count;
		URL = tweets[0].user.url;
		numberOfStatuses = tweets[0].user.statuses_count;
		dateOfOrigin = tweets[0].user.created_at;
		photo = tweets[0].user.profile_image_url;
		name = tweets[0].user.name;
		protection = tweets[0].user.protected;
	}

	// Success function for API
	var cb = function(data) {
		tweets = JSON.parse(data.query.results.result);
		displayDescription();
	}

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

	// Display the usernames as checkboxes to graph
	function displayCheckboxes(){

		// Hide graph
		$('#graph').hide();
		$('.progress').hide();

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

		// Clear search field back to username
		$('#userInput').val('@username');

		// Check to make sure there is input
		if (retrievedSearch == '')
		{
			count--;
			$('#none').show().delay(1500).fadeOut();
			return;
		}

		// Append @
		if (retrievedSearch[0] != '@')
			retrievedSearch = '@' + retrievedSearch;

		// Check for duplicate input
		for (var i = 0; i < 5; i++)
		{
			if(retrievedSearch == enteredInput[i])
			{			
				count--;
				$('#sameInput').show().delay(1500).fadeOut();
				return;
			}
		}	
		
		// Check for double @
		for (var i = 1; i < retrievedSearch.length; i++)
		{
			if (retrievedSearch[i] == '@')
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
		var findDescription = '#description';

		// If delete was pressed, make sure to put new input in old spot of where the one was deleted
		if(deletePressed)
		{
			whichToUse = whichButton;
			deletePressed = false;
		}

		// Else no delete pressed used the normal numbers
		else
			whichToUse = count;

		// Scan tweet for anything other than numbers, letters, and underscores
		// If valid, add to search list
		if (/[0-9A-Za-z_]{1,15}/.test(retrievedSearch)) //[0-9A-Za-z_]{1,15}/.test(retrievedSearch))
		{
			// Keep track of div tags
			findDiv += whichToUse;
			findDel += whichToUse;
			findTag += whichToUse;
			findDescription += whichToUse;

			// Keep track of input to check duplicates
			enteredInput[whichToUse-1] = retrievedSearch;

			// Form URL to search for using AJAX
			var searchURL = first + retrievedSearch + second;

			// Use Twitter API to retrieve data
			$.ajax({
		        url: searchURL,
		        success: cb
			});

			// Check for whether user is protected
			if (protection == true)
			{
				count--;
				$('#protectedUser').show().delay(3000).fadeOut();
				return;
			}

			// Set up html
			$(findDescription).html("<p align=center><img src='"+ photo +"' class='profilephoto'>  " + name + "     " + screen_name + "     " + dateOfOrigin + "     " + numberOfFollowers + "     " + numberOfStatuses + "<a href=" + URL + "</a>     " + URL + "</p>");
	
			// insert retrieved search with a space before next to check mark
			var toDisplay = ' ' + retrievedSearch;
			document.getElementById(findTag).innerHTML = toDisplay;
			//$(findDiv).html(" " + retrievedSearch + "<p align=right class='inline'><button class='btn btn-mini btn-danger delete1' type='button'><i class='icon-remove icon-white'></i></button></p><br>");
			/*var inserttext = " " + retrievedSearch + "<p align=right class='inline'><button class='btn btn-mini btn-danger delete1' type='button'><i class='icon-remove icon-white'></i></button></p><br>";
			$(inserttext).insertAfter(findDiv);*/
			/*<input type='checkbox'  id='searchOption1' value='1'><div id='Option1' class='inline'></div><p align=right 
			class='inline'><button class="btn btn-mini btn-danger delete1" type="button"><i class='icon-remove icon-white'></i>
			</button></p><br>*/

			//$(retrievedSearch).insertAfter(findDiv);

			//$("<div id='Option1'>" + retrievedSearch + "</div>").insertAfter(findDiv);
			
			//$("<label class='checkbox'><input type='checkbox'></label>" + " " + retrievedSearch).insertBefore(".delete1");



			// Set up Description Boxes
			/*function displayDescription(){

				//Retrieve desired information
				var screen_name = tweets[0].user.screen_name;
				var numberOfFollowers = tweets[0].user.followers_count;
				var URL = tweets[0].user.url;
				var numberOfStatuses = tweets[0].user.statuses_count;
				var dateOfOrigin = tweets[0].user.created_at;
				var photo = tweets[0].user.profile_image_url;
				var name = tweets[0].user.name;

				// Set up html
				$(findDescription).html("<p align=center><img src='"+ photo +"' class='profilephoto'>  " + name + "     " + screen_name + "     " + dateOfOrigin + "     " + numberOfFollowers + "     " + numberOfStatuses + "<a href=" + URL + "</a>     " + URL + "</p>");
			}

			displayDescription();*/

			// Display the text and the delete button
			$(findDiv).show();
			$(findDel).show();
			$(findTag).show();

			// If five inputs display enough Input and hide search box
			if(count == 5)
			{
				$('#enoughInput').show().delay(2500).fadeOut();
				$('#userInput').attr('disabled', 'disabled');
			}
				
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
	    	// Set focus onto update now button to help user, also clears search form easier
			$('#update').focus();
			// Run function to display results
	        displayCheckboxes();
	    }
	});

	// Press update now key
	$('#update').click(function(){
		$('#graph').show();
		$('.progress').show();
	})

	$('.delete1').click(function(){
		// Decrement count
		count--;
		// Set some variable to be 1
		whichButton = 1;
		// delete entered input from the duplicate array
		enteredInput[0] = '';
		// Set deletepressed to true
		deletePressed = true;
		// Hide the checkbox
		$('#searchOption1').hide();
		// Hide the delete button
		$('.delete1').hide();
		// Hide the input
		$('#Option1').hide();
		// Enable text input
		$('#userInput').removeAttr('disabled');
	});

	$('.delete2').click(function(){
		// Decrement count
		count--;
		// Set some variable to be 1
		whichButton = 2;
		// delete entered input from the duplicate array
		enteredInput[1] = '';
		// Set deletepressed to true
		deletePressed = true;
		// Hide the checkbox
		$('#searchOption2').hide();
		// Hide the delete button
		$('.delete2').hide();
		// Hide the input
		$('#Option2').hide();
		// Enable text input
		$('#userInput').removeAttr('disabled');
	});

	$('.delete3').click(function(){
		// Decrement count
		count--;
		// Set some variable to be 1
		whichButton = 3;
		// delete entered input from the duplicate array
		enteredInput[2] = '';
		// Set deletepressed to true
		deletePressed = true;
		// Hide the checkbox
		$('#searchOption3').hide();
		// Hide the delete button
		$('.delete3').hide();
		// Hide the input
		$('#Option3').hide();
		// Enable text input
		$('#userInput').removeAttr('disabled');
	});

	$('.delete4').click(function(){
		// Decrement count
		count--;
		// Set some variable to be 1
		whichButton = 4;
		// delete entered input from the duplicate array
		enteredInput[3] = '';
		// Set deletepressed to true
		deletePressed = true;
		// Hide the checkbox
		$('#searchOption4').hide();
		// Hide the delete button
		$('.delete4').hide();
		// Hide the input
		$('#Option4').hide();
		// Enable text input
		$('#userInput').removeAttr('disabled');
	});

	$('.delete5').click(function(){
		// Decrement count
		count--;
		// Set some variable to be 1
		whichButton = 5;
		// delete entered input from the duplicate array
		enteredInput[4] = '';
		// Set deletepressed to true
		deletePressed = true;
		// Hide the checkbox
		$('#searchOption5').hide();
		// Hide the delete button
		$('.delete5').hide();
		// Hide the input
		$('#Option5').hide();
		// Enable text input
		$('#userInput').removeAttr('disabled');
	});
}); // end ready