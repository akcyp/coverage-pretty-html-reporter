import { CoverageSummary } from "istanbul-lib-coverage";

declare module "istanbul-lib-report" {
  export interface FileWriter {
    /** @deprecated */
    writeForDir(subdir: string): FileWriter;
    writerForDir(subdir: string): FileWriter;
  }
  export interface ReportNode {
    getCoverageSummary(): CoverageSummary;
  }
  export interface ReportBase {
    /**
     * Runs on root node
     */
    onStart(root: ReportNode, context: Context): void;
    /**
     * Runs on every directory
     */
    onSummary(node: ReportNode, context: Context): void;
    /**
     * Runs on every file
     */
    onDetail(node: ReportNode, context: Context): void;
    /**
     * Runs on finish
     */
    onEnd(root: ReportNode, context: Context): void;
  }
}
