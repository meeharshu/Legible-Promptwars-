import { Situation, ProvisionInsight, DocumentDifference, Inconsistency, NextStep, ContextState } from '../types';

// This is the core logic engine that simulates an AI understanding the context.
// It uses strict deterministic rules based on the user's situation and focus to select 
// predefined high-quality insights.

export function generateInsights(context: ContextState): ProvisionInsight[] {
  const insights: ProvisionInsight[] = [];
  
  if (context.situation === 'resigning' || context.situation === 'lawyer') {
    insights.push({
      id: 'ins_notice',
      title: 'Notice Period',
      relevance: 'high',
      summary: '60 days',
      explanation: 'The current agreement describes a 60-day notice period. You told Legible that you are considering resigning, so the notice provision is directly relevant to your current situation.',
      sources: [
        { documentId: 'doc_emp_rev', sectionId: 'sec_rev_notice', label: 'Current Agreement', text: 'The Employee must provide 60 days written notice prior to voluntary resignation.' }
      ],
      tags: ['notice', 'resigning']
    });
    insights.push({
      id: 'ins_post',
      title: 'Post-employment obligations',
      relevance: 'high',
      summary: '12-month non-solicitation',
      explanation: 'You are restricted from soliciting employees or clients for 12 months after leaving.',
      sources: [
        { documentId: 'doc_emp_rev', sectionId: 'sec_rev_post', label: 'Revised Agreement', text: 'The Employee agrees not to solicit company employees or clients for a period of 12 months following termination.' }
      ],
      tags: ['restrictions']
    });
    insights.push({
      id: 'ins_prop',
      title: 'Company property',
      relevance: 'medium',
      summary: 'Return hardware within 48 hours',
      explanation: 'All hardware and badges must be returned shortly after termination.',
      sources: [
        { documentId: 'doc_policy', sectionId: 'sec_pol_prop', label: 'Company Policy', text: 'Upon termination, all company-issued laptops, badges, and hardware must be returned within 48 hours.' }
      ],
      tags: ['property']
    });
  }

  if (context.situation === 'before_signing' || context.selectedFocus.includes('Intellectual property') || context.selectedFocus.includes('Side projects')) {
    insights.push({
      id: 'ins_ip',
      title: 'Intellectual Property',
      relevance: 'high',
      summary: 'Broad IP assignment and side-project restrictions',
      explanation: 'The revised agreement expands the company\'s claim to your IP and requires written consent for outside software projects. Since you mentioned software projects outside work, this is highly relevant.',
      sources: [
        { documentId: 'doc_emp_rev', sectionId: 'sec_rev_ip', label: 'Revised Agreement', text: 'All IP created during employment, and any projects created on company hardware or related to company business, belong to Northstar Labs. The Employee may not engage in outside software development projects without prior written consent.' }
      ],
      tags: ['ip', 'side_projects']
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'ins_comp',
      title: 'Compensation',
      relevance: 'medium',
      summary: '$150,000 base salary',
      explanation: 'Standard compensation clause.',
      sources: [
        { documentId: 'doc_offer', sectionId: 'sec_offer_comp', label: 'Offer Letter', text: 'Your base salary will be $150,000 per year, paid semi-monthly.' }
      ],
      tags: ['compensation']
    });
  }

  return insights;
}

export function generateDifferences(context: ContextState): DocumentDifference[] {
  return [
    {
      id: 'diff_notice',
      title: 'Notice period',
      originalText: '30 days',
      currentText: '60 days',
      explanation: 'The notice period requirement doubled in the revised agreement.',
      whyItMatters: context.situation === 'resigning' ? 'Because you are planning to resign, you must adhere to the 60-day requirement, not the original 30-day requirement.' : 'Significant change to your termination obligations.',
      originalSource: { documentId: 'doc_emp_orig', sectionId: 'sec_orig_notice', label: 'Original Agreement' },
      currentSource: { documentId: 'doc_emp_rev', sectionId: 'sec_rev_notice', label: 'Revised Agreement' },
      tags: ['notice', 'termination']
    },
    {
      id: 'diff_ip',
      title: 'Intellectual property',
      originalText: 'Standard IP assignment',
      currentText: 'Additional language appears in the revised agreement.',
      explanation: 'The revised agreement adds a specific restriction against outside software development projects without written consent.',
      whyItMatters: 'If you build side projects, this directly impacts your ability to do so legally.',
      originalSource: { documentId: 'doc_emp_orig', sectionId: 'sec_orig_ip', label: 'Original Agreement' },
      currentSource: { documentId: 'doc_emp_rev', sectionId: 'sec_rev_ip', label: 'Revised Agreement' },
      tags: ['ip', 'side_projects']
    }
  ];
}

export function generateInconsistencies(context: ContextState): Inconsistency[] {
  return [
    {
      id: 'inc_notice',
      title: 'Notice period appears differently across documents',
      explanation: 'The documents contain different notice-period provisions.',
      unclearDescription: 'The documents do not make it obvious which provision governs the current employment relationship. While the revised agreement says 60 days, the Offer Letter still says 30 days and was never explicitly revoked.',
      suggestedQuestion: 'Could you clarify which notice provision applies to my current employment?',
      sources: [
        { documentId: 'doc_offer', sectionId: 'sec_offer_notice', label: 'Offer Letter', text: 'we request a 30-day notice period' },
        { documentId: 'doc_emp_rev', sectionId: 'sec_rev_notice', label: 'Revised Agreement', text: 'must provide 60 days written notice' }
      ],
      tags: ['notice', 'conflict']
    }
  ];
}

export function generateNextSteps(context: ContextState): NextStep[] {
  const steps: NextStep[] = [
    { id: 'ns_review', title: 'Review', action: 'Open the highlighted provisions.', description: 'Read the original source text for the generated insights.' },
    { id: 'ns_clarify', title: 'Clarify', action: 'Ask HR about conflicting or unclear language.', description: 'Resolve the ambiguity around the notice period.' }
  ];

  if (context.situation === 'comparing') {
    steps.push({ id: 'ns_compare', title: 'Compare', action: 'Review the original and revised agreement.', description: 'Read the specific changes side-by-side.' });
  }

  if (context.situation === 'lawyer') {
    steps.push({ id: 'ns_prepare', title: 'Prepare', action: 'Collect relevant excerpts and questions.', description: 'Use the Legible Brief to organize your meeting.' });
    steps.push({ id: 'ns_prof', title: 'Professional help', action: 'Consider discussing significant issues with a qualified legal professional.', description: 'Especially regarding IP ownership and post-employment restrictions.' });
  }

  return steps;
}

export function generateSuggestedQuestions(context: ContextState): string[] {
  if (context.situation === 'resigning') {
    return [
      'What happens if I resign?',
      'What is my current notice period?',
      'Which obligations continue after employment?',
      'What should I ask HR?'
    ];
  } else if (context.situation === 'comparing') {
    return [
      'What changed between the agreements?',
      'Does the revised agreement replace the earlier notice provision?',
      'Are there conflicting provisions?'
    ];
  }
  return [
    'Can I work on personal projects?',
    'What should I bring to a lawyer?',
    'What is my current notice period?'
  ];
}
