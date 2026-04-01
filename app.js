const {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} = window.AmazonCognitoIdentity;

const poolData = {
  UserPoolId: "us-east-1_30VAAkd7H",
  ClientId: "7deafhfj16leel4es25ebppjpf"
};

let isSignUpMode = false;
let pendingConfirmationEmail = "";

const authTitle = document.getElementById("authTitle");
const authBtn = document.getElementById("authBtn");
const switchText = document.getElementById("switchText");

const authContainer = document.getElementById("authContainer");
const confirmContainer = document.getElementById("confirmContainer");
const appContainer = document.getElementById("appContainer");

const welcomeText = document.getElementById("welcomeText");
const signOutBtn = document.getElementById("signOutBtn");
const confirmBtn = document.getElementById("confirmBtn");

document.getElementById("switchMode").addEventListener("click", toggleAuthMode);
document.getElementById("resendCode").addEventListener("click", resendConfirmationCode);
authBtn.addEventListener("click", handleAuth);
confirmBtn.addEventListener("click", handleConfirmation);
signOutBtn.addEventListener("click", signOutUser);

function toggleAuthMode() {
  isSignUpMode = !isSignUpMode;

  if (isSignUpMode) {
    authTitle.textContent = "Sign Up";
    authBtn.textContent = "Sign Up";
    switchText.innerHTML = 'Already have an account? <span id="switchMode">Sign In</span>';
  } else {
    authTitle.textContent = "Sign In";
    authBtn.textContent = "Sign In";
    switchText.innerHTML = 'Don’t have an account? <span id="switchMode">Sign Up</span>';
  }

  document.getElementById("switchMode").addEventListener("click", toggleAuthMode);
}

function handleAuth() {
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value;

  const userPool = new CognitoUserPool(poolData);

  if (isSignUpMode) {
    userPool.signUp(email, password, [], null, function (err, result) {
      if (err) {
        console.error("Signup error:", err);
        alert(err.message || JSON.stringify(err));
        return;
      }

      console.log("Signup success:", result);
      pendingConfirmationEmail = email;

      authContainer.style.display = "none";
      confirmContainer.style.display = "block";

      alert("Sign up successful. Check your email for the confirmation code.");
    });
  } else {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    const userData = {
      Username: email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        console.log("Login success:", result);

        authContainer.style.display = "none";
        confirmContainer.style.display = "none";
        appContainer.style.display = "block";
        welcomeText.textContent = `Welcome, ${email}`;

        localStorage.setItem("loggedInEmail", email);
      },

      onFailure: function (err) {
        console.error("Login error:", err);
        alert(err.message || JSON.stringify(err));
      }
    });
  }
}

function handleConfirmation() {
  const code = document.getElementById("confirmCodeInput").value.trim();

  if (!pendingConfirmationEmail) {
    alert("No email found for confirmation. Please sign up again.");
    return;
  }

  const userPool = new CognitoUserPool(poolData);

  const userData = {
    Username: pendingConfirmationEmail,
    Pool: userPool
  };

  const cognitoUser = new CognitoUser(userData);

  cognitoUser.confirmRegistration(code, true, function (err, result) {
    if (err) {
      console.error("Confirm error:", err);
      alert(err.message || JSON.stringify(err));
      return;
    }

    console.log("Confirm success:", result);
    alert("Account confirmed. You can now sign in.");

    confirmContainer.style.display = "none";
    authContainer.style.display = "block";

    isSignUpMode = false;
    authTitle.textContent = "Sign In";
    authBtn.textContent = "Sign In";
    switchText.innerHTML = 'Don’t have an account? <span id="switchMode">Sign Up</span>';
    document.getElementById("switchMode").addEventListener("click", toggleAuthMode);
  });
}

function resendConfirmationCode() {
  if (!pendingConfirmationEmail) {
    alert("No email found. Please sign up again.");
    return;
  }

  const userPool = new CognitoUserPool(poolData);

  const userData = {
    Username: pendingConfirmationEmail,
    Pool: userPool
  };

  const cognitoUser = new CognitoUser(userData);

  cognitoUser.resendConfirmationCode(function (err, result) {
    if (err) {
      console.error("Resend code error:", err);
      alert(err.message || JSON.stringify(err));
      return;
    }

    console.log("Resend success:", result);
    alert("Confirmation code resent. Check your email.");
  });
}

function signOutUser() {
  const userPool = new CognitoUserPool(poolData);
  const currentUser = userPool.getCurrentUser();

  if (currentUser) {
    currentUser.signOut();
  }

  localStorage.removeItem("loggedInEmail");

  appContainer.style.display = "none";
  confirmContainer.style.display = "none";
  authContainer.style.display = "block";
  welcomeText.textContent = "Welcome, user@example.com";
}

window.onload = function () {
  const savedEmail = localStorage.getItem("loggedInEmail");

  if (savedEmail) {
    authContainer.style.display = "none";
    confirmContainer.style.display = "none";
    appContainer.style.display = "block";
    welcomeText.textContent = `Welcome, ${savedEmail}`;
  }
};