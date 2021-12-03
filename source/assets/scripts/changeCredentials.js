/**
 * Function used to display error messages
 * @param {string} message - Used to display error from API or user mistake
 * @param {string} errorID - The ID of the error message
*/
function showError(message, errorID) {
  const errorMessage = document.getElementById(errorID);
  errorMessage.innerHTML = message;
}

/**
 * Logs users out of account and redirects to homepage
 */
function logoutAndRedirect() {
  firebase.auth().signOut();
}

/**
 * Allows the user to change email and updates to Firebase DB
 */
function onChangeEmail() { // eslint-disable-line no-unused-vars
  showError('', 'error-message-email');
  const email = document.getElementById('email').value;
  if (!email) {
    showError('Please enter an email.', 'error-message-email');
  } else if (/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(email)) {
    const user = firebase.auth().currentUser;
    user.updateEmail(email).then(() => {
      // Update successful
      window.alert('Your email has been successfully updated.');
      window.location.href = 'person.html';
    }).catch((error) => {
      // An error occurred
      const errorCode = error.code; // eslint-disable-line no-unused-vars
      if (errorCode === 'auth/requires-recent-login') {
        window.alert('Please login again in order to change email.');
        logoutAndRedirect();
      }
      const errorMessage = error.message;
      showError(errorMessage, 'error-message-email');
    });
  } else {
    showError('Email is not valid.', 'error-message-email');
  }
}

/**
 * Allows user to change password and updates to Firebase DB
 */
function onChangePassword() { // eslint-disable-line no-unused-vars
  showError('', 'error-message-password');
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  // field validation
  if (!password) {
    showError('Please enter a password.', 'error-message-password');
  } else if (!confirmPassword) {
    showError('Please verify your password.', 'error-message-password');
  } else if (password !== confirmPassword) {
    showError('Please make sure your password is the same.',
        'error-message-password');
  } else {
    const user = firebase.auth().currentUser;
    user.updatePassword(password).then(() => {
      // Update successful.
      window.alert('Your password has been successfully updated.');
      window.location.href = 'person.html';
    }).catch((error) => {
      const errorCode = error.code; // eslint-disable-line no-unused-vars
      if (errorCode === 'auth/requires-recent-login') {
        window.alert('Please login again in order to change password.');
        logoutAndRedirect();
      }
      const errorMessage = error.message;
      showError(errorMessage, 'error-message-password');
    });
  }
}

/**
 * Redirects the user to homepage if they are not logged in
*/
function redirectIfLoggedOut() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      // Redirect to home-page if user is signed in
      window.location.href = 'login.html';
    }
  });
}

redirectIfLoggedOut();
