<template>
  <vue-monaco-editor
    :value="code"
    language="javascript"
    :theme="monacoTheme"
    :options="editorOptions"
    width="100%"
    height="100%"
    @mount="handleMount"
  >
    Loading...
  </vue-monaco-editor>
</template>

<script setup lang="ts">
import type * as Monaco from "monaco-editor";
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import type { BlockRange, CoverageDetail } from "../../shared/report-types";

const props = defineProps<{
  code: string;
  coverage: CoverageDetail;
}>();

const editorInstance = shallowRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
const monacoInstance = shallowRef<typeof Monaco | null>(null);
const coverageDecorationIds = shallowRef<string[]>([]);
const monacoTheme = ref("vs-dark");
let themeListener: ((event: Event) => void) | null = null;

const editorOptions = {
  readOnly: true,
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  glyphMargin: false,
  // Extra width so line number + hit count fit cleanly
  lineNumbersMinChars: 7,
  lineNumbers: (line: number) => {
    const hits = props.coverage.lines[line] ?? 0;
    const lineLabel = String(line).padStart(3, " ");
    const hitsLabel = `  ${hits}x`;
    return `${lineLabel}${hitsLabel}`;
  },
} as const;

const toMonacoRange = (range: BlockRange) => {
  if (!monacoInstance.value) return null;
  const monaco = monacoInstance.value;
  return new monaco.Range(range.start.line, range.start.column + 1, range.end.line, range.end.column + 1);
};

const applyCoverage = (coverage: CoverageDetail) => {
  if (!editorInstance.value || !monacoInstance.value) return;
  const monaco = monacoInstance.value;

  const decorations: Monaco.editor.IModelDeltaDecoration[] = [];

  // Uncovered statements
  for (const [id, count] of Object.entries(coverage.s)) {
    if (count !== 0) continue;
    const range = toMonacoRange(coverage.statementMap[id]);
    if (!range) continue;
    decorations.push({
      range,
      options: {
        inlineClassName: "cov-uncovered-statement",
      },
    });
  }

  // Uncovered branches
  for (const [branchKey, branches] of Object.entries(coverage.b)) {
    const branchInfo = coverage.branchMap[branchKey];
    branches.forEach((hits, index) => {
      if (hits !== 0) return;
      const branchRange = branchInfo.locations[index];
      const range = toMonacoRange(branchRange);
      if (!range) return;
      decorations.push({
        range,
        options: {
          inlineClassName: "cov-uncovered-branch",
        },
      });
    });
  }

  // Uncovered functions
  for (const [id, count] of Object.entries(coverage.f)) {
    if (count !== 0) continue;
    const range = toMonacoRange(coverage.fnMap[id].decl);
    if (!range) continue;
    decorations.push({
      range,
      options: {
        inlineClassName: "cov-uncovered-function",
      },
    });
  }

  // Line coverage (for gutter color bar)
  for (const [lineKey, hits] of Object.entries(coverage.lines)) {
    const lineNumber = Number(lineKey);
    const range = new monaco.Range(lineNumber, 1, lineNumber, 1);
    decorations.push({
      range,
      options: {
        isWholeLine: false,
        linesDecorationsClassName: hits > 0 ? "cov-gutter-covered" : "cov-gutter-uncovered",
      },
    });
  }

  coverageDecorationIds.value = editorInstance.value.deltaDecorations(coverageDecorationIds.value, decorations);
};

watch(
  () => props.coverage,
  (value) => {
    applyCoverage(value);
  },
  { deep: true },
);

const handleMount = (editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) => {
  editorInstance.value = editor;
  monacoInstance.value = monaco;

  // Disable Monaco's JS/TS diagnostics (type checker & suggestions)
  if (monaco.languages?.typescript) {
    const { javascriptDefaults, typescriptDefaults } = monaco.languages.typescript;
    javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });
    typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });
  }

  applyCoverage(props.coverage);
};

onMounted(() => {
  // Set initial Monaco theme based on current document theme
  const isDark = document.documentElement.classList.contains("dark");
  monacoTheme.value = isDark ? "vs-dark" : "vs";

  themeListener = (event: Event) => {
    const detail = (event as CustomEvent).detail;
    if (detail === "light" || detail === "dark") {
      monacoTheme.value = detail === "dark" ? "vs-dark" : "vs";
    }
  };
  window.addEventListener("coverage-theme-changed", themeListener);
});

onBeforeUnmount(() => {
  if (themeListener) {
    window.removeEventListener("coverage-theme-changed", themeListener);
    themeListener = null;
  }
});
</script>

<style>
.monaco-editor .cov-uncovered-branch {
  background: var(--cm-uncovered-branch);
}

.monaco-editor .cov-uncovered-statement,
.monaco-editor .cov-uncovered-statement .cov-uncovered-branch {
  background: var(--cm-uncovered-statement);
}

.monaco-editor .margin .cov-gutter-uncovered {
  border-left: 4px solid var(--cm-uncovered);
}

.monaco-editor .margin .cov-gutter-covered {
  border-left: 4px solid var(--cm-covered);
}
</style>
