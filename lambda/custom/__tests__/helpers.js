/**
 * @param testType one of integration | unit
 * @param dataMap an object eg
 * {
 *  'KEY_TO_BE_CALLED_IN_CODE': 'data-file-name'
 * }
 */
const loadData = (testType, dataMap) => {
  Object.keys(dataMap).map((key) => {
    dataMap[key] = require(`./${testType}/data/${dataMap[key]}.json`);
    return key;
  });

  return dataMap;
};

module.exports = { loadData };
