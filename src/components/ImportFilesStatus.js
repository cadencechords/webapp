import Button from "./Button";
import { Link } from "react-router-dom";
import PageLoading from "./PageLoading";

export default function ImportFilesStatus({ errors, loading, onReset }) {
	function buildErrors() {
		return (
			<div>
				<div className="rounded-md bg-red-100 p-3 text-red-900 mb-6">
					<h3 className="text-lg mb-4 font-medium">
						Looks like some errors occurred while importing:
					</h3>
					<ul className="list-disc list-inside">
						{errors?.map?.((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</div>
				<p className="text-lg font-medium mb-6">Your remaining songs imported successfully</p>
			</div>
		);
	}

	if (loading) return <PageLoading>Importing</PageLoading>;

	return (
		<>
			{errors?.length > 0 ? (
				buildErrors()
			) : (
				<p className="text-lg font-medium mb-6">Everything imported successfully</p>
			)}
			<div className="grid grid-cols-2 gap-4">
				<Button variant="outlined" full onClick={onReset}>
					Import more songs
				</Button>

				<Link to="/songs">
					<Button full>View song library</Button>
				</Link>
			</div>
		</>
	);
}
