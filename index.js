const fs = require("fs");
const path = require("path");
const readline = require("readline");
const GoogleAPI = require("./modules/googleAPI.js");
const TodaysPairs = require("./modules/todaysPairs.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const dayToColumn = {
  "W1D4" : "K:K",
  "W2D1" : "M:M",
  "W2D2" : "N:N",
  "W2D3" : "O:O",
  "W2D4" : "P:P",
}

const promiseAfterInput = new Promise((resolve, reject) => {
  rl.question("Please write which day of the current cohort it is, in the following fashion - 'w1d2' or 'W2D2'. \n If it is a new cohort, write instead the cohort's name as present in the Google Sheet (i.e. 'NY-2019-01-07' or 'sf-2019-01-07').", (answer) => {
    var answer = answer.toUpperCase();
    if (answer.includes("NY") || answer.includes("SF")) {
      saveCohortName(answer);
      rl.question(
        "Thank you for the Cohort's name! Now can you please write which day of the cohort it is (i.e. 'w1d2' or 'W2D2').",
        whichDay => {
          whichDay = whichDay.toUpperCase();
          if (!(whichDay in dayToColumn)) {
            console.log(
              "Invalid day! Please start over by running the file again."
            );
            rl.close();
          } else {
            processSpreadSheetId(whichDay, resolve);
          }
        }
      );
    } else if (answer == "W1D4") {
      rl.question("You have begun a new cohort! Please write the new cohort's name as present in the Google Sheet (i.e. 'NY-2019-01-07' or 'sf-2019-01-07').", cohortName => {
        cohortName = cohortName.toUpperCase();
        if (answer.includes("NY") || answer.includes("SF")) {
          saveCohortName(cohortName);
          processSpreadSheetId(answer, resolve);
        } else {
          console.log("Invalid cohort name. Please start over by running the file again.")
          rl.close();
        }
      });
    } else if (answer in dayToColumn) {
      if (!readCohortName()) {
        rl.question(
          "Previous cohort's name is corrupted. Please, provide current cohort's name again (i.e. 'NY-2019-01-07' or 'sf-2019-01-07').",
          cohortName => {
            cohortName = cohortName.toUpperCase();
            if (cohortName.includes("NY") || cohortName.includes("SF")) {
              saveCohortName(cohortName);
              processSpreadSheetId(answer, resolve);
            } else {
              console.log("Provided cohort name is invalid. Please, start over by running the file again.");
              rl.close;
            }
          }
        );
      } else {
        processSpreadSheetId(answer, resolve);
      }
    } else {
      console.log("Your input is invalid. Please start over by running the file again.");
      rl.close();
    }
  });
});

promiseAfterInput.then(response => {
  var googleAPI = new GoogleAPI(dayToColumn[response[0]], response[1], response[2]);
  const content = fs.readFileSync("./google_api_credentials/credentials.json");
  const promiseAfterAttendence = googleAPI.authorize(JSON.parse(content), googleAPI.getAttendence);
  promiseAfterAttendence.then(attendence => {
    const parsedAttendance = parsingAttendence(attendence);
    const todaysPairs = new TodaysPairs(parsedAttendance);
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

function processSpreadSheetId (whichDay, resolve) {
  var spreadsheetId = spreadsheetLinkToID(prevSpreadsheetID());
  var cohortName = readCohortName();
  if (!spreadsheetId) {
    rl.question("Previous Spreadsheet Id is corrupted; Please, provide the link again? ", (link) => {
      spreadsheetId = spreadsheetLinkToID(link);
      if (!spreadsheetId) {
        console.log("Invalid link! Please, start over by running the file again.");
        rl.close();
      } else {
        saveSpreadsheetID(spreadsheetId[0]);
        resolve([whichDay, spreadsheetId[1]], cohortName);
        rl.close();
      }
    });
  } else {
    resolve([whichDay, spreadsheetId[1]], cohortName);
    rl.close();
  }
}

function parsingAttendence(attendence) {
  const [names, day] = attendence;
  const studentCounts = counts(names.slice(2));
  let students = [];
  for (let i = 2; i < firstNames.length; i++) {
    if (day[i] === "x") {
      let student = names[i];
      let [firstName, lastName] = student.split(" ");
      if (studentCounts[student] === 1) {
        students.push(firstName)
      } else if (studentCounts[student] > 1) {
        students.push(firstName + " " + lastName[0])
      } else {
        students.push(student)
      }
    }
  }
  return students;
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

function counts (students) {
  let countHash = {}
  students.forEach((student) => {
    countHash[student] = ((countHash[student] || 0) + 1);
  })
  return countHash;
}

function readCohortName() {
  return readFile("./files/cohortName.txt");
}

function saveCohortName(cohortName) {
  handleFile("./files/cohortName.txt", cohortName);
}

function prevSpreadsheetID() {
  return readFile("./files/spreadsheetId.txt");
}

function saveSpreadsheetID(spreadsheetId) {
  handleFile("./files/spreadsheetId.txt", spreadsheetId);
}

function readFile (path) {
  return fs.readFileSync(path).toString();
}

function saveFile (path, content) {
  fs.writeFile(path, JSON.stringify(content), errors => {
    if (errors) {
      console.log(errors);
    }
  });
}

function handleFile (path, content) {
  let dirname = path.dirname(path);
  if (fs.existsSync(dirname)) {
    saveFile(path, content);
  } else {
    fs.mkdirSync(dirname);
    saveFile(path, content);
  }
}
