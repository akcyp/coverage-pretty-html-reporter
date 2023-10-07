function notusedfn() {
  console.log("uncovered");
}

const sum = (a, b) => {
  switch (a) {
    case 0: {
      console.log("uncovered branch");
    }
    case 1: {
      console.log("covered");
    }
  }
  return a + b;
};

const multiply = (a, b) => {
  // uncovered statement
  return a * b;
};

module.exports = {
  sum,
  multiply,
};
