// "OR" between two outline-variant dividers, in label-medium.
export default function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-6 text-label-medium font-plain text-on-surface-variant">
      <hr className="grow border-outline-variant" />
      OR
      <hr className="grow border-outline-variant" />
    </div>
  );
}
