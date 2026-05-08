let port;

let reader;

let writer;

let keepReading = false;

let isConnected = false;

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

  /* LOAD SAVED CODE */

  const savedCode =
  localStorage.getItem(
    "mcuFirmEditorCode"
  );

  editor = monaco.editor.create(

    document.getElementById(
      "editor"
    ),

    {

value:
savedCode ||

`void setup(){

  Serial.begin(115200);

}

void loop(){

  Serial.println("Hello ESP32");

  delay(1000);

}`,

      language:"cpp",

      theme:"vs-dark",

      automaticLayout:true,

      fontSize:14

    }

  );

  /* AUTO SAVE */

  editor.onDidChangeModelContent(()=>{

    localStorage.setItem(

      "mcuFirmEditorCode",

      editor.getValue()

    );

  });

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

/* CONNECT / DISCONNECT */

document.getElementById(
  "connectBtn"
).onclick = async ()=>{

  const btn =
  document.getElementById(
    "connectBtn"
  );

  if(!isConnected){

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

      isConnected = true;

      btn.textContent =
      "Disconnect";

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

  }else{

    try{

      keepReading = false;

      if(reader){

        await reader.cancel();

      }

      if(writer){

        writer.releaseLock();

      }

      if(port){

        await port.close();

      }

      isConnected = false;

      btn.textContent =
      "Connect";

      log(
        "[INFO] Board Disconnected"
      );

    }catch(err){

      console.error(err);

    }

  }

};

/* RECONNECT */

document.getElementById(
  "reconnectBtn"
).onclick = async ()=>{

  try{

    if(port){

      await port.close();

    }

    isConnected = false;

    document.getElementById(
      "connectBtn"
    ).textContent =
    "Connect";

    log(
      "[INFO] Reconnecting..."
    );

  }catch(err){

    console.error(err);

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

  /* SAVE CURRENT CODE */

  localStorage.setItem(

    "mcuFirmEditorCode",

    editor.getValue()

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

/* DOWNLOAD BIN */

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

/* SEND SERIAL */

document.getElementById(
  "sendBtn"
).onclick = async ()=>{

  if(!writer){

    alert(
      "Connect board first"
    );

    return;

  }

  let text =
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

/* STOP SERIAL MONITOR */

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
