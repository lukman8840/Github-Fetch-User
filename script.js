// API endpoint for fetching GitHub user data
const APIURL = 'https://api.github.com/users/'

// DOM elements for main content area, form, search input, and dark mode toggle button
const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')
const toggleDarkMode = document.getElementById('toggle')

// Function to show a loading indicator while fetching data
function showLoadingIndicator() {
    main.innerHTML = `<div class="loader"></div>`
}

// Asynchronous function to get GitHub user data based on the username
async function getUser(username) {
    showLoadingIndicator(); // Show loading indicator

    try {
        // Fetch user data from GitHub API
        const { data } = await axios(APIURL + username)
        createUserCard(data) // Create a user card with the fetched data
        getRepos(username) // Fetch and display the user's repositories
    } catch(err) {
        // Handle errors, such as user not found or other issues
        if(err.response && err.response.status === 404){
            createErrorCard('No profile with this username') // Show error if user is not found
        } else {
            createErrorCard('Something went wrong. Please try again later') // Show generic error message
        }
    }
}

// Asynchronous function to get a user's repositories from GitHub
async function getRepos(username) {
    try {
        // Fetch repositories data from GitHub API, sorted by creation date
        const { data } = await axios(APIURL + username + '/repos?sort=created')
        addReposToCard(data) // Add repositories to the user card
    } catch(err) {
        createErrorCard('Problem fetching repos') // Show error if fetching repos fails
    }
}

// Function to create and display a user card with the fetched user data
function createUserCard(user) {
    const userID = user.name || user.login // Use the user's name or login as their ID
    const userBio = user.bio ? `<p>${user.bio}</p>` : ''; // Display the user's bio if available
    const cardHTML = `
        <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${userID}</h2>
                ${userBio}
                <ul>
                    <li>${user.followers} <strong>Followers</strong></li>
                    <li>${user.following} <strong>Following</strong></li>
                    <li>${user.public_repos} <strong>Repositories</strong></li>
                </ul>
                <div id="repos"></div>
            </div>
        </div>
    `;
    main.innerHTML = cardHTML; // Display the user card in the main content area
}

// Function to add the user's repositories to the user card
function addReposToCard(repos) {
    const reposEL = document.getElementById('repos')

    // Display the first 5 repositories
    repos
    .slice(0, 5)
    .forEach(repo => {
        const repoEL = document.createElement('a')
        repoEL.classList.add('repo')
        repoEL.href = repo.html_url
        repoEL.target = '_blank'
        repoEL.innerText = repo.name;

        reposEL.appendChild(repoEL) // Append each repository link to the card
    })
}

// Event listener for toggling dark mode
toggleDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode')
})

// Event listener for form submission to search for a GitHub user
form.addEventListener('submit', (e) => {
    e.preventDefault() // Prevent the form from submitting in the traditional way

    const user = search.value; // Get the value from the search input

    if(user) {
        getUser(user) // Fetch and display the user data
        search.value = '' // Clear the search input
    }
})
