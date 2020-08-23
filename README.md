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
When true, the tags will be detected if they're the first character on a line.
Only applies when `better-comments.singleLineComments` is set to `true`.

#### Single Line Comments
`"better-comments.singleLineComments": true`
Whether the single line comment highlighter should be active
When false, single line comments will be presented without decoration.

#### Multiline Comments
`"better-comments.multilineComments": true`
This setting will control whether multiline comments are styled using the annotation tags.
When false, multiline comments will be presented without decoration.

#### Use JSDoc Style
`"better-comments.useJSDocStyle": ["apex","javascript","javascriptreact","typescript","typescriptreact"]`
This setting will control whether multiline comments are styled respecting the [JSDoc](link-jsdoc) sintax.
Only applies when `better-comments.multilineComments` is set to `true`.
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
> If a custom option as `bold` and a the original option `fontWeight` the original will have priority.
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
`**Default**` languages use JSDoc as the recommeded syntax (e.g. javascript)
`_Supported_` languages doesn't have JSDoc, but they have a similar syntax standard (e.g. [Javadoc](link-javadoc) for java).
`~Compatible~` languages are compatible, but they have a different recommended syntax (e.g. [SassDoc](link-sassdoc) for sass/scss).
`Compatible` languages are teorical compatible based on their comment syntax.

|Lenguage|Language identifier|Inline comment|Block comment|JSDoc Support|Notes|
|--------|:-----------------:|:------------:|:-----------:|:-----------:|----:|
|AsciiDoc          |`asciidoc`     |`//`|`////` `////`|
|AL                |`al`           |`//`|`/*` `*/`|Compatible|
|Apex              |`apex`         |`//`|`/*` `*/`|**Default**|see [JSDoc](link-jsdoc)
|C                 |`c`            |`//`|`/*` `*/`|~Compatible~|see [Doxygen](link-cdoc) syntax options
|C#                |`cpp`          |`//`|`/*` `*/`|~Compatible~|use their [recommended](link-csharpdoc) syntax instead <!--///-->
|C++               |`csharp`       |`//`|`/*` `*/`|~Compatible~|see [Doxygen](link-cdoc) syntax options
|Dart              |`dart`         |`//`|`/*` `*/`|~Compatible~|use their [recommended](link-dartdoc) syntax instead <!--///-->
|Flax              |`flax`         |`//`|`/*` `*/`|Compatible|
|F#                |`fsharp`       |`//`|`/*` `*/`|~Compatible~|use their [recommended](link-fsharpdoc) syntaxinstead <!--///>
|Go                |`go`           |`//`|`/*` `*/`|~Compatible~|use [Godoc](link-godoc) syntax instead <!--//-->
|Groovy            |`groovy`       |`//`|`/*` `*/`|Compatible|
|Haxe              |`haxe`         |`//`|`/*` `*/`|Compatible|
|Java              |`java`         |`//`|`/*` `*/`|_Supported_|see [Javadoc](link-javadoc)
|JavaScript        |`javascript`   |`//`|`/*` `*/`|**Default**|see [JSDoc](link-jsdoc)
|JavaScript React|`javascriptreact`|`//`|`/*` `*/`|**Default**|see [JSDoc](link-jsdoc)
|JSON with comments|`jsonc`        |`//`|`/*` `*/`|Compatible|
|Kotlin            |`kotlin`       |`//`|`/*` `*/`|_Supported_|see [KDoc](link-kdoc)
|Less              |`less`         |`//`|`/*` `*/`|Compatible|
|Objective-C       |`objective-c`  |`//`|`/*` `*/`|Compatible|
|Objective-C++     |`objective-cpp`|`//`|`/*` `*/`|Compatible|
|Object Pascal     |`objectpascal` |`//`|`/*` `*/`|Compatible|
|Pascal            |`pascal`       |`//`|`/*` `*/`|Compatible|
|PHP               |`php`          |`//`|`/*` `*/`|_supported_|see [PHPDoc](link-phpdoc)
|Rust              |`rust`         |`//`|`/*` `*/`|~Compatible~|use [RustDoc](link-rustdoc) syntax instead <!--///-->
|Sass              |`scala`        |`//`|`/*` `*/`|~Compatible~|use [SassDoc](link-sassdoc) syntax instead <!--///-->
|Scala             |`sass`         |`//`|`/*` `*/`|Compatible|
|SCSS              |`scss`         |`//`|`/*` `*/`|~Compatible~|use [SassDoc](link-sassdoc) syntax instead <!--///-->
|ShaderLab         |`shaderlab`    |`//`|`/*` `*/`|Compatible|
|Stylus            |`stylus`       |`//`|`/*` `*/`|Compatible|
|Swift             |`swift`        |`//`|`/*` `*/`|~Compatible~|use their [recommended](link-swiftdoc) syntax instead
|TypeScript        |`typescript`   |`//`|`/*` `*/`|**Default**|see [JSDoc](link-jsdoc)
|TypeScript React|`typescriptreact`|`//`|`/*` `*/`|**Default**|see [JSDoc](link-jsdoc)
|Verilog           |`verilog`      |`//`|`/*` `*/`|Compatible|
|Vue.js            |`vue`          |`//`|`/*` `*/`|_Supported_|see [JSDoc](link-jsdoc)
|STATA             |`stata`    |`//`,`*`|`/*` `*/`|~Compatible~|use their [recommended](link-statadoc) syntax instead
|SAS               |`SAS`           |`*`|`/*` `*/`|~Compatible~|use their [recommended](link-sasdoc) syntax instead
|CSS               |`css`              ||`/*` `*/`|Compatible|
|Terraform         |`terraform`     |`#`|`/*` `*/`|~Compatible~|use their [recommended](link-terraformdoc) syntax instead
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
|Tcl               |`tcl`           |`#`|           ||First line ignored
|Elixir            |`elixir`        |`#`|`"""` `"""`||First line ignored
|Python            |`python`        |`#`|`"""` `"""`||First line ignored
|PowerShell        |`powershell`    |`#`|`<#` `#>`|
|Nim               |`nim`           |`#`|`#{` `}#`|
|Twig              |`twig`             ||`{#` `#}`|
|HTML              |`html`             ||`<!--` `-->`|
|Markdown          |`markdown`         ||`<!--` `-->`|
|SVG               |`svg`              ||`<!--` `-->`|
|XML               |`xml`              ||`<!--` `-->`|
|ColdFusion        |`cfml`             ||`<!---` `--->`|
|Ada               |`ada`          |`--`|
|HiveQL            |`hive-sql`     |`--`|
|Pig               |`pig`          |`--`|
|PL/SQL            |`plsql`        |`--`|
|SQL               |`sql`          |`--`|
|Lua               |`lua`          |`--`|`--[[` `]]`|
|Elm               |`elm`          |`--`|`{-` `-}`|
|Haskell           |`haskell`      |`--`|`{-` `-}`|
|BrightScript      |`brightscript`  |`'`|
|PlantUML          |`diagram`       |`'`|
|Visual Basic      |`vb`            |`'`|
|Clojure           |`clojure`       |`;`|
|Lisp              |`lisp`          |`;`|
|Racket            |`racket`        |`;`|
|Erlang                       |`erlang`        |`%`|
|LaTex (inlc. Bibtex/Biblatex)|`latex` `bibtex`|`%`|
|MATLAB                       |`matlab`        |`%`|
|Fortran           |`fortran-modern`|`c`|
|COBOL             |`COBOL`        |`*>`|
|GenStat           |`genstat`      |`\\`|`"` `"`|
|Plain text|`plaintext`||||see [configuration](highlight-plain-text)

[link-vscode]: https://code.visualstudio.com/docs/languages/identifiers
[link-decoration-type]: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/vscode/index.d.ts#L1015
[link-decoration-type1]: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/vscode/index.d.ts#L832

[link-cdoc]: https://www.doxygen.nl/manual/docblocks.html
[link-kdoc]: https://kotlinlang.org/docs/reference/kotlin-doc.html
[link-jsdoc]: https://jsdoc.app
[link-godoc]: https://blog.golang.org/godoc
[link-phpdoc]: https://docs.phpdoc.org/latest/references/phpdoc/index.html
[link-fsharp]: https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/xml-documentation
[link-sasdoc]: http://documentation.sas.com/?docsetId=lestmtsglobal&docsetTarget=n1v51exifva71an1cvfn2z6j26lo.htm&docsetVersion=9.4&locale=en
[link-dartdoc]: https://dart.dev/guides/language/effective-dart/documentation
[link-rustdoc]: https://doc.rust-lang.org/stable/rust-by-example/meta/doc.html
[link-javadoc]: https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javadoc.html
[link-sassdoc]: https://github.com/SassDoc/sassdoc
[link-swiftdoc]: https://nshipster.com/swift-documentation/
[link-statadoc]: https://www.stata.com/manuals13/m-2comments.pdf
[link-csharpdoc]: https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/documentation-comments
[link-terraformdoc]: https://www.terraform.io/docs/configuration/syntax.html#comments
