const prevPairs = {
  Ryan: [ 'Mark' ],
  Mark: [ 'Guy' ],
  Guy: [ 'Mark' ],
  Dwayne: [],
  Yuri: [ 'Michael' ],
  Michael: [ 'Yuri' ],
  Carlos: [ 'Nguyen' ],
  Nguyen: [ 'Carlos' ],
  Ritchy: [ 'Rene' ],
  Rene: [ 'Ritchy' ],
  Abzal: [ 'Cihad' ],
  Cihad: [ 'Abzal' ],
  Aaron: [ 'Sanjay' ],
  Sanjay: [ 'Aaron' ] };

const prevPairsStr = '';

console.log(JSON.parse(prevPairsStr));

console.log(JSON.stringify(prevPairs));
