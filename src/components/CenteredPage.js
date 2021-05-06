export default function CenteredPage({ children }) {
	return (
		<div className="h-screen flex mx-auto items-center justify-center">
			<div className="m-auto lg:w-2/5 sm:w-3/4 md:w-3/5 w-full px-3 max-w-xl">{children}</div>
		</div>
	);
}
