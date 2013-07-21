/* Set up the YQL query (http://developer.yahoo.com/yql/) */
var query = 'SELECT * FROM twitter.search '+
            'WHERE q="#obama" ';

//var query = 'SELECT * FROM twitter.statuses.user_timeline '+ 'WHERE screen_name="jonjurisch"';
 
/* Options for the YQL request
 * q = your query
 * format = json or xml
 * env = environment to pull stored data from
 */
var dataString = {
    q: query,
    diagnostics: true,
    format: 'json',
    env: 'store://s3-us-west-2.amazonaws.com/kdghskd'
    //'store://TN1M6oELijHzwX9Rab10le' //'store://s3-us-west-2.amazonaws.com/Socr'    
};
 
/* make the AJAX request and output to the screen */
$(document).ready(function() {
    $.ajax({
        url: 'https://query.yahooapis.com/v1/public/yql',
        data: dataString,
        success: function(data) {
            $('#returnData').html(JSON.stringify(data, undefined, 2));
        }
    });
});