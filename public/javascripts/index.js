// Global variable set when a user is logged in. Note
// that this is unsafe on its own to determine this: we 
// must still verify every server request. This is just 
// for convenience across all client-side code.
currentUser = undefined;

// A few global convenience methods for rendering HTML
// on the client. Note that the loadPage methods below
// fills the main container div with some specified 
// template based on the relevant action.

var loadPage = function(template, data) {
	data = data || {};
	$('#main-container').html(Handlebars.templates[template](data));
};

// If there is a currentUser, load the sheets page, otherwise load the home page
var loadHomePage = function() {
	if (currentUser) {
		loadSheetsPage();
	} else {
		loadPage('index');
	}
};

// Loads the page to display sheets
var loadSheetsPage = function() {
	$.get('/sheets', function(response) {
		loadPage('sheets', { 
							 currentUser: currentUser });
	});
};

var loadUserPage = function() {
	$.get('')
}

// When the document is ready, checks to make sure the user is logged in, and if so sets the currentUser field to the logged in user
$(document).ready(function() {
	$.get('/users/current', function(response) {
		if (response.content.loggedIn) {
			currentUser = response.content.user;
		}
		loadHomePage();
	});
});

// When the "Home" button is pressed, go back to the home page.
$(document).on('click', '#home-link', function(evt) {
	evt.preventDefault();
	loadHomePage();
});

// When the "Sign in" button is pressed, go to the sign-in page.
$(document).on('click', '#signin-btn', function(evt) {
	loadPage('signin');
});

// When the "Register" button is pressed, go back to the registration page.
$(document).on('click', '#register-btn', function(evt) {
	loadPage('register');
});

