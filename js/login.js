document.querySelector(".login-btn").addEventListener("click", () => {

    const id = document.querySelector('input[type="text"]').value;
    const pw = document.querySelector('input[type="password"]').value;

    if(id === "" || pw === ""){
        alert("아이디와 비밀번호를 입력하세요.");
        return;
    }

    alert("로그인 처리");
});