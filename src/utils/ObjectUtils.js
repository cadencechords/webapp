export function isEmpty(object) {
	return Object.keys(object).length === 0;
}

export function combineParamValues(paramName, values) {
	let combined = paramName;
	combined += values.join("&" + paramName);
	return combined;
}

export function isNullOrEmpty(text) {
	return text === null || text === undefined || text.match(/^\s*$/).length > 1;
}
