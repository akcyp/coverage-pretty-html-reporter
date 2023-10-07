import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { CoverageSummary } from "istanbul-lib-coverage";
import { ReportBase } from "istanbul-lib-report";
import { compress } from "lz-string";

import type { Context, FileContentWriter, ReportBaseOptions, ReportNode } from "istanbul-lib-report";
import type { DirectoryReport, FileReport, Report, SummaryStats } from "../shared/report-types";
export type * from "../shared/report-types";

function* walkDir(dir: string) {
  for (const dirent of readdirSync(dir)) {
    const entry = join(dir, dirent);
    const d = statSync(entry);
    if (d.isDirectory()) yield* walkDir(entry);
    else if (d.isFile()) yield entry;
  }
}

export class NextHTMLReport extends ReportBase {
  private reports: Report[] = [];

  private getStats(summary: CoverageSummary, context: Context) {
    const metricNames = ["statements", "branches", "lines", "functions"] as const;
    return Object.fromEntries(
      metricNames.map((key) => {
        const { total, covered, pct } = summary[key];
        return [
          key,
          {
            total,
            covered,
            pct,
            class: context.classForPercent(key, pct),
          },
        ];
      }),
    ) as SummaryStats;
  }

  private getWriter(context: Context) {
    if (!this.options.subdir) {
      return context.writer;
    }
    return context.getWriter().writerForDir(this.options.subdir);
  }

  private reset() {
    this.reports = [];
  }

  constructor(private options: ReportBaseOptions & { subdir?: string }) {
    super(options);
  }

  override onStart(root: ReportNode, context: Context) {
    this.reset();
    const dist = join(__dirname, "../dist/client");
    const writer = this.getWriter(context);
    const staticFiles = [...walkDir(dist)];

    // Copy static files
    staticFiles.forEach((source) => {
      writer.copyFile(source, relative(dist, source));
    });
  }

  override onSummary(node: ReportNode, context: Context) {
    const report: DirectoryReport = {
      unix: Date.now(),
      type: "directory",
      root: node.isRoot(),
      name: node.getRelativeName(),
      entity: node.getQualifiedName(),
      stats: this.getStats(node.getCoverageSummary(), context),
      childStats: node.getChildren().map((child) => ({
        name: (child as ReportNode).getRelativeName(),
        entity: (child as ReportNode).getQualifiedName(),
        stats: this.getStats((child as ReportNode).getCoverageSummary(), context),
      })),
    };
    this.reports.push(report);
  }

  override onDetail(node: ReportNode, context: Context) {
    const cov = node.getFileCoverage();
    const { path, b, f, s, branchMap, fnMap, statementMap } = cov;
    const report: FileReport = {
      unix: Date.now(),
      type: "file",
      name: node.getRelativeName(),
      entity: node.getQualifiedName(),
      stats: this.getStats(cov.toSummary(), context),
      path,
      detail: {
        b,
        f,
        s,
        branchMap,
        fnMap,
        statementMap,
        lines: cov.getLineCoverage(),
      },
      fileContent: compress(readFileSync(path, "utf-8")),
    };
    this.reports.push(report);
  }

  override onEnd(root: ReportNode, context: Context) {
    // write
    const writer = this.getWriter(context);
    const statsStream = writer.writeFile("loadcov.js") as FileContentWriter;
    statsStream.write(`window.reports=${JSON.stringify(this.reports)}`);
    statsStream.close();
    this.reset();
  }
}

module.exports = NextHTMLReport;
