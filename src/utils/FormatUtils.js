export const FONTS = [
	"Arial",
	"Verdana",
	"Helvetica",
	"Tahoma",
	"Trebuchet",
	"Times New Roman",
	"Georgia",
	"Garamond",
	"Courier New",
];

export const FONT_SIZES = [
	"14",
	"15",
	"16",
	"17",
	"18",
	"19",
	"20",
	"21",
	"22",
	"24",
	"26",
	"28",
	"30",
];

export function pluralOrSingularize(word, items) {
	let letterS = items.length === 1 ? "" : "s";
	return word + letterS;
}
