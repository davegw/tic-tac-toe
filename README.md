#Tic-Tac-Toe
---
http://tic-tac-toe-yo.azurewebsites.net

This app is an extended take on the basic tic-tac-toe game. It allows for board sizes from 3x3 to 9x9 and for 2-4 players to play.

The app was built in Javascript without the use of any libraries or frameworks (except for testing). It uses native Javascript DOM methods in place of jQuery.

To run locally:
1. Fork the repo and clone it to your local machine.
2. Run `bower install` to install the testing libaries.
3. Use a static HTTP server to serve files. If you have python installed, run `python -m SimpleHTTPServer 8000` to launch a server at localhost:8000.

To run tests:
1. Use bower to install mocha and chai libraries: `bower install`
2. Open TestRunner.html in the test folder.
