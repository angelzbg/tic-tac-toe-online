/*const shit = ({a = 5, b = 10} = {}) => {
    console.log('a', a)
    console.log('b', b)
}*/

//shit({a:20});

const a = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

for (let i = 0; i < 3; i++) {
  const rowCheck = [...new Set(a[i])];
  if (rowCheck.length === 1 && rowCheck[0] !== 0) {
    return 'Winner';
  }

  const colCheck = [...new Set(a.reduce((col, row) => [...col, row[i]], []))];
  if (colCheck.length === 1 && colCheck[0] !== 0) {
    return 'Winner';
  }
}

const mainDiag = [...new Set([a[0][0], a[1][1], a[2][2]])];
if (mainDiag.length === 1 && mainDiag[0] !== 0) {
  return 'Winner';
}

const secDiag = [...new Set([a[0][2], a[1][1], a[2][0]])];
if (secDiag.length === 1 && secDiag[0] !== 0) {
  return 'Winner';
}
