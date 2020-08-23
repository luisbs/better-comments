# Better Comments

The Better Comments extension will help you create more human-friendly comments in your code.
With this extension, you will be able to categorise your annotations into:
* Alerts
* Queries
* TODOs
* Highlights
* Commented out code can also be styled to make it clear the code shouldn't be there
* Any other comment styles you'd like can be specified in the settings

![Annotated code](images/better-comments.PNG)

## Configuration

This extension can be configured in User Settings or Workspace settings.

#### Highlight Plain Text
`"better-comments.highlightPlainText": false`
This setting will control whether comments in a plain text file are styled using the annotation tags.
When true, the tags (defaults: `! * ? //`) will be detected if they're the first character on a line.

#### Multiline Comments
`"better-comments.multilineComments": true`
This setting will control whether multiline comments are styled using the annotation tags.
When false, multiline comments will be presented without decoration.

#### Use JSDoc Style
`"better-comments.useJSDocStyle": ["apex","javascript","javascriptreact","typescript","typescriptreact"]`
This setting will control whether multiline comments are styled respecting the [JSDoc](link-jsdoc) sintax.
Only applies when `#better-comments.multilineComments#` is set to `true`.
Is active by default on `apex`, `javascript`, `javascriptreact`, `typescript` and `typescriptreact` lenguages.
But other languages can be added or removed to modify this behavior, see [support](supported-languages).

`better-comments.tags`
The tags are the characters or sequences used to mark a comment for decoration.
Each tag can contain:
```jsonc
{
  // ! Required
  "tag": "!", // a singular string to match
  "tag": ["!","?"], // or a list of strings to define a common style for multiple tags

  // * Optionals
  "bold": boolean, // will be converted to "fontWeight": "bold"
  "italic": boolean, // will be converted to "fontStyle": "italic"
  "strikethrough": boolean, // will be included on "textDecoration"
  "underline": boolean, // will be included on "textDecoration"
}
```
The object also can include all the decoration valid options as `color`, `backgroundColor`, `border`, etc.
See [here](link-decoration-type) and [here](link-decoration-type1) for all the valid options.
The default 5 can be modified, and more can be added.

```json
"better-comments.tags": [
  {
    "tag": "!",
    "color": "#FF2D00",
  },
  {
    "tag": "?",
    "color": "#3498DB",
  },
  {
    "tag": "//",
    "color": "#474747",
    "strikethrough": true,
  },
  {
    "tag": "todo",
    "color": "#FF8C00",
  },
  {
    "tag": "*",
    "color": "#98C379",
  }
]
```

## Supported Languages
See language identifiers [here](link-vscode).

The support of [JSDoc](link-jsdoc) syntax is teorical, based on the syntax of the comments of each language.
But in many cases there are more apropiated alternatives for documentation syntax (e.g. [javadoc](link-javadoc) for java).

|Lenguage|Language identifier|Inline comment|Block comment|JSDoc Support|Notes|
|--------|:-----------------:|:------------:|:-----------:|:-----------:|----:|
|AsciiDoc        |`asciidoc`       |`//`|`////` `////`|
||
|Apex            |`apex`           |`//`|`/*` `*/`|**default**|
|JavaScript      |`javascript`     |`//`|`/*` `*/`|**default**|
|JavaScript React|`javascriptreact`|`//`|`/*` `*/`|**default**|
|TypeScript      |`typescript`     |`//`|`/*` `*/`|**default**|
|TypeScript React|`typescriptreact`|`//`|`/*` `*/`|**default**|
||
|AL                |`al`           |`//`|`/*` `*/`|supported|
|C                 |`c`            |`//`|`/*` `*/`|supported|
|C#                |`cpp`          |`//`|`/*` `*/`|supported|
|C++               |`csharp`       |`//`|`/*` `*/`|supported|
|Dart              |`dart`         |`//`|`/*` `*/`|supported|
|Flax              |`flax`         |`//`|`/*` `*/`|supported|
|F#                |`fsharp`       |`//`|`/*` `*/`|supported|
|Go                |`go`           |`//`|`/*` `*/`|supported|
|Groovy            |`groovy`       |`//`|`/*` `*/`|supported|
|Haxe              |`haxe`         |`//`|`/*` `*/`|supported|
|Java              |`java`         |`//`|`/*` `*/`|supported|see [javadoc](link-javadoc)
|JSON with comments|`jsonc`        |`//`|`/*` `*/`|supported|
|Kotlin            |`kotlin`       |`//`|`/*` `*/`|supported|
|Less              |`less`         |`//`|`/*` `*/`|supported|
|Objective-C       |`objective-c`  |`//`|`/*` `*/`|supported|
|Objective-C++     |`objective-cpp`|`//`|`/*` `*/`|supported|
|Object Pascal     |`objectpascal` |`//`|`/*` `*/`|supported|
|Pascal            |`pascal`       |`//`|`/*` `*/`|supported|
|PHP               |`php`          |`//`|`/*` `*/`|supported|
|Rust              |`rust`         |`//`|`/*` `*/`|supported|
|Sass              |`scala`        |`//`|`/*` `*/`|supported|see [SassDoc](link-sassdoc)
|Scala             |`sass`         |`//`|`/*` `*/`|supported|
|SCSS              |`scss`         |`//`|`/*` `*/`|supported|see [SassDoc](link-sassdoc)
|ShaderLab         |`shaderlab`    |`//`|`/*` `*/`|supported|
|Stylus            |`stylus`       |`//`|`/*` `*/`|supported|
|Swift             |`swift`        |`//`|`/*` `*/`|supported|
|Verilog           |`verilog`      |`//`|`/*` `*/`|supported|
|Vue.js            |`vue`          |`//`|`/*` `*/`|supported|
||
|CSS               |`css`              ||`/*` `*/`|supported|
||
|Terraform         |`terraform`     |`#`|`/*` `*/`|supported|see [definition](link-terraform)
||
|CoffeeScript      |`coffeescript`  |`#`|
|Dockerfile        |`dockerfile`    |`#`|
|gdscript          |`gdscript`      |`#`|
|GraphQL           |`graphql`       |`#`|
|Julia             |`julia`         |`#`|
|Makefile          |`makefile`      |`#`|
|Perl              |`perl`          |`#`|
|Perl 6            |`perl6`         |`#`|
|Puppet            |`puppet`        |`#`|
|R                 |`r`             |`#`|
|Ruby              |`ruby`          |`#`|
|ShellScript       |`shellscript`   |`#`|
|YAML              |`yaml`          |`#`|
||
|Tcl               |`tcl`           |`#`|           ||First line ignored
||
|Elixir            |`elixir`        |`#`|`"""` `"""`||First line ignored
|Python            |`python`        |`#`|`"""` `"""`||First line ignored
||
|PowerShell        |`powershell`    |`#`|`<#` `#>`|
||
|Nim               |`nim`           |`#`|`#{` `}#`|
||
|Twig              |`twig`             ||`{#` `#}`|
||
|HTML              |`html`             ||`<!--` `-->`|
|Markdown          |`markdown`         ||`<!--` `-->`|
|XML               |`xml`              ||`<!--` `-->`|
||
|ColdFusion        |`cfml`             ||`<!---` `--->`|
||
|Ada               |`ada`          |`--`|
|HiveQL            |`hive-sql`     |`--`|
|Pig               |`pig`          |`--`|
|PL/SQL            |`plsql`        |`--`|
|SQL               |`sql`          |`--`|
||
|Lua               |`lua`          |`--`|`--[[` `]]`|
||
|Elm               |`elm`          |`--`|`{-` `-}`|
|Haskell           |`haskell`      |`--`|`{-` `-}`|
||
|Erlang                       |`erlang`        |`%`|
|LaTex (inlc. Bibtex/Biblatex)|`latex` `bibtex`|`%`|
|MATLAB                       |`matlab`        |`%`|
||
|BrightScript      |`brightscript`  |`'`|
|PlantUML          |`diagram`       |`'`|
|Visual Basic      |`vb`            |`'`|
||
|Clojure           |`clojure`       |`;`|
|Lisp              |`lisp`          |`;`|
|Racket            |`racket`        |`;`|
||
|Fortran          |`fortran-modern` |`c`|
||
|SAS               |`SAS`           |`*`|
|STATA             |`stata`         |`*`|
||
|COBOL             |`COBOL`        |`*>`|
||
|GenStat           |`genstat`      |`\\`|`"` `"`|
||
|Plain text|`plaintext`||||see [configuration](highlight-plain-text)

[link-jsdoc]: https://jsdoc.app
[link-decoration-type]: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/vscode/index.d.ts#L1015
[link-decoration-type1]: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/vscode/index.d.ts#L832
[link-vscode]: https://code.visualstudio.com/docs/languages/identifiers
[link-javadoc]: https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javadoc.html
[link-sassdoc]: https://github.com/SassDoc/sassdoc
[link-terraform]: https://www.terraform.io/docs/configuration/syntax.html#comments
