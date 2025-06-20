document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // 로그인 성공 시 토큰을 localStorage에 저장
        localStorage.setItem("token", data.token);
        alert("로그인 성공!");
        localStorage.setItem("token", data.token); // 토큰 저장
      } else {
        alert("실패: " + data.message);
        location.href = "/index.html";
      }
    } catch (err) {
      console.error(err);
      alert("에러 발생");
    }
  });
