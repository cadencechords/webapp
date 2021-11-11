import { useEffect, useRef } from "react";

export default function FadeIn({ children, className }) {
	const ref = useRef();

	useEffect(() => {
		setTimeout(() => {
			ref.current?.classList.toggle("translate-y-6");
			ref.current?.classList.toggle("opacity-0");
		}, [20]);
	}, []);

	return (
		<div className={`transform translate-y-6 opacity-0 duration-700 ${className}`} ref={ref}>
			{children}
		</div>
	);
}
