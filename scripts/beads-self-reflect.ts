#!/usr/bin/env npx tsx
/**
 * BEADS Self-Reflect Script
 *
 * Generates knowledge base statistics and weekly reports.
 * For AI-powered PR analysis, use the Claude Code skill: /self-reflect
 *
 * Usage:
 *   npx tsx scripts/beads-self-reflect.ts
 *   npx tsx scripts/beads-self-reflect.ts --days 14
 *   npx tsx scripts/beads-self-reflect.ts --no-slack
 *
 * Can also be run via: bd self-reflect
 *
 * NOTE: This is a template script. You will need to implement or import
 * your own knowledge capture service and weekly report service.
 * The imports below are placeholders - replace with your actual service paths.
 */

import { parseArgs } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

// =============================================================================
// CLI Arguments
// =============================================================================

const { values: args } = parseArgs({
  options: {
    days: { type: 'string', default: '7' },
    'no-slack': { type: 'boolean', default: false },
    verbose: { type: 'boolean', short: 'v', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (args.help) {
  console.log(`
BEADS Self-Reflect - Knowledge base statistics and weekly report

Usage:
  npx tsx scripts/beads-self-reflect.ts [options]

Options:
  --days <n>      Number of days for report period (default: 7)
  --no-slack      Skip posting to Slack
  -v, --verbose   Show detailed output
  -h, --help      Show this help message

For AI-powered PR analysis:
  1. Run: npx tsx scripts/beads-fetch-pr-comments.ts
  2. Then use Claude Code: /self-reflect

Environment Variables:
  SLACK_BOT_TOKEN           Slack bot token for posting
  SLACK_CHANNEL_AGENTS      Slack channel for reports (default: #dev-agents)
`);
  process.exit(0);
}

// =============================================================================
// Configuration
// =============================================================================

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL_AGENTS || '#dev-agents';

const DAYS = parseInt(args.days || '7', 10);
const NO_SLACK = args['no-slack'] || false;
const VERBOSE = args.verbose || false;

// =============================================================================
// Slack Integration
// =============================================================================

async function postToSlack(message: string, blocks?: unknown[]): Promise<void> {
  if (!SLACK_BOT_TOKEN) {
    console.log('No SLACK_BOT_TOKEN set, skipping Slack post');
    return;
  }

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        text: message,
        blocks,
        unfurl_links: false,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('Slack API error:', data.error);
    }
  } catch (error) {
    console.error('Failed to post to Slack:', error);
  }
}

function formatSlackBlocks(knowledgeStats: {
  total: number;
  byType: Record<string, number>;
  recentlyAdded: number;
}): unknown[] {
  return [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'BEADS Knowledge Base Report',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Period*: Last ${DAYS} days\n*Generated*: ${new Date().toISOString()}`,
      },
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          `*Knowledge Base Status*\n` +
          `Total facts: ${knowledgeStats.total}\n` +
          `Added recently: ${knowledgeStats.recentlyAdded}\n` +
          `By type: ${Object.entries(knowledgeStats.byType)
            .map(([t, c]) => `${t} (${c})`)
            .join(', ')}`,
      },
    },
    { type: 'divider' },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '_For AI analysis of PR comments, use `/self-reflect` in Claude Code_',
        },
      ],
    },
  ];
}

// =============================================================================
// Knowledge Service Implementation
// =============================================================================

interface KnowledgeStats {
  total: number;
  recentlyAdded: number;
  stale: number;
  byType: Record<string, number>;
  byConfidence: Record<string, number>;
}

async function getKnowledgeStats(): Promise<KnowledgeStats> {
  const stats: KnowledgeStats = {
    total: 0,
    recentlyAdded: 0,
    stale: 0,
    byType: {},
    byConfidence: {},
  };

  const knowledgeDir = path.join(process.cwd(), '.metaswarm/knowledge');

  try {
    const files = await fs.readdir(knowledgeDir);
    const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    for (const file of jsonlFiles) {
      const filePath = path.join(knowledgeDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');

      for (const line of lines) {
        if (!line.trim() || line.startsWith('#')) continue;

        try {
          const fact = JSON.parse(line);
          stats.total++;

          if (fact.type) {
            stats.byType[fact.type] = (stats.byType[fact.type] || 0) + 1;
          }

          if (fact.confidence) {
            stats.byConfidence[fact.confidence] = (stats.byConfidence[fact.confidence] || 0) + 1;
          }

          if (fact.createdAt) {
            const createdAt = new Date(fact.createdAt);
            if (createdAt >= thirtyDaysAgo) {
              stats.recentlyAdded++;
            }
          }

          if (fact.updatedAt) {
            const updatedAt = new Date(fact.updatedAt);
            if (
              updatedAt <= ninetyDaysAgo &&
              (fact.usageCount === undefined || fact.usageCount === 0)
            ) {
              stats.stale++;
            }
          }
        } catch (e) {
          // Ignore parse errors for individual lines
        }
      }
    }
  } catch (error) {
    console.error('Failed to read knowledge base:', error);
  }

  return stats;
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  console.log('\n=== BEADS Self-Reflect ===\n');
  console.log(`Report period: ${DAYS} days`);
  console.log(`Skip Slack: ${NO_SLACK}`);
  console.log('');

  // -------------------------------------------------------------------------
  // Step 1: Get knowledge base statistics
  // -------------------------------------------------------------------------
  console.log('Step 1: Analyzing knowledge base...\n');

  const stats = await getKnowledgeStats();

  console.log('Knowledge Base Statistics:');
  console.log(`  Total facts: ${stats.total}`);
  console.log(`  Recently added (30 days): ${stats.recentlyAdded}`);
  console.log(`  Stale (90 days, unused): ${stats.stale}`);
  console.log('');
  console.log('  By type:');
  for (const [type, count] of Object.entries(stats.byType)) {
    console.log(`    ${type}: ${count}`);
  }
  console.log('');
  console.log('  By confidence:');
  for (const [level, count] of Object.entries(stats.byConfidence)) {
    console.log(`    ${level}: ${count}`);
  }
  console.log('');

  // -------------------------------------------------------------------------
  // Step 2: Generate weekly report
  // -------------------------------------------------------------------------
  console.log('Step 2: Generating weekly report...\n');

  // TODO: Replace with your own weekly report service implementation
  if (VERBOSE) {
    console.log('--- Weekly Report ---\n');
    console.log('(No report service configured yet)');
    console.log('--- End Report ---\n');
  }

  // -------------------------------------------------------------------------
  // Step 3: Post to Slack
  // -------------------------------------------------------------------------
  if (!NO_SLACK) {
    console.log('Step 3: Posting summary to Slack...\n');

    const blocks = formatSlackBlocks(stats);
    await postToSlack('Weekly knowledge base report', blocks);
    console.log(`Posted to ${SLACK_CHANNEL}\n`);
  } else {
    console.log('Step 3: Skipping Slack post\n');
  }

  // -------------------------------------------------------------------------
  // Done
  // -------------------------------------------------------------------------
  console.log('=== Report Complete ===\n');
  console.log('To extract learnings from PR comments:');
  console.log('  1. Run: npx tsx scripts/beads-fetch-pr-comments.ts');
  console.log('  2. Use Claude Code: /self-reflect');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
