import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'

export const tagColors = {
    h1: "text-4xl font-extrabold text-indigo-700 mb-3 mt-4",
    h2: "text-3xl font-bold text-purple-700 mb-2 mt-4",
    h3: "text-2xl font-semibold text-blue-700 mb-2 mt-3",
    h4: "text-xl font-semibold text-blue-600 mb-2 mt-2",
    h5: "text-lg font-semibold text-blue-500 mb-2 mt-2",
    h6: "text-base font-semibold text-blue-400 mb-2 mt-2",
    p: "text-base text-gray-800 leading-relaxed mb-2",
    ol: "list-decimal list-inside pl-6 mb-2 text-purple-700",
    ul: "list-disc list-inside pl-6 mb-2 text-indigo-700",
    li: "mb-1 text-gray-800",
    strong: "font-bold text-indigo-800",
    em: "italic text-purple-800",
    blockquote: "border-l-4 border-indigo-400 bg-indigo-50 text-indigo-900 px-4 py-2 my-2 rounded-md",
    code: "bg-gray-900 text-green-300 px-1 py-0.5 rounded font-mono text-sm",
    pre: "bg-gray-900 rounded-lg p-4 overflow-x-auto my-4",
    a: "text-blue-600 underline hover:text-blue-800 transition-colors",
    hr: "my-4 border-t-2 border-gray-200",
    table: "table-auto border-collapse w-full my-4",
    th: "border-b-2 border-gray-300 px-3 py-2 text-left bg-gray-100 text-indigo-800",
    td: "border-b border-gray-200 px-3 py-2",
};

export const Components = {
    code({ children, className, ...rest }: any) {
        const match = /language-(\w+)/.exec(className || "");
        return match ? (
            <div className={tagColors.pre}>
                <SyntaxHighlighter
                    {...rest}
                    PreTag="div"
                    language={match[1]}
                    style={dark}
                    customStyle={{
                        background: "#181825",
                        borderRadius: "0.75rem",
                        fontSize: "1em",
                        padding: "1.25em",
                        margin: 0,
                    }}
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
            </div>
        ) : (
            <code className={tagColors.code + " " + (className || "")} {...rest}>
                {children}
            </code>
        );
    },
    h1: ({ children, ...props }: any) => (
        <h1 className={tagColors.h1} {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: any) => (
        <h2 className={tagColors.h2} {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: any) => (
        <h3 className={tagColors.h3} {...props}>{children}</h3>
    ),
    h4: ({ children, ...props }: any) => (
        <h4 className={tagColors.h4} {...props}>{children}</h4>
    ),
    h5: ({ children, ...props }: any) => (
        <h5 className={tagColors.h5} {...props}>{children}</h5>
    ),
    h6: ({ children, ...props }: any) => (
        <h6 className={tagColors.h6} {...props}>{children}</h6>
    ),
    p: ({ children, ...props }: any) => (
        <p className={tagColors.p} {...props}>{children}</p>
    ),
    ol: ({ children, ...props }: any) => (
        <ol className={tagColors.ol} {...props}>{children}</ol>
    ),
    ul: ({ children, ...props }: any) => (
        <ul className={tagColors.ul} {...props}>{children}</ul>
    ),
    li: ({ children, ...props }: any) => (
        <li className={tagColors.li} {...props}>{children}</li>
    ),
    strong: ({ children, ...props }: any) => (
        <strong className={tagColors.strong} {...props}>{children}</strong>
    ),
    em: ({ children, ...props }: any) => (
        <em className={tagColors.em} {...props}>{children}</em>
    ),
    blockquote: ({ children, ...props }: any) => (
        <blockquote className={tagColors.blockquote} {...props}>{children}</blockquote>
    ),
    a: ({ children, href, ...props }: any) => (
        <a className={tagColors.a} href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
        </a>
    ),
    hr: (props: any) => <hr className={tagColors.hr} {...props} />,
    table: ({ children, ...props }: any) => (
        <table className={tagColors.table} {...props}>{children}</table>
    ),
    th: ({ children, ...props }: any) => (
        <th className={tagColors.th} {...props}>{children}</th>
    ),
    td: ({ children, ...props }: any) => (
        <td className={tagColors.td} {...props}>{children}</td>
    ),
};