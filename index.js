/* TO DO

TO BE DONE -

Currently to do within current scope:
Time scroll options: badges in navbar, show time in tweetboxes every ten tweets, mouseover effect, clock icon to right of number and mouseover shows gmt/local time above

On hover over line, display last tweet text and time photo screen name
1 graph
Resizing issues everywhere (d3)

New functionality:
Update graph in real time, dont spit out a new graph on update now
Update now does not graph right, uses wrong color
Do auto refresh once above works (easy)
Fix delete buttons

Does twitter verify whether user exists?????

Minor issues:
1. search results dropping down after error message
2. dropdown menu for stats metrics, types of d3 (cumulative, periodic)

*/

$(document).ready(function(){

	/////////////////////// GLOBALS //////////////////////////////////
	// Width, height, padding
	var WIDTH = 900;
	var HEIGHT = 575;
	var PADDING = 20;
	// Radius of Circles
	var RADIUS = [2, 4, 6, 8, 10, 12];
	// Line colors
	var COLORS = ['black', 'red', 'blue', 'green', 'purple'];
	// Intervals of follower numbers
	var INTERVALS = [100, 500, 100000, 1000000, 10000000];
	// Options for thickness
	var THICKNESS = [1, 2, 4, 6, 8, 10];
	//////////////////////////////////////////////////////////////////

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
		$('#texts').hide();
		$('.description').hide();
		$('#descriptions').hide();
		$('.tweettext').hide();
		$('#showtime').hide();
		findTime();

		// Older delete buttons
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
	};

	// Every one second, update gmt/local time
	var intervalID = setInterval(function() {
        findTime();
    }, 1000);

	function findTime() {

		// Get gmt time for user
		var d = new Date();
		var month = d.getUTCMonth();
		month++;
		var day = d.getUTCDate();
		var year = d.getUTCFullYear();
		var hour = d.getUTCHours();
		var morning = true;
		if (hour > 12)
		{
			morning = false;
			hour -= 12;
		}
		else if (hour == 0)
			hour = 12;
		var tempmin = d.getUTCMinutes();
		var minute = '0';
		if (tempmin < 10)
		{
			minute += tempmin;
		}
		else
			minute = tempmin;
		var tempsecond = d.getUTCSeconds();
		var second = '0';
		if (tempsecond < 10)
			second += tempsecond;
		else
			second = tempsecond;
		//var y = "GMT time:<br> " + month + '/' + day + '/' + year + '<br> ' + hour + ':' + minute + ':' + second + ' ';
		var y = "GMT time: " + month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second + ' ';
		if (morning)
			y += 'A.M.&nbsp&nbsp&nbsp';
		else
			y += 'P.M.&nbsp&nbsp&nbsp';
		
		// Get Local Time
		var l = new Date();
		var month = l.getMonth();
		month++;
		var day = l.getDate();
		var year = l.getFullYear();
		var hour = l.getHours();
		var morning = true;
		if (hour > 12)
		{
			morning = false;
			hour -= 12;
		}
		else if (hour == 0)
			hour = 12;
		var tempmin = l.getUTCMinutes();
		var minute = '0';
		if (tempmin < 10)
		{
			minute += tempmin;
		}
		else
			minute = tempmin;
		var tempsecond = d.getUTCSeconds();
		var second = '0';
		if (tempsecond < 10)
			second += tempsecond;
		else
			second = tempsecond;
		var x = 'Local time: ' + month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second + ' ';
		if (morning)
			x += 'A.M.';
		else
			x += 'P.M.';
		$('#showtime').html(y+x);
	}

	function changeDate(date) {
		// Manipulate Twitter API date
		var tweetWeekday = date[0] + date[1] + date[2];
		switch (tweetWeekday)
		{	
			case "Tue":
				tweetWeekday += 'sday';
				break;
			case "Wed":
				tweetWeekday += 'nesday';
				break;
			case "Thu":
				tweetWeekday += 'rsday';
				break;
			case 'Sat':
				tweetWeekday += 'urday';
				break;
			default:
				tweetWeekday += 'day';
				break;
		}
		var tweetMonth = date[4] + date[5] + date[6];
		switch (tweetMonth)
		{
			case 'Jan': tweetMonth = '01'; break;
			case 'Feb': tweetMonth = '02'; break;
			case 'Mar': tweetMonth = '03'; break;
			case 'Apr': tweetMonth = '04'; break;
			case 'May': tweetMonth = '05'; break;
			case 'Jun': tweetMonth = '06'; break;
			case 'Jul': tweetMonth = '07'; break;
			case 'Aug': tweetMonth = '08'; break;
			case 'Sep': tweetMonth = '09'; break;
			case 'Oct': tweetMonth = '10'; break;
			case 'Nov': tweetMonth = '11'; break;
			case 'Dec': tweetMonth = '12'; break;
		}
		var tweetDate = date[8] + date[9];
		var tweetHour = date[11] + date[12];
		var morning = true;
		if (tweetHour > 12)
		{
			morning = false;
			tweetHour -= 12;
			if (tweetHour < 10)
				tweetHour = '0' + tweetHour;
		}
		else if (tweetHour == 0)
			tweetHour = 12;
		var tweetMinute = date[14] + date[15];
		var tweetSecond = date[17] + date[18];
		var tweetYear = date[28] + date[29];
		var returnedDate = tweetWeekday + ' ' + tweetMonth + '/' + tweetDate + '/' + tweetYear + ' ' + '@ ' + tweetHour + ':' + tweetMinute + ':' + tweetSecond + ' ';
		if (morning)
			returnedDate += 'A.M.';
		else
			returnedDate += 'P.M.';
		return returnedDate;
	}	

	function findMax(data) {
		var maximum = data[0];
		for (var i = 1; i < data.length; i++)
	    {
	    	if (isNaN(data[i]))
	    		continue;
	    	if (data[i] >= data[i-1])
	    		maximum = data[i];
	    }
	    return maximum;
	}

	// Create new array for json parse
	var tweets = new Array();
	// Keep track of text
	var usertweets = new Array(5);
	for (var i = 0; i < 5; i++)
		usertweets[i] = new Array(20);
	// Keep track of time
	var usertime = new Array(5);
	for (var i = 0; i < 5; i++)
		usertime[i] = new Array(20);	

	//////////////// D3 ////////////////////
	var converteddate = new Array();
    var seconddif = new Array();
    var finalArray = new Array(5);
    for (var i = 0; i < 5; i++)
		finalArray[i] = new Array();
	var scalingArray = new Array();
	var maximum = new Array(0);
	////////////////////////////////////////

    // Success function for API
	var cb = function(data) {

		// Clear array contents so graphs don't copy at all on accident
		//finalArray = [whichToUse][];

		// Parse data
		tweets = JSON.parse(data.query.results.result);

		// Set up description box
		var screen_name = tweets[0].user.screen_name;
		var numberOfFollowers = tweets[0].user.followers_count;

		// Calculate thickness of line
		if (numberOfFollowers < INTERVALS[0])
		{
			thickness = THICKNESS[0];
			radius = RADIUS[0];
		}	
		else if (numberOfFollowers < INTERVALS[1])
		{
			thickness = THICKNESS[1];
			radius = RADIUS[1];
		}
		else if (numberOfFollowers < INTERVALS[2])
		{
			thickness = THICKNESS[2];
			radius = RADIUS[2];
		}
		else if (numberOfFollowers < INTERVALS[3])
		{
			thickness = THICKNESS[3];
			radius = RADIUS[3];
		}
		else if (numberOfFollowers < INTERVALS[4])
		{
			thickness = THICKNESS[4];
			radius = RADIUS[4];
		}
		else
		{
			thickness = THICKNESS[5];
			radius = RADIUS[5];
		}

		if (tweets[0].user.url == null)
			var URL = 'No Link on Twitter Page';
		else
			var URL = tweets[0].user.url;
		var numberOfStatuses = tweets[0].user.statuses_count;
		var photo = tweets[0].user.profile_image_url;
		var name = tweets[0].user.name;
		$('#description' + whichToUse).html("<p align=center>" + name + "&nbsp&nbsp<img src='" + photo + "' class='profilephoto'>&nbsp&nbsp@" + screen_name + "<table border='1' align=center><tr><td># of Followers</td><td># of Statuses</td></tr><tr><td align=center>" + numberOfFollowers + "</td><td align=center>" + numberOfStatuses + "</td></tr></table><p align=center><a href='" + URL + "' target='_blank'</a>" + URL + "</p></p>");

		// See if user is protected (if so, can't retrieve data)
		var protection = tweets[0].user.protected;

		// Set up text, dates, D3 variables
		var j = tweets.length - 1;
		for (var i = 0; i < tweets.length; i++)
		{
			usertweets[whichToUse][i] = tweets[j].text;
			usertime[whichToUse][i] = tweets[j].created_at;;
			j--;
			converteddate[i] = new Date(tweets[i].created_at);
			seconddif[i]= converteddate[i].getTime() /1000 ;
			var coordi = new Array();
			var seconds = new Date().getTime() / 1000;
			coordi[0] = (seconds- seconddif[i]) /3600;
			scalingArray.push(coordi[0]);
			coordi[1] = i;
			finalArray[whichToUse-1][i] = coordi;
		}

		// Set up tweet text
		var htmlstring = '';
		for (var i = tweets.length; i > 0; i--)
		{
			htmlstring += i;
			htmlstring += ". <a id='time'><img src='specific_images/glyphicons_054_clock.png'></a>&nbsp<a id='showtime'></a><br>"; 
			var manipulatedDate = changeDate(usertime[whichToUse][i-1]);
			htmlstring += manipulatedDate;
			htmlstring += "<br>'";
			htmlstring += usertweets[whichToUse][i-1];
			htmlstring += "' <br><br>";
			if(i == 1)
				htmlstring += "<p align=center><a href='#'>&uarr; back to top</a></p><br>";
		}
		$('#tweettext' + whichToUse).html(htmlstring);

		// Get rid of progress bar since lag done
		$('.progress').hide();
		$('#graph').hide();

		// Display description box for this user
		$('#description' + whichToUse).show();	

		// Display tweettext for this user (button)
		$('#user' + whichToUse).html("<br><p align=center><button class='btn btn-info'>@" + screen_name + "</button></p>");
		$('#texts').show();

		// Hide GMT/Local Time
		$('#showtime').hide();

		// D3       
	    maximum.push(findMax(scalingArray));
	    var realMax = Math.max.apply(Math, maximum);
		renderGraph(realMax);
	};

	function renderGraph(maxValue) {

		var thelength = finalArray[whichToUse-1].length;

		//Create scale functions
		var xScale = d3.scale.linear()
							 .domain([0, maxValue])
							 .range([WIDTH-8*PADDING,0+PADDING]);

		var yScale = d3.scale.linear()
							 .domain([0, d3.max(finalArray[whichToUse-1], function(d) { return d[1]; })])
							 .range([ 0+PADDING, HEIGHT-PADDING]);

		var rScale = d3.scale.linear()
							 .domain([0, d3.max(finalArray[whichToUse-1], function(d) { return d[1]; })])
							 .range([radius, radius]);

		//Define X axis
		var xAxis = d3.svg.axis()
						  .scale(xScale)
						  .orient("bottom")
						  .ticks(5);

		//Define Y axis
		var yAxis = d3.svg.axis()
						  .scale(yScale)
						  .orient("left")
						  .ticks(5);
		
		//Create SVG element
		var svg = d3.select("#graphuser" + whichToUse)
					.append("svg")
					.attr("width", WIDTH)
					.attr("height", HEIGHT);

		for (var j = 1; j <= count; j++)
			createCircles(svg, xScale, yScale, rScale, xAxis, yAxis, thelength, j);
	}

	function createCircles(data, x, y, r, xA, yA, l, j) {
		data.selectAll("circle")
		   .data(finalArray[whichToUse-1])
		   .enter()
		   .append("circle")
		   .attr("cx", function(d) {
		   		return x(d[0]);
		   })
		   .attr("cy", function(d) {
		   		return y(d[1]);
		   })
		   .attr("r", function(d) {
		   		return r(d[1]);
		   })
		   .style('fill', COLORS[whichToUse-1]);

		data.selectAll("text")
		   .data(finalArray[whichToUse-1])
		   .enter()
		   .append("text")
		   .text(function(d) {
		   		return "#"+(l-d[1]);
		   })
		   .attr("x", function(d) {
		   		return x(d[0]) - 20;
		   })
		   .attr("y", function(d) {
		   		return y(d[1]) - 8;
		   })
		   .attr("font-family", "sans-serif")
		   .attr("font-size", "11px")
		   .attr("fill", COLORS[whichToUse-1]);

	    data.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + (HEIGHT - PADDING) + ")")
			.call(xA);
			
		// text label for the x axis
		data.append("text")      
			.attr("class", "x label")
	        .attr("text-anchor", "end")
	        .attr("x", WIDTH)
	        .attr("y",  HEIGHT-6 )
	        .text("Hours before Now (h)");

	    data.append("text")
	        .attr("x", 120)            
	        .attr("y", 12)
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .style("font-style", "oblique") 
	        .style("color", "blue")
	        .style("text-decoration", "underline")  
	        .text("Number of Tweets Over Time");

	    // Create graph lines
		var linecolor = COLORS[whichToUse-1];
	    for (var k = 0; k < finalArray[whichToUse-1].length; k++)
  		{
	        data.append('line')
	        .attr('x1',x((finalArray[whichToUse-1][k])[0]))
	        .attr('x2',x((finalArray[whichToUse-1][k+1])[0]))                                        
	        .attr('y1',y((finalArray[whichToUse-1][k])[1]))
	        .attr('y2',y((finalArray[whichToUse-1][k+1])[1]))                                     
	        .attr("stroke-width", thickness)
	        .attr("stroke", linecolor)
		}
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

			// Keep track of input to check duplicates
			enteredInput[whichToUse-1] = retrievedSearch;

			// Set up first part of query
			var first = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20FROM%20twitter.statuses.user_timeline%20WHERE%20%20consumer_key%20%3D%20'fEHJVzLzqYjRz9Ico8ZflA'%20and%20consumer_secret%20%3D%20'oak7BhaW8hmhA2nR74aCTVOEzRuhJoKYQ4CQezNfKw'%0Aand%20access_token%20%3D%20'1594253827-Tj2P420D7VrJhAEjZOkX8P8pANG3eLIo4eCDwkx'%0Aand%20access_token_secret%20%3D%20'L7FRshIA3VosFMsKhZRMcwMrikdV0YUi1s2flnFevw'%20and%20screen_name%3D%22";
			// Set up second part of query
			var second = "%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
			// Form URL to search for using AJAX
			var searchURL = first + retrievedSearch + second;

			$('.progress').show();
			$('#graph').show();

			// Use Twitter API to retrieve data
			$.ajax({
		        url: searchURL,
		        success: cb
			});

			/*if (existence == false)
				console.log('works');*/

			// Check for whether user is protected
			/*if (protection == true)
			{
				count--;
				$('#protectedUser').show().delay(5000).fadeOut();
				return;
			}*/

			// Display description information
			$('#descriptions').fadeIn(500);

			//$('#description').fadeIn(500);

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

		// Display count of valid searches
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

	$('#time').mouseover(function(){
		$('#showtime').show();
	});

	$('#time').mouseout(function(){
		$('#showtime').hide();
	});

	// Press update now key
	$('#update').click(function(){
		// Make the checkmarks exist so it is easier to run graph
		for (var i = count + 1; i < 6; i++)
		{
			$('#searchOption' + i).html("<input type='checkbox' id='box" + i + "'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<button class='btn btn-mini btn-danger delete" + i +"' type='button'><i class='icon-remove icon-white'></i></button><br><br>").hide();
		}
		// Make array of checked boxes
		/*var checks = new Array();
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

		// Make ajax calls to refresh graphs
		for (var i = 1; i < 6; i++)
		{
			var x = '#box' + i;
			if($(x).prop('checked'))
			{
				searchURL = first + enteredInput[i-1] + second;
				$.ajax({
			        url: searchURL,
			        success: cb
				});
			}
		}
	})

	// Collapsible tweet text

	$('#user1').toggle(function(){
		$('#tweettext1').slideDown(200);
	}, function() {
		$('#tweettext1').slideUp(200);
	});

	$('#user2').toggle(function(){
		$('#tweettext2').slideDown(200);
	}, function() {
		$('#tweettext2').slideUp(200);
	});

	$('#user3').toggle(function(){
		$('#tweettext3').slideDown(200);
	}, function() {
		$('#tweettext3').slideUp(200);
	});

	$('#user4').toggle(function(){
		$('#tweettext4').slideDown(200);
	}, function() {
		$('#tweettext4').slideUp(200);
	});

	$('#user5').toggle(function(){
		$('#tweettext5').slideDown(200);
	}, function() {
		$('#tweettext5').slideUp(200);
	});

/*
	Delete buttons

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
*/
}); // end ready