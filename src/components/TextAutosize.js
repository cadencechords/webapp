import { Textfit } from "react-textfit";

export default function TextAutosize({ children, autosize, fontSize }) {
	if (autosize) {
		return <Textfit mode="single">{children}</Textfit>;
	} else {
		return <div style={{ fontSize: `${fontSize}px` }}>{children}</div>;
	}
}
