import * as vscode from 'vscode';

interface CommentTag {
	tag: string[] | string;
	escapedTag: string[] | string;
	decoration: vscode.TextEditorDecorationType;
	ranges: Array<vscode.DecorationOptions>;
}

//* 'color' and 'backgroundColor' are part of the 'DecorationRenderOptions'
//* 'DecorationRenderOptions' included to make styles more customizable (border, opacity, etc)
//* tags: string[] included to allow multiple tag with the same style
//* 'bold', 'italic', 'strikethrough', 'underline' manteined to be more comprenhensible
//* but make it optional values to make shorter style definitions
type DecorationTag = vscode.DecorationRenderOptions & {
	tag: string[] | string;
	bold?: boolean;
	italic?: boolean;
	strikethrough?: boolean;
	underline?: boolean;
}

interface Contributions {
	highlightPlainText: boolean;
	singleLineComments: boolean;
	multilineComments: boolean;
	useJSDocStyle: string[];
	tags: DecorationTag[];
}

export class Parser {
	private tags: CommentTag[] = [];

	private delimiter: string[] | string = "";
	private blockCommentStart: string = "";
	private blockCommentEnd: string = "";

	private singlelineCommentRegex?: RegExp;
	private blockCommentRegex?: RegExp;
	private tagsRegex?: RegExp;

	private highlightPlainText = false;
	private highlightSingleLineComments = true;
	private highlightMultilineComments = true;
	private highlightJSDoc = false;

	// * this is used to prevent the first line of the file (specifically python) from coloring like other comments
	private ignoreFirstLine = false;

	// * this is used to trigger the events when a supported language code is found
	public supportedLanguage = true;

	// Read from the package.json
	private contributions: Contributions = vscode.workspace.getConfiguration('better-comments') as any;

	public constructor() {
		this.setTags();
	}

	/**
	 * Sets the regex to be used by the matcher based on the config specified in the package.json
	 * @param languageCode The short code of the current language
	 * https://code.visualstudio.com/docs/languages/identifiers
	 */
	public SetRegex(languageCode: string) {
		this.setDelimiter(languageCode);

		// if the language isn't supported, we don't need to go any further
		if (!this.supportedLanguage) return;

		let characters: string[] = [];
		for (const commentTag of this.tags) {
			if (Array.isArray(commentTag.escapedTag)) {
				for (const tag of commentTag.escapedTag) {
					characters.push(tag);
				}
			} else {
				characters.push(commentTag.escapedTag);
			}
		}

		if (this.highlightSingleLineComments) {
			let delimiters: string[] = [];
			if (Array.isArray(this.delimiter)) {
				for (const delimiter of this.delimiter) {
					delimiters.push(delimiter);
				}
			} else delimiters.push(this.delimiter);

			let expression = this.highlightPlainText
				? "(^)+([ \\t]*[ \\t]*)("
				: "(" + delimiters.join("|") + ")+( |\\t)*(";
			expression += characters.join("|");
			expression += ")+(.*)";

			// if it's plain text, we have to do mutliline regex to catch the start of the line with ^
			const regexFlags = this.highlightPlainText ? "igm" : "ig";
			this.singlelineCommentRegex = new RegExp(expression, regexFlags);
		}

		// If highlight multiline is off in package.json or doesn't apply to his language, return
		if (!this.highlightMultilineComments) return;

		// Combine custom delimiters and the rest of the comment block matcher
		let tagMatchString = this.highlightJSDoc
			? "(^)+([ \\t]*\\*[ \\t]*)(" // Highlight after leading *
			: "(^)+([ \\t]*[ \\t]*)(";
		tagMatchString += characters.join("|");
		tagMatchString += ")([ ]*|[:])+([^*/][^\\r\\n]*)";

		// Find rows of comments matching pattern /** */ (JSDoc)
		// or use start and end delimiters to find block comments
		let blockMatchString = "(^|[ \\t])(";
		blockMatchString += this.highlightJSDoc ? "\\/\\*\\*" : this.blockCommentStart;
		blockMatchString += "[\\s])+([\\s\\S]*?)(";
		blockMatchString += this.highlightJSDoc ? "\\*\\/" : this.blockCommentEnd;
		blockMatchString += ")";

		this.tagsRegex = new RegExp(tagMatchString, "igm");
		this.blockCommentRegex = new RegExp(blockMatchString, "gm");
	}

	/**
	 * Finds all single line comments delimited by a given delimiter and matching tags specified in package.json
	 * @param activeEditor The active text editor containing the code document
	 */
	public FindSingleLineComments(activeEditor: vscode.TextEditor): void {

		// If highlight single line comments is off, single line comments are not supported for this language
		if (!this.highlightSingleLineComments || !this.singlelineCommentRegex) return;
		let text = activeEditor.document.getText();

		let match: any;
		while (match = this.singlelineCommentRegex.exec(text)) {
			let startPos = activeEditor.document.positionAt(match.index);
			let endPos = activeEditor.document.positionAt(match.index + match[0].length);
			let range: vscode.DecorationOptions = { range: new vscode.Range(startPos, endPos) };

			// Required to ignore the first line of .py files (#61)
			if (this.ignoreFirstLine && startPos.line === 0 && startPos.character === 0) {
				continue;
			}

			// Find which custom delimiter was used in order to add it to the collection
			let matchTag = this.tags.find(item => {
				if (Array.isArray(item.tag)) {
					for (const tag of item.tag) {
						if (tag.toLowerCase() === match[3].toLowerCase()) return true;
					}
					return false;
				} else {
					return item.tag.toLowerCase() === match[3].toLowerCase();
				}
			});

			if (matchTag) {
				matchTag.ranges.push(range);
			}
		}
	}

	/**
	 * Finds block comments as indicated by start and end delimiter
	 * @param activeEditor The active text editor containing the code document
	 */
	public FindBlockComments(activeEditor: vscode.TextEditor): void {

		// If highlight multiline is off in package.json or doesn't apply to his language, return
		if (!this.highlightMultilineComments || !this.blockCommentRegex || !this.tagsRegex) return;
		let text = activeEditor.document.getText();

		// Find the multiline comment block
		let match: any;
		while (match = this.blockCommentRegex.exec(text)) {
			let commentBlock = match[0];

			// Find the line
			let line;
			while (line = this.tagsRegex.exec(commentBlock)) {
				let startPos = activeEditor.document.positionAt(match.index + line.index + line[2].length);
				let endPos = activeEditor.document.positionAt(match.index + line.index + line[0].length);
				let range: vscode.DecorationOptions = { range: new vscode.Range(startPos, endPos) };

				// Find which custom delimiter was used in order to add it to the collection
				let matchString = line[3] as string;
				let matchTag = this.tags.find(item => {
					if (Array.isArray(item.tag)) {
						for (const tag of item.tag) {
							if (tag.toLowerCase() === matchString.toLowerCase()) return true;
						}
						return false;
					} else {
						return item.tag.toLowerCase() === matchString.toLowerCase();
					}
				});

				if (matchTag) {
					matchTag.ranges.push(range);
				}
			}
		}
	}

	/**
	 * Apply decorations after finding all relevant comments
	 * @param activeEditor The active text editor containing the code document
	 */
	public ApplyDecorations(activeEditor: vscode.TextEditor): void {
		for (let tag of this.tags) {
			activeEditor.setDecorations(tag.decoration, tag.ranges);

			// clear the ranges for the next pass
			tag.ranges.length = 0;
		}
	}

	/**
	 * Sets the highlighting tags up for use by the parser
	 */
	private setTags(): void {
		let items = this.contributions.tags;
		for (let item of items) {
			// * `DecorationRenderOptions` has priority over custom properties

			// * if `fontWeight` is not defined, look for `bold`
			if (!item.fontWeight && item.bold) item.fontWeight = "bold";

			// * if `fontStyle` is not defined, look for `italic`
			if (!item.fontStyle && item.italic) item.fontStyle = "italic";

			// * if `textDecoration` is not defined, look for `strikethrough` and `underline`
			if (!item.textDecoration) {
				let textDecoration: string[] = [];

				if (item.underline) textDecoration.push("underline");
				if (item.strikethrough) textDecoration.push("line-through");
				item.textDecoration = textDecoration.join(" ");
			}
			// item.tags
			const sequenceMatchRegExp = /([()[{*+.$^\\|?])/g;
			let escapedSequence: string[] | string;

			if (Array.isArray(item.tag)) {
				escapedSequence = [];

				for (const tag of item.tag) {
					// ! hardcoded to escape slashes
					escapedSequence.push(tag.replace(sequenceMatchRegExp, '\\$1').replace(/\//gi, "\\/"));
				}
			} else {
				// ! hardcoded to escape slashes
				escapedSequence = item.tag.replace(sequenceMatchRegExp, '\\$1').replace(/\//gi, "\\/");
			}

			this.tags.push({
				tag: item.tag,
				escapedTag: escapedSequence,
				ranges: [],
				decoration: vscode.window.createTextEditorDecorationType(item)
			});
		}
	}

	/**
	 * Sets the comment delimiter [//, #, --, '] of a given language
	 * @param languageCode The short code of the current language
	 * https://code.visualstudio.com/docs/languages/identifiers
	 */
	private setDelimiter(languageCode: string): void {
		let useJSDocStyle = false;
		switch (languageCode) {
			case "asciidoc":
				this.setCommentFormat({ delimiter: "//", start: "////", end: "////" });
				break;

			case "al":
			case "apex":
			case "c":
			case "cpp":
			case "csharp":
			case "dart":
			case "flax":
			case "fsharp":
			case "go":
			case "groovy":
			case "haxe":
			case "java":
			case "javascript":
			case "javascriptreact":
			case "jsonc":
			case "kotlin":
			case "less":
			case "objective-c":
			case "objective-cpp":
			case "objectpascal":
			case "pascal":
			case "php":
			case "rust":
			case "scala":
			case "sass":
			case "scss":
			case "shaderlab":
			case "stylus":
			case "swift":
			case "typescript":
			case "typescriptreact":
			case "verilog":
			case "vue":
				useJSDocStyle = !!this.contributions.useJSDocStyle.find(lang => lang === languageCode);
				this.setCommentFormat({ delimiter: "//", start: "/*", end: "*/", useJSDocStyle });
				break;

			case "stata":
				useJSDocStyle = !!this.contributions.useJSDocStyle.find(lang => lang === languageCode);
				this.setCommentFormat({ delimiter: ["//","*"], start: "/*", end: "*/", useJSDocStyle });
				break;

			case "SAS":
				useJSDocStyle = !!this.contributions.useJSDocStyle.find(lang => lang === languageCode);
				this.setCommentFormat({ delimiter: "*", start: "/*", end: "*/", useJSDocStyle });

			case "css":
				useJSDocStyle = !!this.contributions.useJSDocStyle.find(lang => lang === languageCode);
				this.setCommentFormat({ delimiter: "/*", start: "/*", end: "*/", useJSDocStyle });
				break;

			case "terraform":
				useJSDocStyle = !!this.contributions.useJSDocStyle.find(lang => lang === languageCode);
				this.setCommentFormat({ delimiter: "#", start: "/*", end: "*/", useJSDocStyle });
				break;

			case "coffeescript":
			case "dockerfile":
			case "gdscript":
			case "graphql":
			case "julia":
			case "makefile":
			case "perl":
			case "perl6":
			case "puppet":
			case "r":
			case "ruby":
			case "shellscript":
			case "yaml":
				this.setCommentFormat({ delimiter: "#" });
				break;

			case "tcl":
				this.setCommentFormat({ delimiter: "#", ignoreFirstLine: true });
				break;

			case "elixir":
			case "python":
				this.setCommentFormat({ delimiter: "#", start: '"""', end: '"""', ignoreFirstLine: true });
				break;

			case "powershell":
				this.setCommentFormat({ delimiter: "#", start: "<#", end: "#>" });
				break;

			case "nim":
				this.setCommentFormat({ delimiter: "#", start: "#[", end: "]#" });
				break;

			case "twig":
				this.setCommentFormat({ delimiter: "{#", start: "{#", end: "#}" });
				break;

			case "html":
			case "markdown":
			case "svg":
			case "xml":
				this.setCommentFormat({ delimiter: "<!--", start: "<!--", end: "-->" });
				break;

			case "cfml":
				this.setCommentFormat({ delimiter: "<!---", start: "<!---", end: "--->" });
				break;

			case "ada":
			case "hive-sql":
			case "pig":
			case "plsql":
			case "sql":
				this.setCommentFormat({ delimiter: "--"});
				break;

			case "lua":
				this.setCommentFormat({ delimiter: "--", start: "--[[", end: "]]" });
				break;

			case "elm":
			case "haskell":
				this.setCommentFormat({ delimiter: "--", start: "{-", end: "-}" });
				break;

			case "brightscript":
			case "diagram": // ? PlantUML is recognized as Diagram (diagram)
			case "vb":
				this.setCommentFormat({ delimiter: "'"});
				break;

			case "clojure":
			case "lisp":
			case "racket":
				this.setCommentFormat({ delimiter: ";" });
				break;

			case "bibtex":
			case "erlang":
			case "latex":
			case "matlab":
				this.setCommentFormat({ delimiter: "%" });
				break;

			case "fortran-modern":
				this.setCommentFormat({ delimiter: "c" });
				break;

			case "COBOL":
				this.setCommentFormat({ delimiter: "*>" });
				break;

			case "genstat":
				this.setCommentFormat({ delimiter: "\\", start: '"', end: '"' });
				break;

			case "plaintext":
				this.setCommentFormat({ plainText: true });
				break;

			default:
				this.setCommentFormat();
				break;
		}
	}

	/**
	 * Set up the comment format for single and multiline highlighting
	 * @param singleLine The single line comment delimiter. If NULL, single line is not supported
	 * @param start The start delimiter for block comments
	 * @param end The end delimiter for block comments
	 */
	private setCommentFormat(option?: {
		delimiter?: string[] | string;
		start?: string;
		end?: string;
		useJSDocStyle?: boolean;
		ignoreFirstLine?: boolean;
		plainText?: boolean;
	}): void {
		if (!option) {
			this.supportedLanguage = false;
			return;
		}

		if (option.plainText) {
			// If highlight plaintext and highlight single line are enabeld, this is a supported language
			this.supportedLanguage = this.highlightPlainText
				= this.contributions.highlightPlainText && this.contributions.singleLineComments;
			return;
		}

		// If no single line comment delimiter is passed, single line comments are not supported
		this.highlightSingleLineComments = this.contributions.singleLineComments && !!option.delimiter;
		if (Array.isArray(option.delimiter)) this.delimiter = option.delimiter.map(val => this.escapeRegExp(val));
		else if (!!option.delimiter) this.delimiter = this.escapeRegExp(option.delimiter);
		else this.delimiter = "";

		// Multiline comments disable, if it was disabled on configuration or if the language doesn't have it
		this.highlightMultilineComments = this.contributions.multilineComments && !!option.start;
		this.blockCommentStart = option.start ? this.escapeRegExp(option.start) : "";
		this.blockCommentEnd = option.end ? this.escapeRegExp(option.end) : "";

		// Option settings
		this.supportedLanguage = true;
		this.highlightPlainText = false;
		this.highlightJSDoc = !!option.useJSDocStyle;
		this.ignoreFirstLine = !!option.ignoreFirstLine;
	}

	/**
	 * Escapes a given string for use in a regular expression
	 * @param input The input string to be escaped
	 * @returns {string} The escaped string
	 */
	private escapeRegExp(input: string): string {
		return input.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&'); // $& means the whole matched string
	}
}
