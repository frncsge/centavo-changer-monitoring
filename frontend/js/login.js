async function login() {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    const { message } = data;

    console.log(message);

    // 🔥 THIS is what makes it show on screen
    document.getElementById("message").textContent = message;

  } catch (error) {
    console.error("Error log in:", error);
    
  }
}

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", login);
