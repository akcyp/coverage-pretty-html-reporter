<template>
  <codemirror
    placeholder="Loading..."
    :model-value="code"
    :disabled="true"
    :style="{ height: '400px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
  />
</template>

<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'
import { StateField, StateEffect } from '@codemirror/state'
import { EditorView, ViewUpdate, Decoration, DecorationSet, gutter, GutterMarker } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { cssTheme } from './cssTheme'

import { CoverageDetail } from '../../shared/report-types'

type CoverageUpdateEvent = Record<'uncoveredStatements' | 'uncoveredBranches' | 'uncoveredFunctions', {
  start: number;
  end: number;
}[]>;

const props = defineProps<{
  code: string;
  coverage: CoverageDetail;
}>()

const codeLines = props.code.split('\n');
const locationToRange = (loc: {
  line: number;
  column: number;
}) => {
  return codeLines.slice(0, loc.line - 1).map(({ length }) => length + 1).reduce((a, b) => a + b, 0) + loc.column
}

const uncoveredStatementMark = Decoration.mark({ class: "cm-uncovered-statement" })
const uncoveredBranchMark = Decoration.mark({ class: "cm-uncovered-branch" })
const uncoveredFunctionMark = Decoration.mark({ class: "cm-uncovered-function" })
const uncoveredTheme = EditorView.baseTheme({
  ".cm-uncovered-statement, .cm-uncovered-statement .cm-uncovered-branch": { background: 'var(--cm-uncovered-statement)' },
  ".cm-uncovered-branch": { background: 'var(--cm-uncovered-branch)' },
  ".cm-uncovered-function": { background: 'var(--cm-uncovered-function)' },
  ".cm-gutterElement > .not-covered": {
    background: 'var(--cm-uncovered)',
    padding: '0 2px',
  },
  ".cm-gutterElement > .covered": {
    background: 'var(--cm-covered)',
    padding: '0 2px',
  },
})
const setCoverage = StateEffect.define<CoverageUpdateEvent>();
const uncoveredField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none
  },
  update(underlines, tr) {
    underlines = underlines.map(tr.changes)
    for (let e of tr.effects) {
      if (!e.is(setCoverage)) continue;
      underlines = Decoration.set([
        ...e.value.uncoveredStatements.map(({ start, end }) => uncoveredStatementMark.range(start, end)),
        ...e.value.uncoveredBranches.map(({ start, end }) => uncoveredBranchMark.range(start, end)),
        ...e.value.uncoveredFunctions.map(({ start, end }) => uncoveredFunctionMark.range(start, end)),
      ].sort((a, b) => a.from - b.from))
    }
    return underlines
  },
  provide: f => EditorView.decorations.from(f)
})

class HitsMarker extends GutterMarker {
  constructor(private hits: number) {
    super()
  }
  toDOM() {
    const node = document.createElement('div')
    node.appendChild(document.createTextNode(`${this.hits}x`))
    node.classList.add(this.hits > 0 ? 'covered' : 'not-covered')
    return node
  }
}

const hitsLineGutter = gutter({
  lineMarker(_, line) {
    if (line.from === line.to || !view.value) return null
    const lineNumber = view.value.state.doc.lineAt(line.from).number
    const hits = props.coverage.lines[lineNumber]
    if (hits === undefined) return null
    return new HitsMarker(hits)
  },
  initialSpacer: () => new HitsMarker(0),
  lineMarkerChange: () => true,
})

hitsLineGutter

const extensions = [
  javascript(),
  hitsLineGutter,
  cssTheme,
  uncoveredTheme,
  uncoveredField,
]

// Codemirror EditorView instance ref
const view = shallowRef<EditorView>()
const updateCoverage = (value: CoverageDetail) => {
  const uncoveredStatements = Object.entries(value.s)
    .filter(([_, count]) => count === 0)
    .map(([id]) => value.statementMap[id])
    .map(({ start, end }) => ({
      start: locationToRange(start),
      end: locationToRange(end),
    }))

  const uncoveredBranches = Object.entries(value.b).map(([key, branches]) => {
    return Object.entries(branches).filter(([_, count]) => count === 0).map(([id]) => value.branchMap[key].locations[+id]).map(({ start, end }) => ({
      start: locationToRange(start),
      end: locationToRange(end),
    }))
  }).flat(1)

  const uncoveredFunctions = Object.entries(value.f)
    .filter(([_, count]) => count === 0)
    .map(([id]) => value.fnMap[id].decl)
    .map(({ start, end }) => ({
      start: locationToRange(start),
      end: locationToRange(end),
    }))

  view.value?.dispatch({
    effects: setCoverage.of({
      uncoveredStatements,
      uncoveredBranches,
      uncoveredFunctions,
    }),
  })
}

watch(() => props.coverage, (value) => {
  updateCoverage(value)
});

const handleReady = (payload: Pick<ViewUpdate, 'view' | 'state'>) => {
  view.value = payload.view
  updateCoverage(props.coverage)
  console.log(view.value)
};
</script>
