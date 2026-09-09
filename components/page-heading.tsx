export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-green">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-fg-secondary">{description}</p>
    </div>
  );
}
