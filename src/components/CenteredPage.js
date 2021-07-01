export default function CenteredPage({ children, className }) {
	return (
		<div className={`h-screen mx-auto flex-center ${className}`}>
			<div className="m-auto lg:w-2/5 sm:w-3/4 md:w-3/5 w-full px-3 max-w-xl">{children}</div>
		</div>
	);
}
