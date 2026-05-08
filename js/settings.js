const defaultSettings = {

  theme:"dark",

  fontSize:14,

  autoSave:true,

  restoreSession:true,

  defaultBoard:"esp32:esp32:esp32",

  defaultBaud:"115200",

  partition:"Default 4MB with SPIFFS",

  tabSize:2,

  autoFormat:false,

  wordWrap:true,

  serialBaud:"115200",

  autoScroll:true,

  timestamps:false,

  lineEnding:"LF",

  autoDetect:true,

  flashAfterCompile:false,

  verifyFirmware:true,

  eraseFlash:false

};

/* LOAD SETTINGS */

function loadSettings(){

  const saved =
  JSON.parse(

    localStorage.getItem(
      "mcuFirmSettings"
    )

  ) || defaultSettings;

  for(const key in saved){

    const el =
    document.getElementById(
      key
    );

    if(!el) continue;

    if(el.type === "checkbox"){

      el.checked = saved[key];

    }else{

      el.value = saved[key];

    }

  }

  applyTheme(
    saved.theme
  );

}

/* SAVE SETTINGS */

function saveSettings(){

  const settings = {};

  Object.keys(
    defaultSettings
  ).forEach(key=>{

    const el =
    document.getElementById(
      key
    );

    if(!el) return;

    if(el.type === "checkbox"){

      settings[key] =
      el.checked;

    }else{

      settings[key] =
      el.value;

    }

  });

  localStorage.setItem(

    "mcuFirmSettings",

    JSON.stringify(
      settings
    )

  );

  applyTheme(
    settings.theme
  );

  alert(
    "Settings Saved"
  );

}

/* THEME */

function applyTheme(theme){

  if(theme === "light"){

    document.body.style.background =
    "#f1f5f9";

    document.body.style.color =
    "black";

  }else{

    document.body.style.background =
    "#0b1120";

    document.body.style.color =
    "white";

  }

}

/* SECTION SWITCH */

function showSection(id){

  document
  .querySelectorAll(
    ".section"
  )
  .forEach(section=>{

    section.classList.add(
      "hidden"
    );

  });

  document
  .getElementById(id)
  .classList.remove(
    "hidden"
  );

}

/* SAVE SETTINGS BUTTON */

document.getElementById(
  "saveSettingsBtn"
).onclick = saveSettings;

/* SAVE FIRMWARE METADATA */

document.getElementById(
  "saveFirmwareBtn"
).onclick = ()=>{

  const file =
  document.getElementById(
    "firmwareUpload"
  ).files[0];

  if(!file){

    alert(
      "Select firmware first"
    );

    return;

  }

  const firmwareData = {

    file:file.name,

    category:
    document.getElementById(
      "firmwareCategory"
    ).value,

    rename:
    document.getElementById(
      "firmwareRename"
    ).value,

    notes:
    document.getElementById(
      "firmwareNotes"
    ).value

  };

  localStorage.setItem(

    "firmwareMetadata",

    JSON.stringify(
      firmwareData
    )

  );

  alert(
    "Firmware Metadata Saved"
  );

};

/* INITIALIZE */

loadSettings();
