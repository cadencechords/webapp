export function removeSpaces(text) {
	return text?.replaceAll(" ", "");
}

export function basename(filename) {
	return filename?.split(".")[0];
}

export function extension(filename) {
	return filename?.split(".").slice(1).join(".");
}

export function pluralize(word, length) {
	return length === 1 ? word : `${word}s`;
}
