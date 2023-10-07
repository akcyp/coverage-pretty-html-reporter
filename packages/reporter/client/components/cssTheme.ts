import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

const theme = EditorView.theme({
  "&": {
    backgroundColor: "var(--cm-background)",
    color: "var(--cm-foreground)",
  },
  ".cm-content": {
    caretColor: "var(--cm-cursor)",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--cm-cursor)",
  },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "var(--cm-selection-background)",
  },
  ".cm-activeLine": {
    backgroundColor: "transparent",
  },
  ".cm-selectionMatch": {
    backgroundColor: "transparent",
  },
  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    textDecoration: "underline",
  },
  ".cm-gutters": {
    background: "var(--cm-line-number-gutter)",
    color: "var(--cm-line-number)",
    border: "none",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--cm-line-number-gutter)",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd",
  },
});

const highlightStyle = HighlightStyle.define([
  { tag: [t.meta, t.comment], color: "var(--cm-comment)" },
  { tag: t.string, color: "var(--cm-string)" },
  { tag: t.literal, color: "var(--cm-literal)" },
  { tag: t.keyword, color: "var(--cm-keyword)" },
  { tag: [t.atom, t.bool], color: "var(--cm-boolean)" },
  { tag: t.number, color: "var(--cm-number)" },
  { tag: t.variableName, color: "var(--cm-variable)" },
  { tag: t.function(t.variableName), color: "var(--cm-function)" },
  { tag: t.deleted, color: "var(--cm-deleted)" },
  { tag: t.className, color: "var(--cm-class)" },
  // { tag: t.builtin, color: 'var(--cm-builtin)'},
  { tag: t.propertyName, color: "var(--cm-property)" },
  { tag: t.namespace, color: "var(--cm-namespace)" },
  { tag: [t.punctuation, t.separator], color: "var(--cm-punctuation)" },
  { tag: [t.definition(t.name)], color: "var(--cm-decorator)" },
  { tag: t.regexp, color: "var(--cm-regex)" },
  { tag: t.attributeName, color: "var(--cm-attribute) " },
  { tag: t.invalid, color: "var(--cm-error)" },
  { tag: [t.operator, t.operatorKeyword, t.special(t.string)], color: "var(--cm-punctation)" },
  { tag: [t.typeName, t.className, t.changed, t.annotation, t.modifier, t.self], color: "var(--cm-number)" },
]);

export const cssTheme: Extension = [theme, syntaxHighlighting(highlightStyle)];
