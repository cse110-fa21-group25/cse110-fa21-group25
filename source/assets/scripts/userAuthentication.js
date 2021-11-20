/**
 * function that allows the user to logout if signed in
 */
function logout() { // eslint-disable-line no-unused-vars
  firebase.auth().signOut().then(() => {
    console.log('successfully signed out');
  })
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    const loginLink = document.getElementById('login');
    const logoutLink = document.getElementById('logout');
    loginLink.setAttribute('hidden', true);
    logoutLink.removeAttribute('hidden');
  } else {
    // No user is signed in.
    const loginLink = document.getElementById('login');
    const logoutLink = document.getElementById('logout');
    loginLink.removeAttribute('hidden');
    logoutLink.setAttribute('hidden', true);
  }
});
