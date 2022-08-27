
function getFileLang(src) {

  var lang_aliases = /*aliases_placeholder[*/ {
    "html": "markup",
    "xml": "markup",
    "svg": "markup",
    "mathml": "markup",
    "ssml": "markup",
    "atom": "markup",
    "rss": "markup",
    "js": "javascript",
    "g4": "antlr4",
    "ino": "arduino",
    "adoc": "asciidoc",
    "avs": "avisynth",
    "avdl": "avro-idl",
    "shell": "bash",
    "shortcode": "bbcode",
    "rbnf": "bnf",
    "oscript": "bsl",
    "cs": "csharp",
    "dotnet": "csharp",
    "cfc": "cfscript",
    "coffee": "coffeescript",
    "conc": "concurnas",
    "jinja2": "django",
    "dns-zone": "dns-zone-file",
    "dockerfile": "docker",
    "gv": "dot",
    "eta": "ejs",
    "xlsx": "excel-formula",
    "xls": "excel-formula",
    "gamemakerlanguage": "gml",
    "gni": "gn",
    "go-mod": "go-module",
    "hbs": "handlebars",
    "hs": "haskell",
    "idr": "idris",
    "gitignore": "ignore",
    "hgignore": "ignore",
    "npmignore": "ignore",
    "webmanifest": "json",
    "kt": "kotlin",
    "kts": "kotlin",
    "kum": "kumir",
    "tex": "latex",
    "context": "latex",
    "ly": "lilypond",
    "emacs": "lisp",
    "elisp": "lisp",
    "emacs-lisp": "lisp",
    "md": "markdown",
    "moon": "moonscript",
    "n4jsd": "n4js",
    "nani": "naniscript",
    "objc": "objectivec",
    "qasm": "openqasm",
    "objectpascal": "pascal",
    "px": "pcaxis",
    "pcode": "peoplecode",
    "pq": "powerquery",
    "mscript": "powerquery",
    "pbfasm": "purebasic",
    "purs": "purescript",
    "py": "python",
    "qs": "qsharp",
    "rkt": "racket",
    "razor": "cshtml",
    "rpy": "renpy",
    "robot": "robotframework",
    "rb": "ruby",
    "sh-session": "shell-session",
    "shellsession": "shell-session",
    "smlnj": "sml",
    "sol": "solidity",
    "sln": "solution-file",
    "rq": "sparql",
    "t4": "t4-cs",
    "trickle": "tremor",
    "troy": "tremor",
    "trig": "turtle",
    "ts": "typescript",
    "tsconfig": "typoscript",
    "uscript": "unrealscript",
    "uc": "unrealscript",
    "url": "uri",
    "vb": "visual-basic",
    "vba": "visual-basic",
    "webidl": "web-idl",
    "mathematica": "wolfram",
    "nb": "wolfram",
    "wl": "wolfram",
    "xeoracube": "xeora",
    "yml": "yaml"
  } /*]*/ ;
  
  src = src.replaceAll('\n', '');
  const extension = (/\.(\w+)$/.exec(src) || [, 'none'])[1];
  return lang_aliases[extension] || extension;

}


function processFile(file) {

  if (liveView.classList.contains('file-open')) return;

  const reader = new FileReader();

  reader.addEventListener('load', (event) => {
    
    if (hashCode(event.target.result) !== hashCode(cd.textContent)) {
      
      cd.textContent = event.target.result;
      
    }
    
    cd.lang = getFileLang(file.name);
    
    cd.scrollTo(0, 0);
    
    // set caret pos in codeit
    if (!isMobile) cd.setSelection(0, 0);
    
    cd.focus();

    cd.history.records = [{ html: cd.innerHTML, pos: cd.getSelection() }];
    cd.history.pos = 0;
    
    changeSelectedFile('', '', file.name, encodeUnicode(event.target.result), cd.lang, [0, 0], [0, 0], false);

    showMessage('Loaded ' + file.name + '!', 5000);

  });

  reader.readAsText(file);

}

body.addEventListener('drop', (ev) => {
  
  // prevent default behavior (prevent file from being opened)
  ev.preventDefault();
  
  // remove drop indication
  cd.classList.remove('focus');
  
  if (ev.dataTransfer.items) {
  
    // use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
  
      // if dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
  
        var file = ev.dataTransfer.items[i].getAsFile();
        processFile(file);
  
      }
  
    }
  
  } else {
  
    // use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
  
      processFile(ev.dataTransfer.files[i]);
  
    }
    
  }

})

body.addEventListener('dragover', (ev) => {

  // prevent default behavior (prevent file from being opened)
  ev.preventDefault();

  // show drop indication
  cd.classList.add('focus');

})

body.addEventListener('dragleave', (ev) => {

  // remove drop indication
  cd.classList.remove('focus');

})

if ('launchQueue' in window) {

  window.launchQueue.setConsumer(async (launchParams) => {
        
    if (!launchParams.files.length) {
      return;
    }
    
    const launchFile = launchParams.files[0];
    
    console.log('[launchQueue] Launched with: ', launchFile);
    
    
    // handle the file
    const fileData = await launchFile.getFile();

    processFile(fileData);
        
  });
  
}
