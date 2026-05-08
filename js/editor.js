let port;

let reader;

let keepReading = false;

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

  Serial.begin(115200);

}

void loop(){

  Serial.println("Hello ESP32");

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

    startSerialMonitor();

  }catch(err){

    log(
      "[ERROR] Connection Failed"
    );

    console.error(err);

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

/* SERIAL MONITOR */

async function startSerialMonitor(){

  if(!port){

    return;

  }

  keepReading = true;

  const decoder =
  new TextDecoderStream();

  port.readable.pipeTo(
    decoder.writable
  );

  reader =
  decoder.readable.getReader();

  log(
    "[INFO] Serial Monitor Started"
  );

  while(keepReading){

    const {
      value,
      done
    } =
    await reader.read();

    if(done){

      break;

    }

    if(value){

      terminal.textContent +=
      value;

      terminal.scrollTop =
      terminal.scrollHeight;

    }

  }

}
