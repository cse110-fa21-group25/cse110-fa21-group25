/**
 * Function used to display error messages
 * @param {string} message - Used to display error from API or user mistake
*/
function showError(message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.innerHTML = message;
}

/** Function used to handle user login using Firebase DB */
function login() { // eslint-disable-line no-unused-vars
  // Resets error message
  showError('');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email) {
    showError('Please enter an email.');
  } else if (!password) {
    showError('Please enter a password.');
  } else {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;// eslint-disable-line no-unused-vars
          window.location.href = 'home-page.html';
        })
        .catch((error) => {
          const errorCode = error.code; // eslint-disable-line no-unused-vars
          const errorMessage = error.message;
          showError(errorMessage);
        });
  }
}

/** Function used to create new users in Firebase DB. */
function signup() { // eslint-disable-line no-unused-vars
  // Resets error message
  showError('');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  // field validation
  if (!email) {
    showError('Please enter an email.');
  } else if (!password) {
    showError('Please enter a password.');
  } else if (!confirmPassword) {
    showError('Please verify your password.');
  } else if (password !== confirmPassword) {
    showError('Please make sure your password is the same.');
  } else {
    // creating a user with email & password
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;// eslint-disable-line no-unused-vars
          window.location.href = 'home-page.html'; // redirects to home page
        }).catch((error) => {
          const errorCode = error.code; // eslint-disable-line no-unused-vars
          const errorMessage = error.message;
          showError(errorMessage);
        });
  }
}
/**
 * Redirects the user to homepage if they are already signed in
 * and attempt to access either the login or sign up page(s)
*/
function redirectIfLoggedIn() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Redirect to home-page if user is signed in
      window.location.href = 'home-page.html';
    }
  });
}

redirectIfLoggedIn();
