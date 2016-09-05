// DEV!

const fs = require('fs');

var arr = fs.readdirSync('./');

let buf = [];

arr = arr.filter(el => el.endsWith('.js'));

arr.map(el => {
  let curStr = `import ${el.slice(0,-3)} from './${el.slice(0,-3)}';`;
  buf.push(curStr);
})

let result = buf.join('\n');

fs.writeFile('result.txt', result, (err) => {
  if (err) throw err;
  console.log('It\'s saved!');
});