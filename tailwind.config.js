module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
		fontFamily: {
			display: ["Mukta", "sans-serif"],
		},
	},
	variants: {
		extend: {
			backgroundColor: ["checked"],
			borderColor: ["checked"],
			borderWidth: ["last"],
			display: ["group-hover"],
			borderRadius: ["last", "first"],
		},
	},
	plugins: [require("tailwind-scrollbar")],
};
