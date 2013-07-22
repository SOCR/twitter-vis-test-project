/* Set up the YQL query (http://developer.yahoo.com/yql/) */
/*var query = 'SELECT * FROM twitter.search '+
            'WHERE q="#obama" ';*/

//var query = 'http://query.yahooapis.com/v1/public/yql?q=%20SELECT%20*%20FROM%20twitter.statuses.user_timeline%20%0AWHERE%20consumer_key%20%3D%20'fEHJVzLzqYjRz9Ico8ZflA'%20and%20consumer_secret%20%3D%20'oak7BhaW8hmhA2nR74aCTVOEzRuhJoKYQ4CQezNfKw'%0Aand%20access_token%20%3D%20'1594253827-Tj2P420D7VrJhAEjZOkX8P8pANG3eLIo4eCDwkx'%0Aand%20access_token_secret%20%3D%20'L7FRshIA3VosFMsKhZRMcwMrikdV0YUi1s2flnFevw'%20and%20screen_name%3D%22therock%22&format=json&diagnostics=true&env=store%3A%2F%2FTN1M6oELijHzwX9Rab10le&callback=cbfunc';

/*SELECT * FROM twitter.statuses.user_timeline 
WHERE consumer_key = 'fEHJVzLzqYjRz9Ico8ZflA' and consumer_secret = 'oak7BhaW8hmhA2nR74aCTVOEzRuhJoKYQ4CQezNfKw'
and access_token = '1594253827-Tj2P420D7VrJhAEjZOkX8P8pANG3eLIo4eCDwkx'
and access_token_secret = 'L7FRshIA3VosFMsKhZRMcwMrikdV0YUi1s2flnFevw' and screen_name="therock"*/

//var query = 'SELECT * FROM twitter.statuses.user_timeline '+ 'WHERE screen_name="jonjurisch"';
 
/* Options for the YQL request
 * q = your query
 * format = json or xml
 * env = environment to pull stored data from
 */

 /* SELECT * FROM twitter.statuses.user_timeline 
WHERE consumer_key = 'fEHJVzLzqYjRz9Ico8ZflA' and consumer_secret = 'oak7BhaW8hmhA2nR74aCTVOEzRuhJoKYQ4CQezNfKw'
and access_token = '1594253827-Tj2P420D7VrJhAEjZOkX8P8pANG3eLIo4eCDwkx'
and access_token_secret = 'L7FRshIA3VosFMsKhZRMcwMrikdV0YUi1s2flnFevw' and screen_name="therock"

"http://query.yahooapis.com/v1/public/yql?q=%20SELECT%20*%20FROM%20twitter.statuses.user_timeline%20%0AWHERE%20consumer_key%20%3D%20'fEHJVzLzqYjRz9Ico8ZflA'%20and%20consumer_secret%20%3D%20'oak7BhaW8hmhA2nR74aCTVOEzRuhJoKYQ4CQezNfKw'%0Aand%20access_token%20%3D%20'1594253827-Tj2P420D7VrJhAEjZOkX8P8pANG3eLIo4eCDwkx'%0Aand%20access_token_secret%20%3D%20'L7FRshIA3VosFMsKhZRMcwMrikdV0YUi1s2flnFevw'%20and%20screen_name%3D%22therock%22&format=json&diagnostics=true&env=store%3A%2F%2FTN1M6oELijHzwX9Rab10le&callback="
*/


var dataString = {
    q: "http://query.yahooapis.com/v1/public/yql?q=%20SELECT%20*%20FROM%20twitter.statuses.user_timeline%20%0AWHERE%20consumer_key%20%3D%20'fEHJVzLzqYjRz9Ico8ZflA'%20and%20consumer_secret%20%3D%20'oak7BhaW8hmhA2nR74aCTVOEzRuhJoKYQ4CQezNfKw'%0Aand%20access_token%20%3D%20'1594253827-Tj2P420D7VrJhAEjZOkX8P8pANG3eLIo4eCDwkx'%0Aand%20access_token_secret%20%3D%20'L7FRshIA3VosFMsKhZRMcwMrikdV0YUi1s2flnFevw'%20and%20screen_name%3D%22therock%22&format=json&diagnostics=true&env=store%3A%2F%2FTN1M6oELijHzwX9Rab10le&callback=cbfunc",
    diagnostics: true,
    format: 'json',
    //env: 'store://TN1M6oELijHzwX9Rab10le'//store://s3-us-west-2.amazonaws.com/socrucla4' //'store://s3-us-west-2.amazonaws.com/kdghskd' store://s3-us-west-2.amazonaws.com/socrucla4
    //'store://TN1M6oELijHzwX9Rab10le' //'store://s3-us-west-2.amazonaws.com/Socr'    
};

var cb = function(data) {
    $('#returnData').html(JSON.stringify(data, undefined, 2));
}
 
/* make the AJAX request and output to the screen */
$(document).ready(function() {
    $.ajax({
        url: "http://query.yahooapis.com/v1/public/yql?q=%20SELECT%20*%20FROM%20twitter.statuses.user_timeline%20%0AWHERE%20consumer_key%20%3D%20'fEHJVzLzqYjRz9Ico8ZflA'%20and%20consumer_secret%20%3D%20'oak7BhaW8hmhA2nR74aCTVOEzRuhJoKYQ4CQezNfKw'%0Aand%20access_token%20%3D%20'1594253827-Tj2P420D7VrJhAEjZOkX8P8pANG3eLIo4eCDwkx'%0Aand%20access_token_secret%20%3D%20'L7FRshIA3VosFMsKhZRMcwMrikdV0YUi1s2flnFevw'%20and%20screen_name%3D%22therock%22&format=json&diagnostics=true&env=store%3A%2F%2FTN1M6oELijHzwX9Rab10le&callback=",//'https://query.yahooapis.com/v1/public/yql',
        //data: dataString,
        success: cb//function(data) {
            
            //$('#returnData').html(JSON.stringify(data, undefined, 2));
            //$('#returnData').html(JSON.parse(data));
        //}
    });
});