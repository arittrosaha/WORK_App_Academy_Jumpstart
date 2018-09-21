const prevPairs = require("./prevPairs.js");

function todaysPairs(prevPairs={}) {
  var students = gettingStudents();
  var pairs = [];
  var secondRound = [];
  var single = [];

  pickUniqPairs(students, secondRound, prevPairs, pairs);

  let newPrevPairs = objectifyPairs(pairs, prevPairs);

  if (secondRound.length !== 1) {
    students = secondRound;
    secondRound = [];
    pickSecondPairs(students, secondRound, pairs, single);
  }

  console.log("------------------------");
  console.log("Pairs : ");
  pairs.forEach(pair => console.log(pair));

  if (single.length === 1) {
    console.log("------------------------");
    console.log("Single :");
    console.log(single[0]);
  } else {
    console.log("------------------------");
    console.log("Single :");
    console.log(secondRound[0]);
  }

  console.log("------------------------");
  console.log("New prevPairs :");
  console.log(newPrevPairs);
  console.log("------------------------");
}

function getRandomInt(numOfStudents) {
  numOfStudents = Math.floor(numOfStudents);
  return Math.floor(Math.random() * numOfStudents);
}

function diff(arr1, arr2) {
    return arr1.filter(idx => arr2.indexOf(idx) < 0);
}

function gettingStudents() {
  var fs = require('fs');
  return fs.readFileSync('students.txt').toString().split("\n").slice(0,-1);
}

function pickSecondPairs (students, secondRound, pairs, single) {
  while (true) {
    if (students.length === 0) {
      break;
    }

    let pair = [];

    if (students.length > 0) {
      var idx = getRandomInt(students.length);
      pair.push(students[idx]);
      students.splice(idx, 1);
    }

    if (students.length > 0) {
      idx = getRandomInt(students.length);
      pair.push(students[idx]);
      students.splice(idx, 1);
    }

    if (pair.length === 2) {
      const strPair = `${pair[0]} : ${pair[1]}`;
      pairs.push(strPair);
    } else {
      single.push(pair[0]);
    }
  }
}

function pickUniqPairs (students, secondRound, prevPairs, pairs) {
  while (true) {
    if (students.length === 0) {
      break;
    }

    let pair = [];

    if (students.length > 0) {
      var idx = getRandomInt(students.length);
      var notIncluding = diff(students, [students[idx]]);

      if (prevPairs[students[idx]]) {
        var notPairedStudents = diff(notIncluding, prevPairs[students[idx]]);
      } else {
        notPairedStudents = notIncluding;
      }

      if (notPairedStudents.length) {
        pair.push(students[idx]);
        students.splice(idx, 1);
      } else {
        secondRound.push(students[idx]);
        students.splice(idx, 1);
        continue;
      }
    }

    if (students.length > 0) {
      idx = getRandomInt(notPairedStudents.length);
      idx = notIncluding.indexOf(notPairedStudents[idx]);
      pair.push(students[idx]);
      students.splice(idx, 1);
    }

    if (pair.length === 2) {
      const strPair = `${pair[0]} : ${pair[1]}`;
      pairs.push(strPair);
    } else {
      secondRound.push(pair[0]);
    }
  }
}

function objectifyPairs(pairs, prevPairs) {
  let newPrevPairs = Object.assign({}, prevPairs);
  pairs.forEach(pair => {
    let arrPair = pair.split(" : ");
    if (newPrevPairs[arrPair[0]] === undefined && newPrevPairs[arrPair[1]] === undefined) {
      newPrevPairs[arrPair[0]] = [];
      newPrevPairs[arrPair[0]].push(arrPair[1]);
      newPrevPairs[arrPair[1]] = [];
      newPrevPairs[arrPair[1]].push(arrPair[0]);
    } else if (newPrevPairs[arrPair[0]] === undefined) {
      newPrevPairs[arrPair[0]] = [];
      newPrevPairs[arrPair[0]].push(arrPair[1]);
      newPrevPairs[arrPair[1]].push(arrPair[0]);
    } else if (newPrevPairs[arrPair[1]] === undefined) {
      newPrevPairs[arrPair[0]].push(arrPair[1]);
      newPrevPairs[arrPair[1]] = [];
      newPrevPairs[arrPair[1]].push(arrPair[0]);
    } else {
      newPrevPairs[arrPair[0]].push(arrPair[1]);
      newPrevPairs[arrPair[1]].push(arrPair[0]);
    }
  });
  return newPrevPairs;
}


todaysPairs(prevPairs);



// TESTING:

// let prevPairs = {
//   "Cindy" : ["David", "Arittro", "Chao", "Leef", "Alvin", "Reef"],
//   "Chao" : ["David", "Arittro", "Cindy", "Leef", "Alvin", "Reef"],
//   "Arittro" : ["Chao", "Cindy", "Chao"],
//   "Reef" : ["Leef", "Cindy", "Chao"],
//   "Leef" : ["Reef", "Cindy", "Chao"],
//   "David" : ["Cindy", "Chao"],
//   "Alvin" : ["Cindy", "Chao"]
// };
//
// console.log(prevPairs);
//
// ["Arittro", "Chao", "Cindy", "David", "Alvin", "Reef", "Leef"];
// todaysPairs(prevPairs);
//
// ["Arittro", "Chao", "Cindy", "David", "Alvin", "Reef", "Leef", "Brian"];
// todaysPairs(prevPairs);
