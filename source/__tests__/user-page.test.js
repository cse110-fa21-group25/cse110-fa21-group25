/* eslint-disable guard-for-in */
/**
 * @jest-environment jsdom
 */
const functions = require('../assets/scripts/user-page.js');

// searchForKey testing

// Shallow object
testObjectShallow = {
  'keyBool': true,
  'keyNum': 12.3,
  'keyStr': 'test',
  'keyObj': {'name': 'testObj'}
}
for (const key in testObjectShallow) {
  test(`searchForKey on shallow object: key ${key}`, () => {
    expect(functions.searchForKey(testObjectShallow, key)).toBe(testObjectShallow[key]);
  });
}

// Deeper object
testObjectDeep = {
  'SecondLayer': {
    'ThirdLayer': {
      'thirdKey': 3
    },
    'secondKey': 2
  },
  'firstKey': 1
}
test(`searchForKey on deep object: firstKey`, () => {
  expect(functions.searchForKey(testObjectDeep, 'firstKey')).toBe(1);
});

test(`searchForKey on deep object: secondKey`, () => {
  expect(functions.searchForKey(testObjectDeep, 'secondKey')).toBe(2);
});

test(`searchForKey on deep object: thirdKey`, () => {
  expect(functions.searchForKey(testObjectDeep, 'thirdKey')).toBe(3);
});
