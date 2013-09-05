/* TO DO

TO BE DONE -

Currently to do within current scope:
Resize screen on browser change
Control panel for individual graphs: Text, logarithmic, grid
Issue with users with less than 20 tweets (if rtvisulization is third user, first two users only get first three points connected on summary graph and individual graphs)
logarithmic shooting off page for tweet between 0 and 1 hour ago (for now, clamp solves)
Bootstrap conversion
Links on info above search box
Fix delete buttons: summary graph only one messing up (needs to update automatically with new user), THOROUGHLY TEST
therock graph is wrong
table: function with delete buttons

Questions:
What should we do for checked boxes, display those graphs?
Update now displays only checked graphs?

Possible new functionality:
On hover over line, display last tweet text and time photo screen name (or all tweets)
Update now button (checkmarks tell which ones to include on summary graph)
Do auto refresh once above works
Animated summary graph

*/

$(document).ready(function(){

	/////////////////////// GLOBAL CONSTANTS //////////////////////////////////
	// Width, height, padding
	var WIDTH = 890;
	var HEIGHT = 575;
	var PADDING = 20;
	// Bootstrap Button Classes
	var BUTTONS = ['btn-inverse', 'btn-danger', 'btn-primary', 'btn-success', 'btn-custom'];
	// Bad Twitter API Results
	var ERROR1 = "{\"json\":{\"errors\":{\"message\":\"Sorry, that page does not exist\",\"code\":\"34\"}}}";
	var ERROR2 = "{\"result\":\"[]\\n\"}";
	// Set a threshold to prompt user on an infrequent user
	var TOOBIG = 1000;
	// Twitter can only return 20 tweets max
	var MAXAPI = 20;
	// Radius of Circles
	var RADIUS = [2, 4, 6, 8, 10, 12];
	// Intervals of follower numbers
	var INTERVALS = [100, 500, 100000, 1000000, 10000000];
	// Options for thickness
	var THICKNESS = [1, 2, 4, 6, 8, 10];
	// Line colors
	var COLORS = ['black', 'red', 'blue', 'green', 'purple'];
	//////////////////////////////////////////////////////////////////

	// Hide a lot of CSS stuff right after page load and let user display what they want
	window.onload = function(){
		$('.searches').hide();
		$('#graph').hide();
		$('.progress').hide();
		$('#texts').hide();
		$('.description').hide();
		$('#descriptions').hide();
		$('.tweettext').hide();
		$('.graphInstructions').hide();
		$('.graphbutton').hide();
		$('#statistics').hide();
		$('.deletebuttons').hide();
		$('#mousexample1').hide();
		$('#mousexample2').hide();
		$('.statsChecks').hide();
		$('.stats1').hide();
		$('.stats2').hide();
		$('.stats3').hide();
		$('.stats4').hide();
		$('.stats5').hide();
		//$('.explain').hide();
	};

	// Every one second, update gmt/local time
	var intervalID = setInterval(function() {
        findTime();
    }, 1000);

	// Keep track of text
	var usertweets = new Array(5);
	for (var i = 0; i < 5; i++)
		usertweets[i] = new Array(20);
	// Keep track of time
	var usertime = new Array(5);
	for (var i = 0; i < 5; i++)
		usertime[i] = new Array(20);

	//////////////// D3 ////////////////////
	/*var scalingArray = new Array();
	var maximum = new Array(0);*/
	var fakedataset = new Array();
    var dataset = new Array();
    var lengthall = new Array();
    var onegraohArray = new Array();
    var svgall;
    var combinedthickness = new Array(5);
    var individualsvg = new Array(5);
	////////////////////////////////////////

    // Success function for API
	var cb = function(data) {

		// Clear array contents so graphs don't copy at all on accident
		//finalArray = [whichToUse][];

		// Parse data and identify whether user exists
		var test = JSON.stringify(data.query.results);
		
		// If user exists
		if ((test != ERROR1) && (test != ERROR2)) {

			usertime[whichToUse-1] = [];
			usertweets[whichToUse-1] = [];

			// Parse correct data
			var tweets = JSON.parse(data.query.results.result);

			// Set up text, dates, D3 variables
			var finalArray = new Array();
			var fakeArray = new Array();
			var converteddate = new Array();
    		var seconddif = new Array();
			var thenumber = 0;
			var j = tweets.length - 1;
			var coordi = 0;
			for (var i = 0; i < tweets.length; i++)
			{
				usertweets[whichToUse-1][i] = tweets[j].text;
				usertime[whichToUse-1][i] = tweets[j].created_at;;
				j--;
				converteddate[i] = new Date(tweets[i].created_at);
				seconddif[i]= converteddate[i].getTime() /1000 ;
				var coordi = new Array();
				var coordj = new Array();
				var seconds = new Date().getTime() / 1000;
				coordi[0] = (seconds- seconddif[i]) /3600;
				coordi[1] = i;
				coordj[0] = (seconds- seconddif[i]) /3600;
				coordj[1] = i+1;
				finalArray[i] = coordi;
				fakeArray[i] = coordj;
				/*
				//var coordi = new Array();
				var seconds = new Date().getTime() / 1000;
				//coordi[0] = (seconds- seconddif[i]) /3600;
				coordi = (seconds- seconddif[i]) /3600;
				//scalingArray.push(coordi[0]);
				//coordi[1] = i;
				//finalArray[whichToUse-1][i] = coordi;
				// New Code Below
				finalArray[whichToUse-1][i] = coordi;
				scalingArray.push(coordi);*/
			}

			// If user has not tweeted in awhile, prompt user
			if (((finalArray[0])[0]) > TOOBIG)
			{
				var r = confirm("The username you have entered has not tweeted in over " + (Math.floor(((finalArray[0])[0]))) + " hours. Continue with this username?");
				if (r == false)
				{
					count--;
					$('.progress').hide();
					$('#graph').hide();
					return;
				}
			}

			// If user does not even have 20 tweets (Twitter max API), prompt user
			if (finalArray.length < MAXAPI)
			{
				var r = confirm("The username you have entered has only " + finalArray.length + " tweets in their lifetime. Continue with this username?");
				if (r == false)
				{
					count--;
					$('.progress').hide();
					$('#graph').hide();
					return;
				}
			}

			// Set up description box
			var screen_name = tweets[0].user.screen_name;
			var numberOfFollowers = tweets[0].user.followers_count;
			if (tweets[0].user.url == null)
				var URL = 'No Link on Twitter Page';
			else
				var URL = tweets[0].user.url;
			var numberOfStatuses = tweets[0].user.statuses_count;
			var photo = tweets[0].user.profile_image_url;
			var name = tweets[0].user.name;

			// See if user is protected (if so, can't retrieve text)
			var protection = tweets[0].user.protected;
			// Calculate statistics
			findStatistics(usertime[whichToUse-1], screen_name, photo);
			function findStatistics(info, name, img) {
				$('#statsinfo' + whichToUse).html("<span>@" + name + "<br><img src='" + img + "'></span>");
				// Total time between 20 tweets
				var change1 = info[0];
				var change2 = info[info.length-1];
				
				// Get both parsed times
				var timeone = getParsedTime(change1);
				var timetwo = getParsedTime(change2);
				// Find difference
				var longDistance = fancyDifference(timeone, timetwo);
				// Display long distance
				/*if (longDistance[0] > 0)
					var timediff = "The amount of time that has elapsed between the first and last tweet we retrieved for the username @" + name + " is " + longDistance[0] + " days, " + longDistance[1] + " hours, " + longDistance[2] + " minutes, and " + longDistance[3] + " seconds.";
				else
					var timediff = "The amount of time that has elapsed between the first and last tweet we retrieved for the username @" + name + " is " + longDistance[1] + " hours, " + longDistance[2] + " minutes, and " + longDistance[3] + " seconds.";
				*/
				if (longDistance[0] > 0)
					$('#range' + whichToUse).html(longDistance[0] + ' days, and ' + longDistance[1] + ':' + longDistance[2] + ':' + longDistance[3]);
				else
					$('#range' + whichToUse).html(longDistance[1] + ':' + longDistance[2] + ':' + longDistance[3]);
				
				// Get differences between tweets
				var allDifferences = new Array();
				for (var j = 0; j < (info.length-1); j++)
				{
					var y = info[j]; 
					var z = info[j+1];
					var yparse = getParsedTime(y);
					var zparse = getParsedTime(z);
					allDifferences[j] = zparse - yparse;
				}

				// Find maximum and minimum
				var minimum = Math.min.apply(null, allDifferences);
				var maximum = Math.max.apply(null, allDifferences);
				var goodMinimum = fancyDifference(0, minimum);
				var goodMaximum = fancyDifference(0, maximum);
				/*if (goodMinimum[0] > 0)
					timediff += " The minimum time between two tweets for the username @" + name + " was " + goodMinimum[0] + " days, " + goodMinimum[1] + " hours, " + goodMinimum[2] + " minutes, and " + goodMinimum[3] + " seconds.";
				else
					timediff += " The minimum time between two tweets for the username @" + name + " was " + goodMinimum[1] + " hours, " + goodMinimum[2] + " minutes, and " + goodMinimum[3] + " seconds.";
				if (goodMaximum[0] > 0)
					timediff += " The maximum time between two tweets for the username @" + name + " was " + goodMaximum[0] + " days, " + goodMaximum[1] + " hours, " + goodMaximum[2] + " minutes, and " + goodMaximum[3] + " seconds.";
				else
					timediff += " The maximum time between two tweets for the username @" + name + " was " + goodMaximum[1] + " hours, " + goodMaximum[2] + " minutes, and " + goodMaximum[3] + " seconds.";
				*/
				if (goodMinimum[0] > 0)
					$('#minimum' + whichToUse).html(goodMinimum[0] + ' days, and ' + goodMinimum[1] + ':' + goodMinimum[2] + ':' + goodMinimum[3]);
				else
					$('#minimum' + whichToUse).html(goodMinimum[1] + ':' + goodMinimum[2] + ':' + goodMinimum[3]);
				if (goodMaximum[0] > 0)
					$('#maximum' + whichToUse).html(goodMaximum[0] + ' days, and ' + goodMaximum[1] + ':' + goodMaximum[2] + ':' + goodMaximum[3]);
				else
					$('#maximum' + whichToUse).html(goodMaximum[1] + ':' + goodMaximum[2] + ':' + goodMaximum[3]);
				
				// Mean
				var sum = 0;
				for(var i = 0; i < allDifferences.length; i++)
					sum += allDifferences[i];
				sum /= allDifferences.length;
				var actualMean = fancyDifference(0, sum);
				/*if (actualMean[0] > 0)
					timediff += " The mean time between tweets for the username @" + name + " was " + actualMean[0] + " days, " + actualMean[1] + " hours, " + actualMean[2] + " minutes, and " + Math.round(actualMean[3]) + " seconds.";
				else
					timediff += " The mean time between tweets for the username @" + name + " was " + actualMean[1] + " hours, " + actualMean[2] + " minutes, and " + Math.round(actualMean[3]) + " seconds.";
					*/
				if (actualMean[0] > 0)
					$('#mean' + whichToUse).html(actualMean[0] + ' days, and ' + actualMean[1] + ':' + actualMean[2] + ':' + Math.round(actualMean[3]));
				else
					$('#mean' + whichToUse).html(actualMean[1] + ':' + actualMean[2] + ':' + Math.round(actualMean[3]));

				// Median
				var sortedDiff = allDifferences.sort();
				if ((sortedDiff % 2) == 0)
				{ 
					var lowmidpoint = (sortedDiff.length/2) - 1
					var highmidpoint = sortedDiff.length/2
					var median = Math.round(((sortedDiff[highmidpoint] - sortedDiff[lowmidpoint])/2));
				}
				else
				{
					var midpoint = (sortedDiff.length+1)/2;
					var median = sortedDiff[midpoint - 1];
				}
				var actualMedian = fancyDifference(0, median);
				/*if (actualMedian[0] > 0)
					timediff += " The median time between tweets for the username @" + name + " was " + actualMedian[0] + " days, " + actualMedian[1] + " hours, " + actualMedian[2] + " minutes, and " + Math.round(actualMedian[3]) + " seconds.";
				else
					timediff += " The median time between tweets for the username @" + name + " was " + actualMedian[1] + " hours, " + actualMedian[2] + " minutes, and " + Math.round(actualMedian[3]) + " seconds.";
				$('#stats' + whichToUse).html(timediff);
				console.log(sortedDiff);*/
				if (actualMedian[0] > 0)
					$('#median' + whichToUse).html(actualMedian[0] + ' days, and ' + actualMedian[1] + ':' + actualMedian[2] + ':' + actualMedian[3]);
				else
					$('#median' + whichToUse).html(actualMedian[1] + ':' + actualMedian[2] + ':' + actualMedian[3]);

				// Stddev
				var stddevsum = 0;
				for (var i = 0; i < allDifferences.length; i++)
				{
					var y = (allDifferences[i] - sum);
					y *= y;
					stddevsum += y;
				}
				stddevsum /= allDifferences.length;
				stddevsum = Math.sqrt(stddevsum);
				var actualStdDev = fancyDifference(0, stddevsum);
				if (actualStdDev[0] > 0)
					$('#stddev' + whichToUse).html(actualStdDev[0] + ' days, and ' + actualStdDev[1] + ':' + actualStdDev[2] + ':' + Math.round(actualStdDev[3]));
				else
					$('#stddev' + whichToUse).html(actualStdDev[1] + ':' + actualStdDev[2] + ':' + Math.round(actualStdDev[3]));
			}

			// Calculate thickness of line and circle radius
			if (numberOfFollowers < INTERVALS[0])
			{
				combinedthickness[whichToUse-1] = THICKNESS[0];
				thickness = THICKNESS[0];
				radius = RADIUS[0];
			}	
			else if (numberOfFollowers < INTERVALS[1])
			{
				combinedthickness[whichToUse-1] = THICKNESS[1];
				thickness = THICKNESS[1];
				radius = RADIUS[1];
			}
			else if (numberOfFollowers < INTERVALS[2])
			{
				combinedthickness[whichToUse-1] = THICKNESS[2];
				thickness = THICKNESS[2];
				radius = RADIUS[2];
			}
			else if (numberOfFollowers < INTERVALS[3])
			{
				combinedthickness[whichToUse-1] = THICKNESS[3];
				thickness = THICKNESS[3];
				radius = RADIUS[3];
			}
			else if (numberOfFollowers < INTERVALS[4])
			{
				combinedthickness[whichToUse-1] = THICKNESS[4];
				thickness = THICKNESS[4];
				radius = RADIUS[4];
			}
			else
			{
				combinedthickness[whichToUse-1] = THICKNESS[5];
				thickness = THICKNESS[5];
				radius = RADIUS[5];
			}

			// Set up stats table
			$('#statistics').slideUp(100);
			$('.stats' + whichToUse).show();

			// Hide all individual graphs
			$('.individual').hide();

			// Show summary graph
			$('#summarygraph').show();

			// Display description information
			$('#descriptions').fadeIn(500);
			
			// If five inputs display enough Input and hide search box
			if(count == 5)
			{
				$('#enoughInput').show().delay(4000).fadeOut();
				$('#userInput').attr('disabled', 'disabled');
			}
				
			// Else display successful search
			else
				$('#successfulSearch').show().delay(1000).fadeOut();

			// Display count of valid searches
			$('.badge-info').html("Your number of valid searches is " + count + "!").show();

			$('#description' + whichToUse).html("<p align=center>" + name + "&nbsp&nbsp<img src='" + photo + "' class='profilephoto'>&nbsp&nbsp@" + screen_name + "<table border='1' align=center><tr><td># of Followers</td><td># of Statuses</td></tr><tr><td align=center>" + numberOfFollowers + "</td><td align=center>" + numberOfStatuses + "</td></tr></table><p align=center><a href='" + URL + "' target='_blank'</a>" + URL + "</p></p>");

			// Show input along with checkbox and delete button
			var htmlForUserDelete = "<span id='content" + whichToUse + "'>&nbsp&nbsp&nbsp@";
			$(htmlForUserDelete + screen_name + '</span>').insertAfter("#searchOption" + whichToUse);
			$('#searchOption' + whichToUse).show();

			// Set up stats box
			$("<span>&nbsp@" + screen_name + "</span>").insertAfter('#statsuser' + whichToUse);
			$('#statsuser' + whichToUse).show().prop('checked', true);
			checkStatsBox();
			

			// Set up tweet text boxes
			var htmlstring = '';
			if (protection)
			{
				htmlstring += "<p align=center>This user is a protected user, meaning that SOCR cannot display the text of any of their tweets.<br>However we can still obtain the times of their tweets, so the times are shown below and correspond to the graphs appropriately.</p>"
				htmlstring += "<p align=center><img src='specific_images/glyphicons_054_clock.png'>&nbsp<div class='gmtlocaltime' align=center></div>";
				findTime();
				htmlstring += "</p><div class='timewarning'>Please note that the above times are current. All the times below are in GMT since it is a universal time, not your local time. Take into account the time difference.</div><br>";
				for (var i = tweets.length; i > 0; i--)
				{
					var manipulatedDate = changeDate(usertime[whichToUse-1][i-1]);
					htmlstring += i;
					htmlstring += '.&nbsp';
					htmlstring += manipulatedDate;
					htmlstring += "<br>";
					if(i == 1)
						htmlstring += "<p align=center><a href='#'>&uarr; back to top</a></p><br>";
				}	
			}
			else
			{
				htmlstring += "<p align=center><img src='specific_images/glyphicons_054_clock.png'>&nbsp<div class='gmtlocaltime' align=center></div>";
				findTime();
				htmlstring += "</p><div class='timewarning'>Please note that the above times are current. All the times below are in GMT since it is a universal time, not your local time. Take into account the time difference.</div><br>";
				for (var i = tweets.length; i > 0; i--)
				{
					htmlstring += i;
					htmlstring += ".&nbsp";
					var manipulatedDate = changeDate(usertime[whichToUse-1][i-1]);
					htmlstring += manipulatedDate;
					htmlstring += "<br>'";
					htmlstring += usertweets[whichToUse-1][i-1];
					htmlstring += "'<br><br>";
					if(i == 1)
						htmlstring += "<p align=center><a href='#'>&uarr; back to top</a></p><br>";
				}
			}
			$('#tweettext' + whichToUse).html(htmlstring);

			// Get rid of progress bar since lag done
			$('.progress').hide();
			$('#graph').hide();

			// Display description box for this user
			$('#description' + whichToUse).show();	

			// Display tweettext for this user (button)
			$('#user' + whichToUse).html("<br><p align=center><button class='btn " + BUTTONS[whichToUse-1] + "'>@" + screen_name + "</button></p>").show();
			$('#texts').show();

			// Show the summary graph and the buttons for individual graphs
			$('#sumbutton').show();
			$('#button' + whichToUse).html('@' + screen_name).show();

			// D3       
		    /*maximum.push(findMax(scalingArray));
		    var realMax = Math.max.apply(Math, maximum);
			renderGraph(realMax);*/

			// START OF D3 

			lengthall[whichToUse-1] = finalArray.length;
			
			for (var i = 0; i < whichToUse-1; i++)
			 	thenumber += lengthall[i];
			for (var i = 0; i < finalArray.length; i++)
				finalArray[i][1] = finalArray.length - finalArray[i][1];

		    var thelength = finalArray.length;
			fakedataset[whichToUse-1] = finalArray;
			dataset = finalArray;

			// Create individual plot
			var xind = getXScale(dataset);
			var yind = getYScale(dataset);
			var rind = getRScale(radius, dataset);
			individualsvg[whichToUse-1] = createIndividualGraph(dataset, xind, yind, rind);
			//var newGraph = createIndividualGraph(dataset, xind, yind, rind);    

			// Show graphing instructions after created
		    $('.graphInstructions').show();	

		    // Create summary plot
		    fillSummaryData();
		    var x = getXScaleAll();
		    var y = getYScaleAll();
		    var r = getRScaleAll();
		    plotSummaryGraph(x, y, r);

		    /*// Draw all lines
		    var countLines = 0;
		    // Repeat up to count
		    for (var j = 0; j < count; j++)
		    {
		    	for(var i = 0; i < fakedataset[j].length; i++)
		    	{
		    		svgall.append('line')
		  				.attr('x1',x(((fakedataset[j])[i])[0]))
				        .attr('x2',x(((fakedataset[j])[i+1])[0]))                                        
				        .attr('y1',y(((fakedataset[j])[i])[1]))
				        .attr('y2',y(((fakedataset[j])[i+1])[1]))                                     
				        .attr("stroke-width", combinedthickness[j])
				        .attr("stroke", COLORS[j])
				        .style("stroke-opacity", 0.6);
		    	}
		    	
		    }*/

		    for (var j = 0; j < fakedataset[0].length; j++)
	  		{
	  			for (var i = 0; i < count; i++)
	  			{
	  				svgall.append('line')
	  				.attr('x1',x(((fakedataset[i])[j])[0]))
			        .attr('x2',x(((fakedataset[i])[j+1])[0]))                                        
			        .attr('y1',y(((fakedataset[i])[j])[1]))
			        .attr('y2',y(((fakedataset[i])[j+1])[1]))                                     
			        .attr("stroke-width", combinedthickness[i])
			        .attr("stroke", COLORS[i])
			        .style("stroke-opacity", 0.6);

			        individualsvg[whichToUse-1].append('line')
			        .attr('x1',xind((finalArray[j])[0]))
			        .attr('x2',xind((finalArray[j+1])[0]))                                        
			        .attr('y1',yind((finalArray[j])[1]))
			        .attr('y2',yind((finalArray[j+1])[1]))                                     
			        .attr("stroke-width", thickness)
			        .attr("stroke", COLORS[whichToUse-1])
	  			}
			}
		}
		// User does not exist
		else
		{
			count--;
			$('#noExistence').show().delay(2500).fadeOut();
			$('.progress').hide();
			$('#graph').hide();
		}
	};

	// Set counter variable for click function
	var count = 0;
	// Set number of input to verify
	var whichToUse = 0;
	// Set up queue for delete buttons
	var queue = [];

	// Keep track of input to make sure there are no duplicates
	var enteredInput = new Array();
	enteredInput[0], enteredInput[1], enteredInput[2], enteredInput[3], enteredInput[4] = '';

	function getParsedTime(x) {
		var month = x[4] + x[5] + x[6];
		var day = x[8] + x[9];
		var year = x[26] + x[27] + x[28] + x[29];
		var hour = x[11] + x[12];
		var minute = x[14] + x[15];
		var second = x[17] + x[18];
		var timeone = month + ' ' + day + ', ' + year + ' ' + hour + ':' + minute + ':' + second;
		var parseone = Date.parse(timeone);
		return parseone;
	}

	function fancyDifference(a, b)
	{
		var difference = (b - a) / 3600000;
		var minuteremainder = (b - a) % 3600000;
		difference = parseInt(difference);
		// Take hour part
		var hours = Math.floor(difference);
		// Get days
		var days = Math.floor(difference/24);
		// If days > 0 modify hours
		if (days > 0)
			hours = hours % 24;
		// Get minutes part
		var minutes = Math.floor((minuteremainder/60000));
		// Get seconds part
		var secondremainder = minuteremainder % 60000;
		var seconds = secondremainder/1000;
		var arrayRet = new Array(4);
		arrayRet[0] = days;
		arrayRet[1] = hours;
		arrayRet[2] = minutes;
		arrayRet[3] = seconds;
		return arrayRet;
	}

	// Display the usernames as checkboxes to graph
	function displayCheckboxes(){

		// Set focus onto home button to keep description boxes in view, also clears search form easier
		$('#focusHere').focus();

		//$('#userInput').attr('disabled', 'disabled');
		//$('#usersearch').hide();
		
		// If anything lingering on screen, clear
		$('.searches').hide();

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

		// If queue empty, use count
		if (queue.length == 0)
			whichToUse = count;
		// If queue not empty, shift out first value that was deleted and use that
		else
			whichToUse = queue.shift();

		// Scan tweet for anything other than numbers, letters, and underscores
		// If valid, add to search list
		if (/^@?(\w){1,15}$/.test(retrievedSearch))	
		{
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
		}

		// Else display error message, decrement count
		else
		{
			count--;
			$('#failedSearch').show().delay(6000).fadeOut();
		}

		// Allow new input
	    //$('#userInput').removeAttr('disabled');
		//$('#usersearch').show();

		
	}

	// Add button clicked
	$('.add').click(displayCheckboxes);

	// Enter key pressed equivalent to add button
	$('#userInput').keyup(function(event) {
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '13') {	
			// Run function to display results
	        displayCheckboxes();
	    }
	});

	$('#update').click(function(){
		var x = getXScaleAll();
	    // Get yscale for all users entered
	    var y = getYScaleAll();
	    // Get rscale for all users entered
	    var r = getRScaleAll();
	    // Plot final graph
	    plotSummaryGraph(x, y, r);
	    // Connect lines
	    for (var j = 0; j < fakedataset[0].length; j++)
  		{
  			for (var i = 0; i < count; i++)
  			{
  				svgall.append('line')
  				.attr('x1',x(((fakedataset[i])[j])[0]))
		        .attr('x2',x(((fakedataset[i])[j+1])[0]))                                        
		        .attr('y1',y(((fakedataset[i])[j])[1]))
		        .attr('y2',y(((fakedataset[i])[j+1])[1]))                                     
		        .attr("stroke-width", combinedthickness[i])
		        .attr("stroke", COLORS[i])
		        .style("stroke-opacity", 0.6);
  			}
		}
	});

	// Buttons to display graphs
	$('#sumbutton').click(function() {
		$('.individual').hide();
		$('#summarygraph').show();
	});
	$('#button1').click(function() {
		$('#summarygraph').hide();
		$('.individual').hide();
		$('#graphuser1').show();
	});
	$('#button2').click(function() {
		$('#summarygraph').hide();
		$('.individual').hide();
		$('#graphuser2').show();
	});
	$('#button3').click(function() {
		$('#summarygraph').hide();
		$('.individual').hide();
		$('#graphuser3').show();
	});
	$('#button4').click(function() {
		$('#summarygraph').hide();
		$('.individual').hide();
		$('#graphuser4').show();
	});
	$('#button5').click(function() {
		$('#summarygraph').hide();
		$('.individual').hide();
		$('#graphuser5').show();
	});

	// Statistics Button
	$('#statsbutton').toggle(function(){
		$('#statistics').slideDown(200);
	}, function() {
		$('#statistics').slideUp(200);
	});

	// Example mouseover
	$('#example1').mouseover(function() {
		$('#mousexample1').slideDown();
	});
	$('#example1').mouseout(function() {
		$('#mousexample1').slideUp();
	});
	$('#example2').mouseover(function() {
		$('#mousexample2').slideDown();
	});
	$('#example2').mouseout(function() {
		$('#mousexample2').slideUp();
	});

	// Information mouseovers
	$('#range').mouseover(function() {
		$('#explainStats').html("The 'Range' is the distance between the most extreme points in the sample. For example, in a set {1, 5, 3, 17, 6, 10} the range is 16 since 17-1 is 16.<br><br>In our data, the range means the distance between the first and last tweet we retrieve.");
	});
	$('#median').mouseover(function() {
		$('#explainStats').html("The 'Median' is the middle point of a sorted set (which is in ascending order). For example, in the set {1, 3, 6, 9, 11} the median is 6 since it is in the middle. In a set of even number of elements, the median is tha average of the two middle points. For example, in the set {1, 3, 5, 7} the median is 4 since 3 and 5 are in the middle and the average of 3 and 5 is 4.<br><br>In our data, the median is the middle point of our retrieved tweets and denotes the median time between two tweets of the same user.");
	});
	$('#mean').mouseover(function() {
		$('#explainStats').html("The 'Mean' is the average of a set. For example, the mean of the set {1, 4, 7} is 3 since 1 + 4 + 7 = 12 and 12/3 = 4.<br><br>In our data, the mean denotes the average amount of time the user takes between subsequent tweets.");
	});
	$('#minimum').mouseover(function() {
		$('#explainStats').html("The 'Minimum' is the lowest point in a set. For example in the set {1, 0, 12, 14, 2, 6} the minimum is 0.<br><br>In our data, the minimum denotes the smallest amount of time between subsequent tweets from the tweets we retrieved, in other words, when the user was quickest in sending out back to back tweets.");
	});
	$('#maximum').mouseover(function() {
		$('#explainStats').html("The 'Maximum' is the highest point in a set. For example in the set { 4, 5, 2, 19, 23, 4, 8, 10, 34, 6} the maximum is 34.<br><br>In our data, the maximum denotes the most amount of time between subsequent tweets from the tweets we retrieved, in other words, when the user was very slow and inactive on Twitter.");
	});
	$('#stddev').mouseover(function() {
		$('#explainStats').html("The 'Standard Deviation' shows how much variation there is from the mean. If it is small, then most points are close to the mean. If it is large, then most points are scattered.<br><br>In our data, the standard deviation denotes how consistently the user is on twitter. If it is small then that means the user is consistent and a frequent user and if large vice versa.");
	});
	$('.explain').mouseout(function() {
		$('#explainStats').html("Mouseover another!");
	});

	// Statistics Tables
	// Check statistics Options
	$('.statsbutton').click(checkStatsBox);

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

	// Perform checks on stats table
	function checkStatsBox(){
		if(document.getElementById('statsuser1').checked)
			$('.stats1').show();
		else
			$('.stats1').hide();
		if(document.getElementById('statsuser2').checked)
			$('.stats2').show();
		else
			$('.stats2').hide();
		if(document.getElementById('statsuser3').checked)
			$('.stats3').show();
		else
			$('.stats3').hide();
		if(document.getElementById('statsuser4').checked)
			$('.stats4').show();
		else
			$('.stats4').hide();
		if(document.getElementById('statsuser5').checked)
			$('.stats5').show();
		else
			$('.stats5').hide();
		if(document.getElementById('rangestats').checked)
		{
			$('#range').show();
			$('#allranges').show();
		}
		else
		{
			$('#range').hide();
			$('#allranges').hide();
		}
		if(document.getElementById('meanstats').checked)
		{
			$('#mean').show();
			$('#allmeans').show();
		}
		else
		{
			$('#mean').hide();
			$('#allmeans').hide();
		}
		if(document.getElementById('medianstats').checked)
		{
			$('#median').show();
			$('#allmedians').show();
		}
		else
		{
			$('#median').hide();
			$('#allmedians').hide();
		}
		if(document.getElementById('minimumstats').checked)
		{
			$('#minimum').show();
			$('#allminimums').show();
		}
		else
		{
			$('#minimum').hide();
			$('#allminimums').hide();
		}
		if(document.getElementById('maximumstats').checked)
		{
			$('#maximum').show();
			$('#allmaximums').show();
		}
		else
		{
			$('#maximum').hide();
			$('#allmaximums').hide();
		}
		if(document.getElementById('stddevstats').checked)
		{
			$('#stddev').show();
			$('#allstddevs').show();
		}
		else
		{
			$('#stddev').hide();
			$('#allstddevs').hide();
		}
	}

	function getXScale(data) {
		var xScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) { return d[0]; })])
							 .range([WIDTH-8*PADDING,0+PADDING]);
		// Log scale for infrequent user
		/*var xScale = d3.scale.log()
							 .domain([1, d3.max(data, function(d) { return d[0]; })])
							 .range([WIDTH-8*PADDING,0+PADDING ]);*/
		return xScale;
	}

	function getYScale(data) {
		// Create y and circle scales
		var yScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) { return d[1]; })])
							 .range([HEIGHT-PADDING ,0+PADDING]);
		return yScale;
	}

	function getRScale(rad, data) {
		var rScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) { return d[1]; })])
							 .range([rad, rad]);
		return rScale;
	}

	function createIndividualGraph(data, xi, yi, ri) {
		function make_x_axis() {        
		    return d3.svg.axis()
		        .scale(xi)
		         .orient("bottom")
		         .ticks(5)
		}

		// Define X axis
		// Linear scale for frequent user
		var xAxis = d3.svg.axis()
						  .scale(xi)
						  .orient("bottom")
						  .ticks(5);
		// Log scale for infrequent user
		/*var xAxis = d3.svg.axis().scale(xScale).tickFormat(function (d) {return xScale.tickFormat(4,d3.format(",d"))(d)})*/

		//Define Y axis
		var yAxis = d3.svg.axis()
						  .scale(yi)
						  .orient("left")
						  .ticks(5);

		//Create SVG element
		var svg = d3.select("#graphuser" + whichToUse)
					.append("svg")
					.attr("width", WIDTH)
					.attr("height", HEIGHT);
	
		svg.selectAll("circle")
		   .data(data)
		   .enter()
		   .append("circle")
		   .attr("cx", function(d) {
		   		return xi(d[0]);
		   })
		   .attr("cy", function(d) {
		   		return yi(d[1]);
		   })
		   .attr("r", function(d) {
		   		return ri(d[1]);
		   })
		   .style('fill', COLORS[whichToUse-1]);;

		svg.selectAll("text")
		   .data(data)
		   .enter()
		   .append("text")
		   .text(function(d) {
		   		return "#"+(d[1]);
		   })
		   .attr("x", function(d) {
		   		return xi(d[0]) - 24;
		   })
		   .attr("y", function(d) {
		   		return yi(d[1]) - 12;
		   })
		   .attr("font-family", "sans-serif")
		   .attr("font-size", "11px")
		   .attr("fill", "black");

	    svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + (HEIGHT - PADDING) + ")")
			.call(xAxis);

		// text label for the x axis
		svg.append("text")      
			.attr("class", "x label")
	        .attr("text-anchor", "end")
	        .attr("x", WIDTH)
	        .attr("y",  HEIGHT-6 )
	        .text("Hours before Now");

	    svg.append("g")         
	        .attr("class", "grid")
	        .attr("transform", "translate(0," + (HEIGHT - PADDING) + ")")
	        .call(make_x_axis()
	            .tickSize(-HEIGHT, 0, 0)
	            .tickFormat("")
	  		)

	    svg.append("text")
	        .attr("x", 120)            
	        .attr("y", 12)
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .style("font-style", "oblique") 
	        .style("color", "blue")
	        .style("text-decoration", "underline")  
	        .text("Number of Tweets Over Time"); 

	    return svg;
	}

	function fillSummaryData() {
		if (count == 1)
		{
			for (var i = 0; i < fakedataset[0].length; i++)
				onegraohArray[i] = fakedataset[0][i];
		}
		else if (count == 2)
		{
			for (var i = 0; i < fakedataset[0].length; i++)
				onegraohArray[i] = fakedataset[0][i];
	        for (var i = fakedataset[0].length ; i < fakedataset[0].length+fakedataset[1].length; i++)
				onegraohArray[i] = fakedataset[1][i-(fakedataset[0].length)];
		}
		else if (count == 3)
		{
			for (var i = 0; i < fakedataset[0].length; i++)
				onegraohArray[i] = fakedataset[0][i];
	        for (var i = fakedataset[0].length ; i < fakedataset[0].length+fakedataset[1].length; i++)
				onegraohArray[i] = fakedataset[1][i-(fakedataset[0].length)];
			for (var i = fakedataset[0].length+fakedataset[1].length; i < fakedataset[0].length+fakedataset[1].length+fakedataset[2].length; i++)
				onegraohArray[i] = fakedataset[2][i-(fakedataset[0].length+fakedataset[1].length)];
		}
		else if (count == 4)
		{
			for (var i = 0; i < fakedataset[0].length; i++)
				onegraohArray[i] = fakedataset[0][i];
	        for (var i = fakedataset[0].length ; i < fakedataset[0].length+fakedataset[1].length; i++)
				onegraohArray[i] = fakedataset[1][i-(fakedataset[0].length)];
			for (var i = fakedataset[0].length+fakedataset[1].length; i < fakedataset[0].length+fakedataset[1].length+fakedataset[2].length; i++)
				onegraohArray[i] = fakedataset[2][i-(fakedataset[0].length+fakedataset[1].length)];
			for (var i = fakedataset[0].length+fakedataset[1].length+fakedataset[2].length ; i < fakedataset[0].length+fakedataset[1].length+fakedataset[2].length+fakedataset[3].length; i++)
				onegraohArray[i] = fakedataset[3][i-(fakedataset[0].length+fakedataset[1].length+fakedataset[2].length)];
		}
		else if (count == 5)
		{
			for (var i = 0; i < fakedataset[0].length; i++)
				onegraohArray[i] = fakedataset[0][i];
	        for (var i = fakedataset[0].length ; i < fakedataset[0].length+fakedataset[1].length; i++)
				onegraohArray[i] = fakedataset[1][i-(fakedataset[0].length)];
			for (var i = fakedataset[0].length+fakedataset[1].length; i < fakedataset[0].length+fakedataset[1].length+fakedataset[2].length; i++)
				onegraohArray[i] = fakedataset[2][i-(fakedataset[0].length+fakedataset[1].length)];
			for (var i = fakedataset[0].length+fakedataset[1].length+fakedataset[2].length ; i < fakedataset[0].length+fakedataset[1].length+fakedataset[2].length+fakedataset[3].length; i++)
				onegraohArray[i] = fakedataset[3][i-(fakedataset[0].length+fakedataset[1].length+fakedataset[2].length)];
			for (var i = fakedataset[0].length+fakedataset[1].length+fakedataset[2].length+fakedataset[3].length ; i < fakedataset[0].length+fakedataset[1].length+fakedataset[2].length+fakedataset[3].length+fakedataset[4].length; i++)
				onegraohArray[i] = fakedataset[4][i-(fakedataset[0].length+fakedataset[1].length+fakedataset[2].length+fakedataset[3].length)];
			
		}
	};
	
	function getXScaleAll() {

		if (document.getElementById('linear').checked)
		{
			var xScaleall = d3.scale.linear()
							.domain([0, d3.max(onegraohArray,function(d) { return d[0]; })])
							.range([WIDTH-8*PADDING,0+PADDING ]);
		}
		else
		{
			var xScaleall = d3.scale.log()
							.clamp(true)
							.domain([.1, d3.max(onegraohArray, function(d) { return d[0]; })])
							.range([WIDTH-8*PADDING,0+PADDING ]);
		}
		return xScaleall;
	};

	function getYScaleAll() {
		var yScaleall = d3.scale.linear().domain([0, d3.max(onegraohArray, function(d) { return d[1]; })]).range([HEIGHT-PADDING,0+PADDING]);
		return yScaleall;
	}

	function getRScaleAll() {
		var rScaleall = d3.scale.linear().domain([0, d3.max(onegraohArray, function(d) { return d[1]; })]).range([4, 4]);
		return rScaleall;
	}

	function plotSummaryGraph(xs, ys, rs) {
		function make_xall_axis() {        
		    return d3.svg.axis()
		        .scale(xs)
		         .orient("bottom")
		         .ticks(5)
		}
	
		$('#summarygraph').empty();					  
		
		svgall = d3.select("#summarygraph")
					.append("svg")
					.attr("width", WIDTH)
					.attr("height", HEIGHT);
		
		svgall.selectAll("circle")
		   .data(onegraohArray)
		   .enter()
		   .append("circle")
		   .attr("cx", function(d) {
		   		return xs(d[0]);
		   })
		   .attr("cy", function(d) {
		   		return ys(d[1]);
		   })
		   .attr("r", function(d) {
		   		return rs(d[1]);
		   });

		//Define X axis
		if (document.getElementById('linear').checked)
		{
			var xAxisall = d3.svg.axis()
						  .scale(xs)
						  .orient("bottom")
						  .ticks(5);
		}
		else
		{
			var xAxisall = d3.svg.axis().scale(xs).tickFormat(function (d) {return xs.tickFormat(5,d3.format(",d"))(d)});
		}

		//Define Y axis
		var yAxisall = d3.svg.axis()
						  .scale(ys)
						  .orient("left")
						  .ticks(5);

	    svgall.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + (HEIGHT - PADDING) + ")")
			.call(xAxisall);

		// text label for the x axis
		svgall.append("text")      
			.attr("class", "x label")
	        .attr("text-anchor", "end")
	        .attr("x", WIDTH)
	        .attr("y",  HEIGHT-6 )
	        .text("Hours before Now");

	    if (document.getElementById('Grid').checked)
		    svgall.append("g")         
	        .attr("class", "grid")
	        .attr("transform", "translate(0," + (HEIGHT - PADDING) + ")")
	        .call(make_xall_axis()
	            .tickSize(-HEIGHT, 0, 0)
	            .tickFormat("")
  		)

	    svgall.append("text")
	        .attr("x", 120)            
	        .attr("y", 12)
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .style("font-style", "oblique") 
	        .style("color", "blue")
	        .style("text-decoration", "underline")  
	        .text("Graph of All Tweets");
	}

	// Delete buttons
	// Function for delete buttons
	function deleteButtonDuties(number) {
		if (count == 1)
		{
			$('.graphInstructions').hide();
			$('#texts').hide();
			$('#summarygraph').hide();
			$('.badge-info').hide();
		}
		// Decrement count
		count--;
		// Change badge info for user
		$('.badge-info').html("Your number of valid searches is " + count + "!");
		// Enable text input
		$('#userInput').removeAttr('disabled');
		// delete entered input from the duplicate array
		enteredInput[number-1] = '';
		// Hide the checkbox
		$('#searchOption' + number).hide();
		// Hide description box
		$('#description' + number).hide();
		// Hide the tweettext
		$('#user' + number).hide();
		$('#tweettext' + number).slideUp(200);
		// Hide the graphing button
		$('#button' + number).hide();
		// Kill individual graph
		$('#graphuser' + number).empty();
		// Kill username text in search box
		$('#content' + number).empty();
		// Push that deleted entry into a queue so we can replace
		queue.push(number);
	}
	// First user deleted
	$('.delete1').click(function(){
		deleteButtonDuties(1);
	});
	// Second user deleted
	$('.delete2').click(function(){
		deleteButtonDuties(2);
	});
	// Third user deleted
	$('.delete3').click(function(){
		deleteButtonDuties(3);
	});
	// Fourth user deleted
	$('.delete4').click(function(){
		deleteButtonDuties(4);
	});
	// Fifth user deleted
	$('.delete5').click(function(){
		deleteButtonDuties(5);
	});


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
		var y = "&nbspGMT time: " + month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second + ' ';
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
		$('.gmtlocaltime').html(y+x);
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

	/*var intervalID2 = setInterval(function() {
		var width = document.getElementById('graphuser1').offsetWidth;
		alert(width);
	}, 8000);*/

		

	/*function findMax(data) {
		var maximum = data[0];
		for (var i = 1; i < data.length; i++)
	    {
	    	if (isNaN(data[i]))
	    		continue;
	    	if (data[i] >= data[i-1])
	    		maximum = data[i];
	    }
	    return maximum;
	}*/

	/*var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    x = w.innerWidth || e.clientWidth || g.clientWidth,
		    y = w.innerHeight|| e.clientHeight|| g.clientHeight;  

	function updateWindow(svg){
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    svg.attr("width", x).attr("height", y);
	}

	window.onresize = updateWindow(svgall);*/

	// Press update now key
	/*$('#update').click(function(){
		// Make the checkmarks exist so it is easier to run graph
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
		$('#toGraph').html(y);

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
	})*/
}); // end ready