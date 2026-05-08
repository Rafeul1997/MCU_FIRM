require.config({

  paths:{
    vs:
"https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"
  }

});

require(
["vs/editor/editor.main"],
function(){

  monaco.editor.create(

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
