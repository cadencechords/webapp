export function removeSpaces(text) {
	return text?.replaceAll(" ", "");
}

export function pluralize(word, length) {
	return length === 1 ? word : `${word}s`;
}
