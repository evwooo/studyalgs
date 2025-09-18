import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ 
  value, 
  onChange, 
  language = 'javascript', 
  height = '400px',
  readOnly = false,
  theme = 'vs-dark'
}) => {
  const editorOptions = {
    readOnly,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace',
    lineNumbers: 'on',
    wordWrap: 'on',
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    snippetSuggestions: 'top',
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false
    },
    parameterHints: {
      enabled: true
    },
    hover: {
      enabled: true
    },
    bracketPairColorization: {
      enabled: true
    },
    guides: {
      bracketPairs: true,
      indentation: true
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    // Configure JavaScript/TypeScript language features
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      allowJs: true,
      checkJs: false,
    });

    // Add common algorithm snippets
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          {
            label: 'for-loop',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'for (let i = 0; i < ${1:array}.length; i++) {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For loop for iterating through arrays'
          },
          {
            label: 'while-loop',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'while (${1:condition}) {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'While loop'
          },
          {
            label: 'two-pointers',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'let left = 0;\nlet right = ${1:array}.length - 1;\n\nwhile (left < right) {\n\t$0\n\tleft++;\n\tright--;\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Two pointers pattern'
          },
          {
            label: 'binary-search',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'let left = 0;\nlet right = ${1:array}.length - 1;\n\nwhile (left <= right) {\n\tconst mid = Math.floor((left + right) / 2);\n\t\n\tif (${1:array}[mid] === ${2:target}) {\n\t\treturn mid;\n\t} else if (${1:array}[mid] < ${2:target}) {\n\t\tleft = mid + 1;\n\t} else {\n\t\tright = mid - 1;\n\t}\n}\n\nreturn -1;',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Binary search algorithm'
          },
          {
            label: 'dfs-recursive',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'function dfs(${1:node}) {\n\tif (!${1:node}) return;\n\t\n\t// Process current node\n\t$0\n\t\n\t// Recurse on children\n\tfor (const child of ${1:node}.children) {\n\t\tdfs(child);\n\t}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Depth-first search (recursive)'
          },
          {
            label: 'bfs-queue',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'const queue = [${1:startNode}];\nconst visited = new Set();\n\nwhile (queue.length > 0) {\n\tconst node = queue.shift();\n\t\n\tif (visited.has(node)) continue;\n\tvisited.add(node);\n\t\n\t// Process node\n\t$0\n\t\n\t// Add neighbors to queue\n\tfor (const neighbor of node.neighbors) {\n\t\tif (!visited.has(neighbor)) {\n\t\t\tqueue.push(neighbor);\n\t\t}\n\t}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Breadth-first search using queue'
          }
        ];

        return { suggestions };
      }
    });

    // Focus editor if not read-only
    if (!readOnly) {
      editor.focus();
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language}
        theme={theme}
        value={value}
        onChange={onChange}
        options={editorOptions}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading editor...</p>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default CodeEditor;
