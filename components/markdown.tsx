import Image from "next/image";
import Link from "next/link";
import { MarkdownAsync } from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { basePath } from "@/lib/site";

export async function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-neutral min-w-0 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-a:text-[#16803f] prose-blockquote:border-accent-green prose-pre:max-w-full prose-pre:overflow-x-auto prose-pre:border prose-pre:border-border-default prose-pre:bg-surface-inset prose-img:rounded-lg dark:prose-a:text-accent-green">
      <MarkdownAsync
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            { behavior: "wrap", properties: { className: ["heading-anchor"] } },
          ],
          [
            rehypePrettyCode,
            { theme: "github-dark-default", keepBackground: false },
          ],
        ]}
        components={{
          a: ({ href = "", children, ...props }) =>
            href.startsWith("/") ? (
              <Link href={href} {...props}>
                {children}
              </Link>
            ) : (
              <a href={href} rel="noopener noreferrer" {...props}>
                {children}
              </a>
            ),
          img: ({ src = "", alt = "" }) => (
            <Image
              src={
                typeof src === "string" && src.startsWith("/")
                  ? `${basePath}${src}`
                  : typeof src === "string"
                    ? src
                    : ""
              }
              alt={alt}
              width={1200}
              height={630}
              className="h-auto w-full"
            />
          ),
        }}
      >
        {children}
      </MarkdownAsync>
    </div>
  );
}
