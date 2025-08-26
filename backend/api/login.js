// login.js
document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  const res = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (result.success) {
    localStorage.setItem("token", result.token);
    alert("Bienvenido " + result.user.Nombre);
    window.location.href = "/index.html";
  } else {
    alert(result.message);
  }
});
