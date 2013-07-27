/* TO DO

D3 Graph (time zone - use gmt)
Fix delete buttons
Get ajax working with text and times for all users
Search suggestions

Store times and tweet text, format time in desired manner

Does twitter verify whether user exists

Minor issues:
1. search results dropping down after error message
2. sync progress bar with graph
3. dropdown menu for stats metrics, types of d3 (cumulative, periodic)

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
		//$('#searchOption1').hide();
		//$('.delete1').hide();
		//$('#searchOption2').hide();
		//$('.delete2').hide();
		//$('#searchOption3').hide();
		//$('.delete3').hide();
		//$('#searchOption4').hide();
		//$('.delete4').hide();
		//$('#searchOption5').hide();
		//$('.delete5').hide();
		$('.description').hide();
		$('#descriptions').hide();
		$('.tweettext').hide();
	};

	// Create new array for json parse
	var tweets = new Array();

	/*
	var user1tweets = new Array();
	var user2tweets = new Array();
	var user3tweets = new Array();
	var user4tweets = new Array();
	var user5tweets = new Array();*/

	var texttweets = new Array();
	var datetweets = new Array();

	var screen_name, numberOfFollowers, URL, numberOfStatuses, photo, name, protection = '';

	// Create new array for json parse description
	//var tweetWeekday, tweetMonth, tweetDate, tweetHour, tweetMinute, tweetSecond;

	var findDescription = '#description';

	// Set up first part of query
	var first = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20FROM%20twitter.statuses.user_timeline%20WHERE%20%20consumer_key%20%3D%20'fEHJVzLzqYjRz9Ico8ZflA'%20and%20consumer_secret%20%3D%20'oak7BhaW8hmhA2nR74aCTVOEzRuhJoKYQ4CQezNfKw'%0Aand%20access_token%20%3D%20'1594253827-Tj2P420D7VrJhAEjZOkX8P8pANG3eLIo4eCDwkx'%0Aand%20access_token_secret%20%3D%20'L7FRshIA3VosFMsKhZRMcwMrikdV0YUi1s2flnFevw'%20and%20screen_name%3D%22";
	
	// Set up second part of query
	var second = "%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";		

	/*
	function customParser(date) {
		var day = date[0] + date[1] + date[2];
	}
	*/

	function displayDescription() {
		//Retrieve desired information depending on input
		screen_name = tweets[0].user.screen_name;
		numberOfFollowers = tweets[0].user.followers_count;
		if (tweets[0].user.url == null)
			URL = 'No Link on Twitter Page';
		else
			URL = tweets[0].user.url;
		numberOfStatuses = tweets[0].user.statuses_count;
		photo = tweets[0].user.profile_image_url;
		name = tweets[0].user.name;
		protection = tweets[0].user.protected;
	}

	/*
	function parseTimes() {
		//var whichUser = 'user';
		//whichUser += whichToUse;
		//whichUser += 'tweets';
		for (var i = 0; i < tweets.length; i++)
		{
			//whichUser[i] = tweets[i].created_at;
			//alert(tweets[i].created_at);
			tweetWeekday = tweets[i].created_at[0] + tweets[i].created_at[1] + tweets[i].created_at[2];
			tweetMonth = tweets[i].created_at[4] + tweets[i].created_at[5] + tweets[i].created_at[6];
			tweetDate = tweets[i].created_at[8] + tweets[i].created_at[9];
			tweetHour = tweets[i].created_at[11] + tweets[i].created_at[12];
			tweetMinute = tweets[i].created_at[14] + tweets[i].created_at[15];
			tweetSecond = tweets[i].created_at[17] + tweets[i].created_at[18];
			alert(tweets[i].created_at + ',' + tweetWeekday);
			//alert(tweets)
			//alert(dayOfWeek);
		}
	}
	*/

	// Success function for API
	var cb = function(data) {
		tweets = JSON.parse(data.query.results.result);
		displayDescription();
		for (var i = 0; i < tweets.length; i++)
		{
			texttweets[i] = tweets[i].text;
			datetweets[i] = tweets[i].created_at;
		}
		var htmlstring = '';
		for (var i = 0; i < tweets.length; i++)
		{
			htmlstring += (i+1);
			htmlstring += ". Time tweet made: "; 
			htmlstring += datetweets[i];
			htmlstring += "<br> Text of that tweet: '"
			htmlstring += texttweets[i]; //tweets[i].text;
			htmlstring += "' <br>";
		}
		$('#tweettext' + whichToUse).html(htmlstring);
		// Set up html
		$(findDescription).html("<p align=center>" + name + "&nbsp&nbsp<img src='" + photo + "' class='profilephoto'>&nbsp&nbsp@" + screen_name + "<table border='1' align=center><tr><td># of Followers</td><td># of Statuses</td></tr><tr><td align=center>" + numberOfFollowers + "</td><td align=center>" + numberOfStatuses + "</td></tr></table><p align=center><a href='" + URL + "' target='_blank'</a>" + URL + "</p></p>");	
		//parseTimes();
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

	// Graph
	/*function createGraph() {
		// Create y axis
		var yscale = d3.scale.linear().domain([0, 20]).range([0,20]);
		var xAxis = d3.svg.axis()
							  .scale(yScale)
							  .orient("bottom");
		// Create x axis

	}*/


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
		if (/^@?(\w){1,15}$/.test(retrievedSearch))	
		{
			// Keep track of div tags
			findDiv += whichToUse;
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
				$('#protectedUser').show().delay(5000).fadeOut();
				return;
			}

			// Display description information
			$('#descriptions').fadeIn(500);

			$(findDescription).fadeIn(500);

			// Show tweet text
			/*var htmlstring = '';
			for (var i = 0; i < tweets.length; i++)
			{
				htmlstring += (i+1);
				htmlstring += ". Time tweet made: "; 
				htmlstring += datetweets[i];
				htmlstring += "<br> Text of that tweet: '"
				htmlstring += texttweets[i]; //tweets[i].text;
				htmlstring += "' <br>";
			}
			$('#tweettext' + whichToUse).html(htmlstring);*/

			// Show input along with checkbox and delete button
			$(findDiv).html("<input type='checkbox' id='box" + whichToUse + "'>&nbsp&nbsp&nbsp" + retrievedSearch + "&nbsp&nbsp&nbsp<button class='btn btn-mini btn-danger delete" + whichToUse +"' type='button'><i class='icon-remove icon-white'></i></button><br><br>")

			// If five inputs display enough Input and hide search box
			if(count == 5)
			{
				$('#enoughInput').show().delay(4000).fadeOut();
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
			$('#failedSearch').show().delay(6000).fadeOut();
		}
		$('.badge-info').html("Your number of valid searches is " + count + "!");
	}

	// Add button clicked
	$('.add').click(displayCheckboxes);


	// Enter key pressed equivalent to add button
	$('#userInput').keyup(function(event) {
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '13') {
	    	// Set focus onto home button to keep description boxes in view, also clears search form easier
			$('#focusHere').focus();
			// Run function to display results
	        displayCheckboxes();
	    }
	});

	// Press update now key
	$('#update').click(function(){
		$('#graph').show();
		$('.progress').show();
		/* Make the checkmarks exist so it is easier to run graph
		for (var i = count + 1; i < 6; i++)
		{
			$('#searchOption' + i).html("<input type='checkbox' id='box" + i + "'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<button class='btn btn-mini btn-danger delete" + i +"' type='button'><i class='icon-remove icon-white'></i></button><br><br>").hide();
		}
		// Make array of checked boxes
		var checks = new Array();
		for (var i = 1; i < 6; i++)
		{
			var x = '#box' + i;
			if($(x).prop('checked'))
				checks.push(i);
		}
		var y = "SOCR will graph the tweets for the following users: ";
		for (var i = 0; i < checks.length; i++)
		{
			y += checks[i];
			if (i == (checks.length - 1))
				y += '.';
			else
				y += ', ';
		}
		$('#toGraph').html(y);*/
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
		// Hide description box
		$('#description1').hide();
		// Hide the tweettext
		$('#tweettext1').hide();
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
		// Hide description box
		$('#description2').hide();
		// Enable text input
		$('#userInput').removeAttr('disabled');
		$('#tweettext2').hide();
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
		// Hide description box
		$('#description3').hide();
		// Enable text input
		$('#userInput').removeAttr('disabled');
		$('#tweettext3').hide();
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
		// Hide description box
		$('#description4').hide();
		// Enable text input
		$('#userInput').removeAttr('disabled');
		$('#tweettext4').hide();
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
		// Hide description box
		$('#description5').hide();
		// Enable text input
		$('#userInput').removeAttr('disabled');
		$('#tweettext5').hide();
	});

	$('#description1').click(function(){
		$('#tweettext1').fadeIn(500);
	});

	$('#description2').click(function(){
		$('#tweettext2').fadeIn(500);
	});

	$('#description3').click(function(){
		$('#tweettext3').fadeIn(500);
	});

	$('#description4').click(function(){
		$('#tweettext4').fadeIn(500);
	});

	$('#description5').click(function(){
		$('#tweettext5').fadeIn(500);
	});

}); // end ready