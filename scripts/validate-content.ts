import { validateAllContent } from "../lib/content";

try {
  const { items, errors } = validateAllContent();
  if (errors.length) {
    console.error(`Content validation failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  const published = items.filter((item) => !item.draft).length;
  const drafts = items.length - published;
  console.log(
    `Validated ${published} published item(s) and ${drafts} draft(s).`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
