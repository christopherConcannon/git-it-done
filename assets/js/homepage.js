var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');
var languageButtonsEl = document.querySelector('#language-buttons');

var formSubmitHandler = function(event) {
	event.preventDefault();
	// get value from input element
	var username = nameInputEl.value.trim();

	// if there is a user input
	if (username) {
		// pass the input value as an argument to request function
		getUserRepos(username);
		// reset form field
		nameInputEl.value = '';
	} else {
		alert('Please enter a GitHub username');
	}
};

// get repos by user name
var getUserRepos = function(user) {
	// format the github api url
	// var apiUrl = "https://api.github.com/users/" + user + "/repos";
	var apiUrl = `https://api.github.com/users/${user}/repos`;

	// make a request to the url
	// 	fetch(apiUrl).then(function(response) {
	//     if (response.ok) {
	//       response.json().then(function(data) {
	//         displayRepos(data, user);
	//       });
	//     } else {
	//       alert('Error: ' + response.statusText);
	//     }
	// 	});
	// };
	fetch(apiUrl)
		.then(function(response) {
			// request was successful
			if (response.ok) {
				response.json().then(function(data) {
					displayRepos(data, user);
				});
			} else {
				alert('Error: ' + response.statusText);
			}
		})
		.catch(function(error) {
			// Notice this '.catch()' getting chained onto the end of the '.then()'
			alert('Unable to connect to GitHub');
		});
};

// get featured repos by language
var getFeaturedRepos = function(language) {
	var apiUrl =
		'https://api.github.com/search/repositories?q=' +
		language +
		'+is:featured&sort=help-wanted-issues';

	fetch(apiUrl).then(function(response) {
		if (response.ok) {
			response.json().then(function(data) {
				displayRepos(data.items, language);
			});
			// response.json().then(function(data) {
			// 	console.log(data);
			// });
		} else {
			alert('Error: ' + response.statusText);
		}
	});
};

var buttonClickHandler = function(event) {
  var language = event.target.getAttribute('data-language');
  // make sure element whose click was delegated has the data-language attribute
	if (language) {
		getFeaturedRepos(language);

		// clear ol content
		repoContainerEl.textContent = '';
	}
};

var displayRepos = function(repos, searchTerm) {
	// check if api returned any repos (does user have repos?)
	if (repos.length === 0) {
		repoContainerEl.textContent = 'No repositories found';
		return;
	}
	// clear old content
	repoContainerEl.textContent = '';
	repoSearchTerm.textContent = searchTerm;

	// loop over repos
	for (var i = 0; i < repos.length; i++) {
		// format repo name   octocat/boysenberry-repo-1
		var repoName = repos[i].owner.login + '/' + repos[i].name;

		// create a link for each repo
		var repoEl = document.createElement('a');
		repoEl.classList = 'list-item flex-row justify-space-between align-center';
		// dynamically redirect to user clicked repo
		repoEl.setAttribute('href', `./single-repo.html?repo=${repoName}`);

		// create a span element to hold repository name
		var titleEl = document.createElement('span');
		titleEl.textContent = repoName;

		// append title to repo container
		repoEl.appendChild(titleEl);

		// create a status element
		var statusEl = document.createElement('span');
		statusEl.classList = 'flex-row align-center';

		// check if current repo has issues or not
		if (repos[i].open_issues_count > 0) {
			//  statusEl.innerHTML =
			//   "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
			statusEl.innerHTML = `<i class='fas fa-times status-icon icon-danger'></i>${repos[
				i
			].open_issues_count} issue(s)`;
		} else {
			statusEl.innerHTML =
				"<i class='fas fa-check-square status-icon icon-success'></i>";
		}

		// append to container
		repoEl.appendChild(statusEl);

		// append each repo container to the dom...right hand column
		repoContainerEl.appendChild(repoEl);
	}
};

userFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);
