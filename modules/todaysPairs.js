const fs = require("fs");

class TodaysPairs {
  constructor(students) {
    this.students = students;
  }

  makingPairs() {
    var students = this.students;
    var prevPairs = this.gettingPrevPairs();
    var pairs = [];
    var secondRound = [];
    var single = [];

    this.pickUniqPairs(students, secondRound, prevPairs, pairs);

    let newPrevPairs = this.objectifyPairs(pairs, prevPairs);
    this.savePrevPairs(newPrevPairs);


    if (secondRound.length !== 1) {
      students = secondRound;
      secondRound = [];
      this.pickSecondPairs(students, secondRound, pairs, single);
    }

    return [pairs, secondRound, single];
  }

  getRandomInt(numOfStudents) {
    numOfStudents = Math.floor(numOfStudents);
    return Math.floor(Math.random() * numOfStudents);
  }

  diff(arr1, arr2) {
    return arr1.filter(el => arr2.indexOf(el) < 0);
  }

  gettingPrevPairs() {
    let prevPairsJSONStr = fs.readFileSync("./files/prevPairs.txt").toString();
    if (prevPairsJSONStr.split("\n").every(element => element === "")) {
      return {};
    } else {
      return JSON.parse(prevPairsJSONStr);
    }
  }

  savePrevPairs(prevPairs) {
    fs.writeFile("./files/prevPairs.txt", JSON.stringify(prevPairs), (error) => {
      if (error) {
        console.log(error);
      }
    });
  }

  pickSecondPairs (students, secondRound, pairs, single) {
    while (true) {
      if (students.length === 0) {
        break;
      }

      let pair = [];

      if (students.length > 0) {
        var idx = this.getRandomInt(students.length);
        pair.push(students[idx]);
        students.splice(idx, 1);
      }

      if (students.length > 0) {
        idx = this.getRandomInt(students.length);
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

  pickUniqPairs (students, secondRound, prevPairs, pairs) {
    while (true) {
      if (students.length === 0) {
        break;
      }

      let pair = [];

      if (students.length > 0) {
        var idx = this.getRandomInt(students.length);
        var notIncluding = this.diff(students, [students[idx]]);

        if (prevPairs[students[idx]]) {
          var notPairedStudents = this.diff(notIncluding, prevPairs[students[idx]]);
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
        idx = this.getRandomInt(notPairedStudents.length);
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

  objectifyPairs(pairs, prevPairs) {
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
}

module.exports = TodaysPairs;
