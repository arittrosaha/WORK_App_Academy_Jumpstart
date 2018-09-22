var fs = require('fs');

function todaysPairs() {
  var students = gettingStudents();
  var prevPairs = gettingPrevPairs();
  var pairs = [];
  var secondRound = [];
  var single = [];

  pickUniqPairs(students, secondRound, prevPairs, pairs);

  let newPrevPairs = objectifyPairs(pairs, prevPairs);
  savePrevPairs(newPrevPairs);


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
}

function getRandomInt(numOfStudents) {
  numOfStudents = Math.floor(numOfStudents);
  return Math.floor(Math.random() * numOfStudents);
}

function diff(arr1, arr2) {
    return arr1.filter(idx => arr2.indexOf(idx) < 0);
}

function gettingStudents() {
  let students = fs.readFileSync('students.txt').toString().split("\n");
  if (students.every(element => element === "")) {
    return [];
  } else {
    return students;
  }
}

function gettingPrevPairs() {
  let prevPairsJSONStr = fs.readFileSync('prevPairs.txt').toString();
  if (prevPairsJSONStr.split("\n").every(element => element === "")) {
    return {};
  } else {
    return JSON.parse(prevPairsJSONStr);
  }
}

function savePrevPairs(prevPairs) {
  fs.writeFile("prevPairs.txt", JSON.stringify(prevPairs), (error) => {
    if (error) {
      console.log(error);
    }
  });
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


todaysPairs();
