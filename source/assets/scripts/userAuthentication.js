/**
 * function that allows the user to logout if signed in
 */
function logout() { // eslint-disable-line no-unused-vars
  firebase.auth().signOut().then(() => {
    console.log('successfully signed out');
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    const logoutButton = document.getElementById('login-button');
    logoutButton.innerHTML = 'Logout';
  } else {
    // No user is signed in.
    const loginButton = document.getElementById('login-button');
    loginButton.innerHTML = 'Login';
  }
});
