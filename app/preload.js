// const { spawn } = require('child_process');
// const path = require('path');

// const child = spawn(path.join(__dirname, "ookla-speedtest-1.0.0-win64/speedtest.exe"), ['--format', 'jsonl']);

//   child.stdout.setEncoding('utf8');
//   child.stdout.on('data', (chunk) => {

//     if(chunk.length > 10){
//       const json = JSON.parse(chunk);
//       console.log(json);
//       //mainWindow.webContents.send(json.type, json);
//     }

//   });

//   child.on('close', (code) => {

//     console.log(`child process exited with code ${code}`);

//   });