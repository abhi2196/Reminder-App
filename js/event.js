// Client ID and API key from the Developer Console
var CLIENT_ID = '<USE_YOUR_CLIENT_ID>';
var API_KEY = '<USE_YOUR_APP_KEY>';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.events";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var createButton = document.getElementById('create_button');
var eventForm = document.getElementById('event_form');
var eventSummary = document.getElementById('event_summary');
var eventDescription = document.getElementById('event_description');
var eventCount = document.getElementById('event_count');
var eventPattern = document.getElementById('event_pattern');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    createButton.onclick = handleCreateClick;
  }, function(error) {
    alert(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    createButton.style.display = 'block';
    eventForm.style.display = 'block';
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    createButton.style.display = 'none'
    eventForm.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  var pre = document.getElementById('content');
  while (pre.hasChildNodes()) {
    pre.removeChild(pre.firstChild);
  }
  gapi.auth2.getAuthInstance().signOut();
}

function handleCreateClick(event) {
  if (validate_input()) {
    createEvent(eventSummary.value, eventDescription.value, eventCount.value, eventPattern.value);
  }
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    appendPre('Upcoming events:');

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        appendPre(event.summary + ' (' + when + ')')
      }
    } else {
      appendPre('No upcoming events found.');
    }
  });
}

/**
 * Create a Event/Reminder in Google Calender
 * with custom recurrence pattern provided by user.
 */
function createEvent(summary, description, count, pattern) {
  var curr_date = new Date();
  var curr_day = curr_date.getDate();
  var occurence_count = count;
  var days_pattern = pattern.split(",")
  var days_out_pattern = [];
  var tmp_date = new Date();

  if (occurence_count == days_pattern.length) {
    for (i = 0; i < occurence_count; i++) {
      days_pattern[i] = parseInt(days_pattern[i], 10)
    }

    for (i = 0; i < occurence_count; i++) {
      tmp_date.setDate(curr_day + days_pattern[i]);
      days_out_pattern[i] = tmp_date.getDate();
    }

    curr_date.setDate(curr_day + days_pattern[0])

    var event = {
      'summary': summary,
      'location': '',
      'description': description,
      'start': {
        'dateTime': curr_date.toISOString(),
        'timeZone': 'Asia/Kolkata'
      },
      'end': {
        'dateTime': curr_date.toISOString(),
        'timeZone': 'Asia/Kolkata'
      },
      'recurrence': [
        `RRULE:FREQ=MONTHLY;INTERVAL=1;COUNT=${occurence_count};BYMONTHDAY=${days_out_pattern.join()}`
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'popup', 'minutes': 10}
        ]
      }
    };

    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });

    request.execute(function(event) {
      alert('Event created: ' + event.htmlLink);
    });
  } else {
    alert('Event Count and Pattern Element Count should be equal!');
  }
}

/**
 * Validate form input variables for empty values.
 */
function validate_input() {
  var check = true;

  if(eventSummary.value.trim() == ''){
      check=false;
  }

  if(eventPattern.value.trim() == ''){
      check=false;
  }

  return check;
}
