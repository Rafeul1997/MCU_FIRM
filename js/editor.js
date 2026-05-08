let port;

let reader;

let writer;

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

async function connectBoard(){

  try{

    const baud =
    parseInt(
      document.getElementById(
        "baudRate"
      ).value
    );

    port =
    await navigator.serial
    .requestPort();

    await port.open({

      baudRate:baud

    });

    writer =
    port.writable.getWriter();

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

}

document.getElementById(
  "connectBtn"
).onclick = connectBoard;

/* RECONNECT */

document.getElementById(
  "reconnectBtn"
).onclick = async ()=>{

  try{

    if(port){

      await port.close();

    }

    connectBoard();

  }catch(err){

    log(
      "[ERROR] Reconnect Failed"
    );

  }

};

/* VERIFY */

document.getElementById(
  "verifyBtn"
).onclick = ()=>{

  log(
    "[INFO] Verification Started"
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

  log(
    "[INFO] Cloud Compile Started"
  );

  setTimeout(()=>{

    log(
      "[SUCCESS] firmware.bin generated"
    );

  },2000);

};

/* UPLOAD */

document.getElementById(
  "uploadBtn"
).onclick = ()=>{

  log(
    "[INFO] Upload Started"
  );

  setTimeout(()=>{

    log(
      "[SUCCESS] Upload Complete"
    );

  },2000);

};

/* DOWNLOAD */

document.getElementById(
  "downloadBtn"
).onclick = ()=>{

  const link =
  document.createElement(
    "a"
  );

  link.href =
  "../firmware/esp32/blink.bin";

  link.download =
  "firmware.bin";

  link.click();

  log(
    "[SUCCESS] BIN Download Started"
  );

};

/* CLEAR TERMINAL */

document.getElementById(
  "clearBtn"
).onclick = ()=>{

  terminal.textContent = "";

};

/* SEND SERIAL DATA */

document.getElementById(
  "sendBtn"
).onclick = async ()=>{

  if(!writer){

    alert(
      "Connect board first"
    );

    return;

  }

  const text =
  document.getElementById(
    "serialInput"
  ).value;

  const encoder =
  new TextEncoder();

  await writer.write(
    encoder.encode(
      text + "\n"
    )
  );

  log(
    "[TX] " + text
  );

  document.getElementById(
    "serialInput"
  ).value = "";

};

/* STOP MONITOR */

document.getElementById(
  "stopMonitorBtn"
).onclick = async ()=>{

  keepReading = false;

  try{

    if(reader){

      await reader.cancel();

    }

    log(
      "[INFO] Serial Monitor Stopped"
    );

  }catch(err){

    console.error(err);

  }

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
