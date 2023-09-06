let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다";
    div.style =
      "display:flex; justify-content:center; align-items: center; width:200px; height:200px; position:absolute; top:40vh; left:45vw; background-color:white;";
    document.body.appendChild(div);
  };

  const gameOverWin = () => {
    window.removeEventListener("keydown", handleKeydown);
    alert("축하합니다! 정답입니다");
    displayGameover();
    clearInterval(timer);
  };
  const gameOver = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const nextLine = () => {
    if (attempts === 6) return gameOver();
    attempts += 1;
    index = 0;
  };

  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;

    // 서버에서 정답을 받아오는 코드
    const 응답 = await fetch("answer");
    const 정답 = await 응답.json();

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const inputTxt = block.innerText;
      const answerTxt = 정답[i];
      if (inputTxt === answerTxt) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
      } // 일치
      else if (정답.includes(inputTxt))
        block.style.background = "#C9B458"; // 속함
      else block.style.background = "#787C7E"; //그외
      block.style.color = "#fff";
    }

    if (맞은_갯수 === 5) gameOverWin(); // 5개 다 맞으면 게임오버
    else nextLine(); // 다음줄로 넘어가라
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index += 1;
    }
  };

  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector(".time");
      timeDiv.innerText = `${분} : ${초}`;
    }

    // 주기성
    timer = setInterval(setTime, 1000);
    console.log(timer);
  };
  startTimer();
  window.addEventListener("keydown", handleKeydown);
}

appStart();
