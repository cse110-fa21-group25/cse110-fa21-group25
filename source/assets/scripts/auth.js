function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = message;
  }
  
function login() {
  // Resets error message
  showError("");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email) {
    showError("Please enter an email.");
  } else if (!password) {
    showError("Please enter a password.");
  } else {
    firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        showError(errorMessage);
      });
  }
}

function signup() {
  // Resets error message
  showError("");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  //field validation
  if (!email) {
    showError("Please enter an email.");
  } else if (!password) {
    showError("Please enter a password.");
  } else if (!confirmPassword) {
    showError("Please verify your password.");
  } else if (password !== confirmPassword) {
    showError("Please make sure your password is the same.");
  } else {
    //creating a user with email & password
    firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
      const user = userCredential.user;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      showError(errorMessage);
    });
  }
}