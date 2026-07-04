import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter'

const MS_PER_SECOND = 1000

// oxlint-disable-next-line import/no-default-export
export default class SummaryReporter implements Reporter {
  private passed = 0
  private failed = 0
  private skipped = 0

  public onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed') this.passed += 1
    else if (result.status === 'skipped') this.skipped += 1
    else {
      this.failed += 1
      const name = test.titlePath().slice(1).join(' > ')
      const message = result.errors[0]?.message ?? 'unknown error'
      process.stderr.write(`\n  ✗ ${name}\n    ${message.split('\n')[0]}\n`)
    }
  }

  public onEnd(result: FullResult) {
    const duration = (result.duration / MS_PER_SECOND).toFixed(1)
    const parts = [`${this.passed} passed`]
    if (this.failed > 0) parts.push(`${this.failed} failed`)
    if (this.skipped > 0) parts.push(`${this.skipped} skipped`)
    process.stdout.write(`\n  ${parts.join(', ')} (${duration}s)\n`)
  }
}
