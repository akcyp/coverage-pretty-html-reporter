<template>
  <vue-monaco-editor
    :value="code"
    language="javascript"
    theme="vs-dark"
    :options="editorOptions"
    width="100%"
    height="100%"
    @mount="handleMount"
  >
    Loading...
  </vue-monaco-editor>
</template>

<script setup lang="ts">
import { shallowRef, watch } from "vue";

import type { CoverageDetail, BlockRange } from "../../shared/report-types";

const props = defineProps<{
  code: string;
  coverage: CoverageDetail;
}>();

const editorInstance = shallowRef<any | null>(null);
const monacoInstance = shallowRef<any | null>(null);
const coverageDecorationIds = shallowRef<string[]>([]);

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
  return new monaco.Range(
    range.start.line,
    range.start.column + 1,
    range.end.line,
    range.end.column + 1,
  );
};

const applyCoverage = (coverage: CoverageDetail) => {
  if (!editorInstance.value || !monacoInstance.value) return;
  const monaco = monacoInstance.value;

  const decorations: any[] = [];

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
        linesDecorationsClassName:
          hits > 0 ? "cov-gutter-covered" : "cov-gutter-uncovered",
      },
    });
  }

  coverageDecorationIds.value = editorInstance.value.deltaDecorations(
    coverageDecorationIds.value,
    decorations,
  );
};

watch(
  () => props.coverage,
  (value) => {
    applyCoverage(value);
  },
  { deep: true },
);

const handleMount = (editor: any, monaco: any) => {
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
