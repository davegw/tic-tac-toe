#[Tic-Tac-Toe](http://tic-tac-toe-yo.azurewebsites.net)

This app is an extended take on the basic tic-tac-toe game. It allows for board sizes from 3x3 to 9x9 and for 2-4 players to play.

The app was built in Javascript without the use of any libraries or frameworks (except for testing). It uses native Javascript DOM methods in place of jQuery and uses browsersify to create, require and bundle modules.

To run locally:<br>
1. Fork the repo and clone it to your local machine.<br>
2. Run `bower install` to install the testing libaries.<br>
2. Install browserify: `npm install -g browserify`<br>
3. Bundle modules using browserify: `browserify app/app.js -o public/bundle.js`<br>
4. Bundle test using browserify: `browserify test/TestRunner.js -o test/compiled/bundle.js`<br>
5. Use a static HTTP server to serve files. If you have python installed, run `python -m SimpleHTTPServer 8000` to launch a server at localhost:8000.

To run tests:<br>
1. Use bower to install mocha and chai libraries: `bower install`<br>
2. Open TestRunner.html in the test folder.
