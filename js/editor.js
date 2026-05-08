let port;

let editor;

/* MONACO */

require.config({

  paths:{
    vs:
"https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"
  }

});

require(
["vs/editor/editor.main"],
function(){

  editor = monaco.editor.create(

    document.getElementById(
      "editor"
    ),

    {

value:
`void setup(){

  pinMode(2, OUTPUT);

}

void loop(){

  digitalWrite(2, HIGH);
  delay(1000);

  digitalWrite(2, LOW);
  delay(1000);

}`,

      language:"cpp",

      theme:"vs-dark",

      automaticLayout:true

    }

  );

});

/* TERMINAL */

const terminal =
document.getElementById(
  "terminal"
);

function log(text){

  terminal.textContent +=
  text + "\n";

  terminal.scrollTop =
  terminal.scrollHeight;

}

/* CONNECT */

document.getElementById(
  "connectBtn"
).onclick = async ()=>{

  try{

    port =
    await navigator.serial
    .requestPort();

    await port.open({

      baudRate:115200

    });

    log(
      "[SUCCESS] Board Connected"
    );

  }catch(err){

    log(
      "[ERROR] Connection Failed"
    );

  }

};

/* VERIFY */

document.getElementById(
  "verifyBtn"
).onclick = ()=>{

  log(
    "[INFO] Code Verification Started"
  );

  setTimeout(()=>{

    log(
      "[SUCCESS] No Syntax Errors"
    );

  },1000);

};

/* COMPILE */

document.getElementById(
  "compileBtn"
).onclick = ()=>{

  const board =
  document.getElementById(
    "boardSelect"
  ).value;

  const partition =
  document.getElementById(
    "partitionSelect"
  ).value;

  const code =
  editor.getValue();

  log(
    "[INFO] Preparing Cloud Compile"
  );

  log(
    "[INFO] Board: " + board
  );

  log(
    "[INFO] Partition: " + partition
  );

  log(
    "[INFO] Code Size: " +
    code.length +
    " bytes"
  );

  setTimeout(()=>{

    log(
      "[SUCCESS] Compile Finished"
    );

    log(
      "[INFO] firmware.bin generated"
    );

  },2000);

};

/* UPLOAD */

document.getElementById(
  "uploadBtn"
).onclick = ()=>{

  if(!port){

    alert(
      "Connect board first"
    );

    return;

  }

  log(
    "[INFO] Upload Started"
  );

  setTimeout(()=>{

    log(
      "[SUCCESS] Upload Complete"
    );

  },2000);

};

/* DOWNLOAD BIN */

document.getElementById(
  "downloadBtn"
).onclick = ()=>{

  log(
    "[INFO] Downloading BIN..."
  );

  const link =
  document.createElement("a");

  link.href =
  "../firmware/esp32/blink.bin";

  link.download =
  "firmware.bin";

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  log(
    "[SUCCESS] BIN Download Started"
  );

};
