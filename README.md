Remind Me is a Web App for Creating reminders on Google calendar with custom intervals for recurring events.

## Installation

* Update the ```CLIENT_ID``` and ```API_KEY``` in the js/event.js file.

   [Authorising with Google Calendar API](https://developers.google.com/calendar/auth)
* Use any server to host this application.

  For Example:
  ```bash
  $ cd remind_me
  $ python3 -m http.server 8000
  ...
  ```

## Usage
![Authorise Application for using your google account](https://github.com/abhi2196/remind_me/images/usage/authorize.png)

![This App only needs Google Calendar View/edit permissions](https://github.com/abhi2196/remind_me/images/usage/allow.png)

![Create a event](https://github.com/abhi2196/remind_me/images/usage/create_event.png)
* Provide Event Name
* Provide Recurrence Count for Event (minimum: 1, maximum: 10)
* Provide Custom Recurrence Pattern (comma separated list of numbers e.g. 5,10,15)
  This defines the interval period between your recurring events.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
