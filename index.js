const fs = require("fs");
const readline = require("readline");
const GoogleAPI = require("./modules/googleAPI.js");
const TodaysPairs = require("./modules/todaysPairs.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const dayToColumn = {
  "W1D4" : "J:J",
  "W2D1" : "L:L",
  "W2D2" : "M:M",
  "W2D3" : "N:N",
  "W2D4" : "O:O",
}

const promiseAfterInput = new Promise((resolve, reject) => {
  rl.question("Which day of the cohort? ", (whichDay) => {
    whichDay = whichDay.toUpperCase();
    if (whichDay == "W1D4") {
      rl.question("Provide the link, please? ", (link) => {
        processLink(whichDay, link, resolve);
      });
    } else {
      if (!(whichDay in dayToColumn)) {
        console.log("Invalid day!");
        rl.close();
      } else {
        var regex = spreadsheetLinkToID(prevSpreadsheetID());
        if (!regex) {
          rl.question("Previous Spreadsheet Id is corrupted; provide the link again, please? ", (link) => {
            processLink(whichDay, link, resolve)
          });
        } else {
          resolve([whichDay, regex[1]]);
          rl.close();
        }
      }
    }
  });
});

  // const child = child_process.exec("open students.txt");
  // console.log("closed");

promiseAfterInput.then(response => {
  var googleAPI = new GoogleAPI(dayToColumn[response[0]], response[1]);
  const content = fs.readFileSync("./google_api_credentials/credentials.json");
  const promiseAfterAttendence = googleAPI.authorize(JSON.parse(content), googleAPI.getAttendence);
  promiseAfterAttendence.then(attendence => {
    const initialAttendance = parsingAttendence(attendence);
    const leftStudents = earlyDeparture();
    const students = initialAttendance.filter(name => leftStudents.indexOf(name) < 0);
    const todaysPairs = new TodaysPairs(students);
    const results = todaysPairs.makingPairs();
    fs.writeFile("./files/pairs.txt", stringify(results), errors => {
      if (errors) {
        console.log(errors);
      }
      console.log("The pairs are available in files/pairs.txt")
    });
  });
});

function spreadsheetLinkToID (link) {
  var spreadsheetRegex = "/spreadsheets/d/([a-zA-Z0-9-_]+)";
  return link.match(spreadsheetRegex);
}

function savingSpreadsheetID (spreadsheetId) {
  fs.writeFile("./files/spreadsheetId.txt", JSON.stringify(spreadsheetId), errors => {
    if (errors) {
      console.log(errors);
    }
  });
}

function prevSpreadsheetID () {
  return fs.readFileSync("./files/spreadsheetId.txt").toString();
}

function processLink (whichDay, link, resolve) {
  var regex = spreadsheetLinkToID(link);
  if (!regex) {
    console.log("Invalid link!");
    rl.close();
  } else {
    savingSpreadsheetID(regex[0]);
    resolve([whichDay, regex[1]]);
    rl.close();
  }
}

function parsingAttendence(attendence) {
  let students = [];
  const [firstNames, lastNames, day] = attendence;
  for (let i = 2; i < firstNames.length; i++) {
    if (day[i] === "x") {
      let student = firstNames[i];
      if (!students.includes(student)) {
        students.push(student)
      } else if (!students.includes(student + lastNames[i][0])) {
        students.push(student + lastNames[i][0])
      } else {
        students.push(student + lastNames[i])
      }
    }
  }
  return students;
}

function earlyDeparture() {
  let students = fs.readFileSync("./files/earlyDepartures.txt").toString().split("\n");
  if (students.every(element => element === "")) {
    return [];
  } else {
    return students;
  }
}

function stringify (results) {
  string = "Pairs:\n-------------------------------\n";
  const [pairs, secondRound, single] = results;
  pairs.forEach(pair => {
    string += `${properCapitalization(pair)}\n`
  })
  if (single.length === 1) {
    string += "-------------------------------\n\nSingle: "
    string += `${properCapitalization(single[0])}`
  } else if (secondRound.length === 1){
    string += "-------------------------------\n\nSingle: "
    string += `${properCapitalization(secondRound[0])}`
  }
  return string;
}

function properCapitalization (pair) {
  let students = pair.split(" : ");
  students = students.map(student => {
    let splited = student.split(" ");
    splited = splited.map(part => {
      return part[0].toUpperCase() + part.slice(1).toLowerCase();
    });
    return splited.join(" ")
  });
  return students.join(" : ");
}
