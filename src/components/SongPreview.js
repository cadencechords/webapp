export default function SongPreview() {
	let lyrics = `Amazing Grace, how sweet the sound\nThat saved a wretch like me\nI once was lost, but now am found\nWas blind but now I see\n\nWas Grace that taught\nmy heart to fear\nAnd Grace, my fears relieved\nHow precious did\nthat Grace appear\nThe hour I first believed\n\nThrough many dangers, toils and snares\nWe have already come\nT'was Grace that brought us safe thus far\nAnd Grace will lead us home`;
	return (
		<div className="rounded-md whitespace-pre resize-none shadow-md p-4 border border-gray-300">
			{lyrics}
		</div>
	);
}
