const progressBar =
document.getElementById(
  "progressBar"
);

const progressText =
document.getElementById(
  "progressText"
);

const logBox =
document.getElementById(
  "log"
);

function log(text){

  logBox.textContent +=
    text + "\\n";

  logBox.scrollTop =
    logBox.scrollHeight;

}

document.getElementById(
  "flashBtn"
).onclick = ()=>{

  let progress = 0;

  log(
    "[INFO] Starting Upload..."
  );

  const timer =
  setInterval(()=>{

    progress += 10;

    progressBar.style.width =
      progress + "%";

    progressText.textContent =
      progress + "%";

    log(
      "[INFO] Uploading " +
      progress +
      "%"
    );

    if(progress >= 100){

      clearInterval(timer);

      log(
        "[SUCCESS] Upload Complete"
      );

    }

  },400);

};
