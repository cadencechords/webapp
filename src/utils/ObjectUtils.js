export function isEmpty(object) {
  return Object.keys(object).length === 0;
}

export function combineParamValues(paramName, values) {
  let combined = paramName;
  combined += values.join('&' + paramName);
  return combined;
}

export function isNullOrEmpty(text) {
  return text === null || text === undefined || text.match(/^\s*$/).length > 1;
}

export function getModifiedFields(incoming, original, comparators) {
  const fieldsOnIncoming = Object.keys(incoming);

  let modifiedValues = {};

  fieldsOnIncoming.forEach(field => {
    if (comparators[field]) {
      const compareFunction = comparators[field];
      if (compareFunction(incoming[field], original[field])) {
        modifiedValues[field] = incoming[field];
      }
    } else if (incoming[field] !== original[field]) {
      modifiedValues[field] = incoming[field];
    }
  });

  return modifiedValues;
}
