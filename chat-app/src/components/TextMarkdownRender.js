import MarkdownPreview from '@uiw/react-markdown-preview/nohighlight';
import rehypeSanitize from "rehype-sanitize";
export default function TextMarkDownRender({ text }) {
    const rehypePlugins = [rehypeSanitize];
    return (
        <MarkdownPreview
            style={{
                textAlign: "left",
                padding: "10px",
                color: "var(--foreground)",
                backgroundColor: "transparent"
            }}
            rehypePlugins={rehypePlugins}
            rehypeRewrite={(node, index, parent) => {
                if (node.tagName === "a" && parent && /^h(1|2|3|4|5|6)/.test(parent.tagName)) {
                  parent.children = parent.children.slice(1)
                }
              }}
            source={text}
        />

    );
}