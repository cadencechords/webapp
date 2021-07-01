import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";

export default function ProfilePicture({ url, size, onClick }) {
	if (url) {
		return (
			<div style={{ width: SIZES[size], height: SIZES[size] }} onClick={onClick}>
				<div
					className={`w-full h-full rounded-full bg-gray-200 ${
						onClick ? " cursor-pointer hover:opacity-90 transition-opacity" : ""
					}`}
					style={{
						backgroundImage: `url('${url}')`,
						backgroundPosition: "center",
						backgroundSize: "cover",
					}}
				></div>
			</div>
		);
	} else {
		return (
			<div
				style={{ width: SIZES[size], height: SIZES[size] }}
				className={`flex-center ${
					onClick ? " cursor-pointer hover:opacity-90 transition-opacity" : ""
				}`}
				onClick={onClick}
			>
				<UserCircleIcon className="w-full h-full text-gray-500" />
			</div>
		);
	}
}

ProfilePicture.defaultProps = {
	size: "base",
};

const SIZES = {
	xs: "30px",
	sm: "50px",
	base: "70px",
	lg: "90px",
	xl: "110px",
	xl2: "130px",
};
