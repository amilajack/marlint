/* @flow */
const Block = () => {
  return <div className="as" />;
};

let text = 'random';
let x = {
  text: text
};

x.run(function () {});

console.log("testing" + x.text)
