<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Report, FileReport, DirectoryReport } from "../../shared/report-types";

const props = defineProps<{
  reports: Report[];
  currentPath: string;
}>();

const emit = defineEmits<{
  (e: "select-file", report: FileReport): void;
  (e: "select-directory-stats", report: DirectoryReport): void;
}>();

interface TreeNodeData {
  type: "file" | "directory";
  report: FileReport | DirectoryReport;
}

interface TreeNode {
  key: string;
  label: string;
  data?: TreeNodeData;
  children?: TreeNode[];
  leaf?: boolean;
}

const buildTree = (reports: Report[]): TreeNode[] => {
  const rootMap = new Map<string, any>();

  const ensureNode = (segments: string[]): any => {
    let map = rootMap;
    let currentPath = "";
    let node: any;

    segments.forEach((segment) => {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      let entry = map.get(segment);
      if (!entry) {
        entry = {
          key: currentPath,
          label: segment,
          childrenMap: new Map<string, any>(),
        };
        map.set(segment, entry);
      }
      node = entry;
      map = entry.childrenMap;
    });

    return node;
  };

  for (const report of reports) {
    const entity = report.entity || "";
    if (!entity) continue;
    const segments = entity.split("/");
    const node = ensureNode(segments);
    node.data = {
      type: report.type,
      report,
    } as TreeNodeData;
  }

  const mapToNodes = (map: Map<string, any>): TreeNode[] => {
    const nodes: TreeNode[] = [];
    for (const [, value] of map) {
      const children = mapToNodes(value.childrenMap);
      const data = value.data as TreeNodeData | undefined;
      const hasChildren = children.length > 0;
      nodes.push({
        key: value.key,
        label: value.label,
        data,
        children: hasChildren ? children : undefined,
        leaf: !hasChildren,
      });
    }
    return nodes.sort((a, b) => a.label.localeCompare(b.label));
  };

  return mapToNodes(rootMap);
};

const treeNodes = computed(() => buildTree(props.reports));

const selectionKeys = ref<Record<string, boolean>>({});
const expandedKeys = ref<Record<string, boolean>>({});

watch(
  () => props.currentPath,
  (path) => {
    const key = path || "";
    selectionKeys.value = key ? { [key]: true } : {};
  },
  { immediate: true },
);

watch(
  treeNodes,
  (nodes) => {
    const keys: Record<string, boolean> = {};
    const collect = (items: TreeNode[]) => {
      for (const item of items) {
        if (item.children && item.children.length) {
          keys[item.key] = true;
          collect(item.children);
        }
      }
    };
    collect(nodes);
    expandedKeys.value = keys;
  },
  { immediate: true },
);

const handleRowClick = (node: TreeNode) => {
  const data = node.data as TreeNodeData | undefined;
  if (!data) return;

  // update selection highlight
  selectionKeys.value = { [node.key]: true };

  const report = data.report;
  if (report.type === "file") {
    emit("select-file", report as FileReport);
  } else if (report.type === "directory") {
    // toggle expand/collapse when clicking on folder label
    expandedKeys.value = {
      ...expandedKeys.value,
      [node.key]: !expandedKeys.value[node.key],
    };
  }
};

const handleStatsClick = (node: TreeNode, event: MouseEvent) => {
  event.stopPropagation();
  const data = node.data as TreeNodeData | undefined;
  if (!data) return;
  if (data.report.type !== "directory") return;
  emit("select-directory-stats", data.report as DirectoryReport);
};
</script>

<template>
  <div class="file-tree">
    <div class="file-tree-header">All files</div>
    <Tree
      :value="treeNodes"
      selectionMode="single"
      :selectionKeys="selectionKeys"
      v-model:expandedKeys="expandedKeys"
    >
      <template #default="{ node }">
        <span class="file-tree-node" @click="handleRowClick(node)">
          <span class="file-tree-node__icon">
            <i
              v-if="node.children && node.children.length"
              class="codicon"
              :class="node.expanded ? 'codicon-folder-opened' : 'codicon-folder'"
            ></i>
            <i
              v-else
              class="codicon codicon-symbol-file"
            ></i>
          </span>
          <span class="file-tree-node__label">{{ node.label }}</span>
          <span
            v-if="node.children && node.children.length"
            class="file-tree-node__action"
            title="See stats"
            @click="handleStatsClick(node, $event)"
          >
            <span class="codicon codicon-graph"></span>
          </span>
        </span>
      </template>
    </Tree>
  </div>
</template>

<style>
.file-tree {
  height: 100%;
  padding: 8px 4px;
  background-color: #191919;
  color: #8b888f;
  font-size: 13px;
  font-weight: 400;
  user-select: none;
}

.file-tree-header {
  line-height: 22px;
  color: #69676c;
  background-color: #191919;
  height: 22px;
  font-size: 11px;
  font-weight: 700;
  overflow: hidden;
}

.p-tree {
  border: none;
  background-color: transparent;
  color: inherit;
}

.p-tree-container {
  padding: 0;
}

.p-treenode-children {
  padding-left: 12px;
}

.p-treenode-leaf > .p-treenode-content .p-tree-toggler {
  visibility: hidden;
}

.p-treenode-label {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  flex: 1;
}

.p-treenode-content {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 2px;
  padding: 0 2px;
  height: 22px;
  line-height: 22px;
  user-select: none;
}

.p-treenode-content.p-highlight {
  color: #fce566;
  background-color: #bab6c00d;
}

.p-treenode-content:hover {
  background-color: #bab6c00d;
  color: #f7f1ff;
  cursor: pointer;
}

.p-tree-toggler {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #c5c5c5;
  padding: 0 2px;
  margin: 0 2px 0 0;
  font-size: 14px;
  width: 18px;
  height: 22px;
  min-width: 0;
  border: none;
  background: transparent;
}

.file-tree-node {
  display: flex;
  align-items: center;
  flex: 1;
   height: 22px;
  overflow: hidden;
}

.file-tree-node__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  color: #c5c5c5;
}

.file-tree-node__label {
  padding-left: 2px;
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-tree-node__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  opacity: 0;
  color: #c5c5c5;
  cursor: pointer;
}

.p-treenode-content:hover .file-tree-node__action {
  opacity: 0.85;
}

.file-tree-node__action:hover {
  opacity: 1;
  color: #fce566;
}
</style>
