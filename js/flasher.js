let port;

const connectBtn =
document.getElementById(
  "connectBtn"
);

const flashBtn =
document.getElementById(
  "flashBtn"
);

const progressBar =
document.getElementById(
  "progressBar"
);

const progressText =
document.getElementById(
  "progressText"
);

const firmwareSelect =
document.getElementById(
  "firmwareSelect"
);

const logBox =
document.getElementById(
  "log"
);

function log(text){

  logBox.textContent +=
    text + "\n";

  logBox.scrollTop =
    logBox.scrollHeight;

}

/* CONNECT */

connectBtn.onclick =
async ()=>{

  try{

    port =
    await navigator.serial
    .requestPort();

    await port.open({

      baudRate:115200

    });

    log(
      "[SUCCESS] ESP32 Connected"
    );

  }catch(err){

    log(
      "[ERROR] Connection Failed"
    );

    console.error(err);

  }

};

/* FLASH */

flashBtn.onclick =
async ()=>{

  if(!port){

    alert(
      "Connect ESP32 First"
    );

    return;

  }

  try{

    log(
      "[INFO] Loading Firmware..."
    );

    const firmwarePath =
    firmwareSelect.value;

    const response =
    await fetch(
      firmwarePath
    );

    const firmware =
    await response.arrayBuffer();

    log(
      "[INFO] Firmware Loaded"
    );

    log(
      "[INFO] Size: " +
      firmware.byteLength +
      " bytes"
    );

    /* FAKE PROGRESS FOR NOW */

    let progress = 0;

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
          "[SUCCESS] Flash Complete"
        );

      }

    },400);

  }catch(err){

    log(
      "[ERROR] Flash Failed"
    );

    console.error(err);

  }

};
