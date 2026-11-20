import { indentLess, defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { indentOnInput, indentUnit, StreamLanguage, syntaxHighlighting } from '@codemirror/language';
import { classHighlighter, tags } from '@lezer/highlight';
import { Compartment, EditorState } from '@codemirror/state';
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from '@codemirror/view';

const languages = {
  javascript: () => javascript({ jsx: true, typescript: true }),
  python,
  java,
  sql: () => sqlLanguage,
};

const sqlKeywords = new Set('all alter and any array as asc begin between by cascade case cast check coalesce column commit constraint create cross current_date current_timestamp database date default delete desc distinct drop else end exists explain extract false fetch filter for foreign from full function group having if in index inner insert intersect interval into is join jsonb key left like limit merge not null nulls offset on or order outer over partition primary references recursive returning right rollback row row_number select sequence table then ties transaction true truncate union unique update using values varchar view when where window with'.split(' '));
const sqlTypes = new Set('bigint bigserial boolean bytea char character date decimal double enum float integer interval json jsonb numeric real serial smallint text time timestamp timestamptz uuid varchar'.split(' '));
const sqlFunctions = new Set('avg count date_part date_trunc dense_rank lag lead lower max min now rank row_number round string_agg sum upper'.split(' '));
const sqlMode = StreamLanguage.define({
  name: 'postgresql-sql',
  startState: () => ({ blockComment: false }),
  token(stream, state) {
    if (state.blockComment) {
      if (stream.match(/^.*?\*\//)) state.blockComment = false;
      else stream.skipToEnd();
      return 'comment';
    }
    if (stream.eatSpace()) return null;
    if (stream.match(/^--.*/)) return 'comment';
    if (stream.match(/^\/\*/)) {
      state.blockComment = true;
      return 'comment';
    }
    if (stream.match(/^'(?:[^']|'')*(?:'|$)/)) return 'string';
    if (stream.match(/^"(?:[^"]|"")*(?:"|$)/)) return 'propertyName';
    if (stream.match(/^(?:\$\d+|\$\$)/)) return 'variableName';
    if (stream.match(/^(?:\d+(?:\.\d+)?|\.\d+)/)) return 'number';
    if (stream.match(/^[A-Za-z_][\w$]*/)) {
      const word = stream.current().toLowerCase();
      if (sqlFunctions.has(word)) return 'function';
      if (sqlTypes.has(word)) return 'typeName';
      if (sqlKeywords.has(word)) return 'keyword';
      return 'variableName';
    }
    if (stream.match(/^(?:<=|>=|<>|!=|::|\|\||->>|->|#>>|#>|:=|[-+*/%=<>])/)) return 'operator';
    stream.next();
    return null;
  },
  tokenTable: {
    comment: tags.comment,
    function: tags.function(tags.variableName),
    keyword: tags.keyword,
    number: tags.number,
    operator: tags.operator,
    propertyName: tags.propertyName,
    string: tags.string,
    typeName: tags.typeName,
    variableName: tags.variableName,
  },
});
const sqlLanguage = sqlMode;

export function createCodeEditor({ parent, source, onEscape }) {
  const language = languages[source.dataset.language] ?? (() => []);
  const editability = new Compartment();
  const view = new EditorView({
    state: EditorState.create({
      doc: source.value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        drawSelection(),
        indentOnInput(),
        indentUnit.of('    '),
        EditorState.tabSize.of(4),
        EditorState.changeFilter.of((transaction) => (
          !transaction.docChanged || transaction.newDoc.length <= source.maxLength
        )),
        language(),
        syntaxHighlighting(classHighlighter),
        history(),
        editability.of(EditorView.editable.of(true)),
        EditorView.contentAttributes.of({
          'aria-label': source.getAttribute('aria-label') || '코드 편집기',
          'aria-describedby': source.getAttribute('aria-describedby') || '',
          autocapitalize: 'off',
          autocomplete: 'off',
          autocorrect: 'off',
          spellcheck: 'false',
        }),
        keymap.of([
          {
            key: 'Escape',
            run: () => {
              onEscape?.();
              return true;
            },
          },
          { key: 'Shift-Tab', run: indentLess },
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;
          source.value = update.state.doc.toString();
          source.dispatchEvent(new Event('input', { bubbles: true }));
        }),
      ],
    }),
    parent,
  });

  return {
    view,
    setEditable(editable) {
      view.dispatch({ effects: editability.reconfigure(EditorView.editable.of(editable)) });
    },
    destroy() {
      view.destroy();
    },
  };
}
