import { type Context, ReportBase, type ReportBaseOptions, type ReportNode } from "istanbul-lib-report";

import { type CoverageSummary } from "istanbul-lib-coverage";

declare module "istanbul-lib-report" {
  export interface FileWriter {
    /** @deprecated */
    writeForDir(subdir: string): FileWriter;
    writerForDir(subdir: string): FileWriter;
  }
  export interface ReportNode {
    getCoverageSummary(): CoverageSummary;
  }
}

module.exports = class NextHTMLReport extends ReportBase {
  constructor(private options: ReportBaseOptions & { subdir?: string }) {
    super(options);
  }

  getWriter(context: Context) {
    if (!this.options.subdir) {
      return context.writer;
    }
    return context.writer.writerForDir(this.options.subdir);
  }

  execute(context: Context) {
    super.execute(context);
  }

  /**
   * Runs on root node
   */
  onStart(root: ReportNode, context: Context) {
    const writer = this.getWriter(context);
    // Copy static files
    // writer.copyFile()
  }

  /**
   * Runs on every directory
   */
  onSummary(node: ReportNode, context: Context) {
    // TODO: implement
    const children = node.getChildren();
    children.forEach((node) => {
      const child = node as ReportNode;
      const metrics = child.getCoverageSummary();
      const isEmpty = metrics.isEmpty();
      const statements = context.classForPercent("statements", metrics.statements.pct);
      const lines = context.classForPercent("lines", metrics.lines.pct);
      const functions = context.classForPercent("functions", metrics.functions.pct);
      const branches = context.classForPercent("branches", metrics.branches.pct);
      console.log({
        file: child.getRelativeName(),
        metrics,
        isEmpty,
        stats: {
          statements,
          lines,
          functions,
          branches,
        },
      });
    });
  }

  /**
   * Runs on every file
   */
  onDetail(node: ReportNode, context: Context) {
    const summary = node.getCoverageSummary();
    const templateData = {
      entity: node.getQualifiedName() || "All files",
      metrics: summary,
      reportClass: context.classForPercent("statements", summary.statements.pct),
    };
    const cov = node.getFileCoverage(); // annottate
    console.log(templateData, cov);
  }
};
