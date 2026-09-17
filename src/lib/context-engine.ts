export type UserContext = {
  intent: string;
  role: string;
  priorities: string[];
  concern: string;
};

export type Clause = {
  id: string;
  category: string;
  title: string;
  section: string;
  page: number;
  sourceText: string;
  plainEnglish: string;
  whyItMatters: string;
  questions: string[];
};

export type AttentionLevel = 'high' | 'medium' | 'low';

export type AnalyzedClause = Clause & {
  attention: AttentionLevel;
  attentionReason: string;
};

export function analyzeDocumentContext(context: UserContext, clauses: Clause[]): AnalyzedClause[] {
  return clauses.map((clause) => {
    let attention: AttentionLevel = 'low';
    let attentionReason = 'A standard provision identified for informational purposes.';

    // Base logic for "About to sign" vs "Thinking about resigning"
    if (context.intent === 'resign') {
      if (['notice', 'post_employment', 'confidentiality', 'termination', 'property'].includes(clause.category)) {
        attention = 'high';
        attentionReason = 'Crucial to review when planning to resign to understand your continuing obligations and timelines.';
      } else {
        attention = 'low';
        attentionReason = 'Less relevant when preparing for resignation.';
      }
    } else {
      // Default / Sign logic
      if (context.priorities.includes(clause.category)) {
        attention = 'high';
        attentionReason = `You specifically marked ${clause.category.replace('_', ' ')} as a priority.`;
      } else if (['notice', 'compensation', 'post_employment', 'intellectual_property', 'side_projects'].includes(clause.category)) {
        attention = 'medium';
        attentionReason = 'Standard terms worth reviewing before committing.';
      }
    }

    // Specific wow moment overrides based on concerns
    if (context.intent === 'sign' && context.concern && context.concern.length > 3) {
      const concernLower = context.concern.toLowerCase();
      if ((clause.category === 'intellectual_property' || clause.category === 'side_projects') && 
          (concernLower.includes('project') || concernLower.includes('code') || concernLower.includes('app') || concernLower.includes('software'))) {
        attention = 'high';
        attentionReason = `You indicated that you maintain "${context.concern}", so this clause is prioritized for you to review.`;
      }
    }

    return {
      ...clause,
      attention,
      attentionReason
    };
  }).sort((a, b) => {
    // Sort High -> Medium -> Low
    const scores = { high: 3, medium: 2, low: 1 };
    
    // Within same attention level, sort structurally or by specific categories to make the UI look intentional
    if (scores[b.attention] === scores[a.attention]) {
      // In resign mode, notice should always be top
      if (context.intent === 'resign' && a.category === 'notice') return -1;
      if (context.intent === 'resign' && b.category === 'notice') return 1;
      // In sign mode, IP should be top if it's high
      if (context.intent === 'sign' && a.category === 'intellectual_property') return -1;
      if (context.intent === 'sign' && b.category === 'intellectual_property') return 1;
      return 0;
    }
    
    return scores[b.attention] - scores[a.attention];
  });
}
