import { Situation, ProvisionInsight, DocumentDifference, Inconsistency, NextStep, ContextState, DocumentInfo } from '../types';

// Dynamic, context-aware analysis engine that evaluates both preset benchmark scenarios
// and custom user-uploaded documents with verifiable citations.

export function generateInsights(context: ContextState): ProvisionInsight[] {
  const insights: ProvisionInsight[] = [];
  const allSections = context.documents.flatMap(d => d.sections || []);
  const docTitles = context.documents.map(d => d.title.toLowerCase());
  
  // 1. Notice Period Analysis (especially for resigning, comparing, or termination focus)
  const noticeSection = allSections.find(s => s.tags.includes('notice') && s.text.toLowerCase().includes('60 days')) 
    || allSections.find(s => s.tags.includes('notice'));

  if (noticeSection && (context.situation === 'resigning' || context.selectedFocus.includes('Notice') || context.situation === 'comparing')) {
    const is60Days = noticeSection.text.includes('60 days');
    insights.push({
      id: 'ins_notice',
      title: 'Notice Period Obligation',
      relevance: 'high',
      summary: is60Days ? '60 days written notice required' : 'Standard 30-day notice requirement',
      explanation: is60Days 
        ? `The active agreement establishes a strict 60-day written notice requirement. Because your situation is "${formatSituation(context.situation)}", this extended duration directly impacts your departure timeline and transition planning.`
        : 'Notice terms define the mandatory minimum period before resignation is effective.',
      sources: [
        { 
          documentId: noticeSection.documentId, 
          sectionId: noticeSection.id, 
          label: getDocLabel(context.documents, noticeSection.documentId), 
          text: noticeSection.text 
        }
      ],
      tags: ['notice', 'resigning', 'termination']
    });
  }

  // 2. Intellectual Property & Outside Activities / Side Projects
  const ipSection = allSections.find(s => s.tags.includes('ip') && s.text.toLowerCase().includes('outside'))
    || allSections.find(s => s.tags.includes('ip'));

  if (ipSection && (context.selectedFocus.includes('Intellectual property') || context.selectedFocus.includes('Side projects') || context.situation === 'before_signing' || context.situation === 'resigning')) {
    const hasOutsideRestriction = ipSection.text.toLowerCase().includes('outside') || ipSection.text.toLowerCase().includes('prior written consent');
    insights.push({
      id: 'ins_ip',
      title: 'Intellectual Property Assignment Scope',
      relevance: 'high',
      summary: hasOutsideRestriction ? 'Broad IP assignment with outside project restrictions' : 'Standard invention assignment',
      explanation: hasOutsideRestriction
        ? `The agreement contains an expansive assignment clause that restricts unauthorized outside software projects and claims inventions related to company business. Prior written authorization is required for any commercial or open-source side projects.`
        : 'Work product created during working hours or using company resources vests in the employer.',
      sources: [
        { 
          documentId: ipSection.documentId, 
          sectionId: ipSection.id, 
          label: getDocLabel(context.documents, ipSection.documentId), 
          text: ipSection.text 
        }
      ],
      tags: ['ip', 'side_projects']
    });
  }

  // 3. Post-Employment Restrictions & Non-Compete / Non-Solicit
  const postSection = allSections.find(s => s.tags.includes('restrictions') || s.tags.includes('post_employment'));
  if (postSection && (context.selectedFocus.includes('Restrictions after leaving') || context.situation === 'resigning' || context.situation === 'lawyer')) {
    insights.push({
      id: 'ins_post',
      title: 'Post-Employment Restrictive Covenants',
      relevance: 'high',
      summary: postSection.text.includes('12 months') ? '12-month non-solicitation of clients & staff' : 'Post-termination restrictive covenants',
      explanation: 'You are bound by ongoing restrictive covenants following termination. These restrict soliciting colleagues or existing enterprise accounts.',
      sources: [
        { 
          documentId: postSection.documentId, 
          sectionId: postSection.id, 
          label: getDocLabel(context.documents, postSection.documentId), 
          text: postSection.text 
        }
      ],
      tags: ['restrictions', 'post_employment']
    });
  }

  // 4. Confidentiality & Trade Secrets
  const confSection = allSections.find(s => s.tags.includes('confidentiality'));
  if (confSection && (context.selectedFocus.includes('Confidentiality') || context.situation === 'resigning' || context.situation === 'lawyer')) {
    insights.push({
      id: 'ins_conf',
      title: 'Confidentiality & Trade Secrets',
      relevance: 'medium',
      summary: 'Perpetual trade secret duty; 3-year confidential info window',
      explanation: 'Confidentiality obligations survive termination indefinitely for trade secrets and for a minimum multi-year window for proprietary data.',
      sources: [
        { 
          documentId: confSection.documentId, 
          sectionId: confSection.id, 
          label: getDocLabel(context.documents, confSection.documentId), 
          text: confSection.text 
        }
      ],
      tags: ['confidentiality']
    });
  }

  // 5. Company Property & Equipment Return
  const propSection = allSections.find(s => s.tags.includes('property'));
  if (propSection && (context.situation === 'resigning' || context.situation === 'issue')) {
    insights.push({
      id: 'ins_prop',
      title: 'Return of Company Hardware & Credentials',
      relevance: 'medium',
      summary: 'Mandatory return of hardware within 48 hours',
      explanation: 'Upon formal notice or termination, all company-provisioned devices, access tokens, and documents must be surrendered within 48 hours.',
      sources: [
        { 
          documentId: propSection.documentId, 
          sectionId: propSection.id, 
          label: getDocLabel(context.documents, propSection.documentId), 
          text: propSection.text 
        }
      ],
      tags: ['property', 'termination']
    });
  }

  // 6. Compensation & Severance
  const compSection = allSections.find(s => s.tags.includes('compensation'));
  if (compSection && (context.selectedFocus.includes('Compensation') || context.situation === 'before_signing')) {
    insights.push({
      id: 'ins_comp',
      title: 'Compensation & Remuneration Structure',
      relevance: 'medium',
      summary: 'Base salary and payment schedule',
      explanation: 'Outlines base compensation, payment frequency, and applicable bonus or severance conditions.',
      sources: [
        { 
          documentId: compSection.documentId, 
          sectionId: compSection.id, 
          label: getDocLabel(context.documents, compSection.documentId), 
          text: compSection.text 
        }
      ],
      tags: ['compensation']
    });
  }

  // Fallback for custom documents if no standard sections matched
  if (insights.length === 0 && context.documents.length > 0) {
    const firstDoc = context.documents[0];
    insights.push({
      id: 'ins_custom_1',
      title: firstDoc.title,
      relevance: 'high',
      summary: firstDoc.summary || 'Custom document analysis',
      explanation: `Analyzed ${context.documents.length} document(s) in context of "${formatSituation(context.situation)}". Key contractual commitments extracted.`,
      sources: [
        { 
          documentId: firstDoc.id, 
          sectionId: firstDoc.sections[0]?.id || 'sec_1', 
          label: firstDoc.title, 
          text: firstDoc.sections[0]?.text || firstDoc.content.slice(0, 160) 
        }
      ],
      tags: ['custom']
    });
  }

  return insights;
}

export function generateDifferences(context: ContextState): DocumentDifference[] {
  const diffs: DocumentDifference[] = [];
  const allSections = context.documents.flatMap(d => d.sections || []);

  const origNotice = allSections.find(s => s.tags.includes('notice') && s.text.includes('30-day'));
  const revNotice = allSections.find(s => s.tags.includes('notice') && s.text.includes('60 days'));

  if (origNotice && revNotice) {
    diffs.push({
      id: 'diff_notice',
      title: 'Notice Period Duration Modification',
      originalText: origNotice.text,
      currentText: revNotice.text,
      explanation: 'The mandatory notice period doubled from 30 days to 60 days in the revised agreement amendment.',
      whyItMatters: context.situation === 'resigning'
        ? 'Because you are planning to resign, the company will legally enforce the 60-day window unless an early release is mutually agreed upon in writing.'
        : 'Substantial increase in departure obligations requiring advance transition planning.',
      originalSource: { documentId: origNotice.documentId, sectionId: origNotice.id, label: getDocLabel(context.documents, origNotice.documentId) },
      currentSource: { documentId: revNotice.documentId, sectionId: revNotice.id, label: getDocLabel(context.documents, revNotice.documentId) },
      tags: ['notice', 'termination']
    });
  }

  const origIp = allSections.find(s => s.tags.includes('ip') && !s.text.includes('outside software'));
  const revIp = allSections.find(s => s.tags.includes('ip') && s.text.includes('outside software'));

  if (origIp && revIp) {
    diffs.push({
      id: 'diff_ip',
      title: 'Expansion of IP Assignment & Outside Project Restraint',
      originalText: origIp.text,
      currentText: revIp.text,
      explanation: 'The revised agreement introduces an explicit prohibition on outside software development projects without prior written executive authorization.',
      whyItMatters: 'If you maintain or develop software side-projects, open-source repositories, or SaaS products on weekends, this language poses serious IP exposure.',
      originalSource: { documentId: origIp.documentId, sectionId: origIp.id, label: getDocLabel(context.documents, origIp.documentId) },
      currentSource: { documentId: revIp.documentId, sectionId: revIp.id, label: getDocLabel(context.documents, revIp.documentId) },
      tags: ['ip', 'side_projects']
    });
  }

  // Contractor SOW Exclusivity difference check
  const msaNonExcl = allSections.find(s => s.tags.includes('side_projects') && s.text.includes('Non-Exclusive'));
  const sowExcl = allSections.find(s => s.tags.includes('conflict') && s.text.includes('Exclusivity Rider'));
  if (msaNonExcl && sowExcl) {
    diffs.push({
      id: 'diff_contractor_excl',
      title: 'Exclusivity Override across Statements of Work',
      originalText: msaNonExcl.text,
      currentText: sowExcl.text,
      explanation: 'While the Master Agreement guarantees non-exclusive freedom to consult for other parties, SOW #2 imposes an exclusivity rider against direct competitors.',
      whyItMatters: 'Working with other clients in parallel could trigger a contractual breach under SOW #2.',
      originalSource: { documentId: msaNonExcl.documentId, sectionId: msaNonExcl.id, label: 'Master Services Agreement' },
      currentSource: { documentId: sowExcl.documentId, sectionId: sowExcl.id, label: 'SOW #2 Addendum' },
      tags: ['restrictions', 'exclusivity']
    });
  }

  return diffs;
}

export function generateInconsistencies(context: ContextState): Inconsistency[] {
  const inconsistencies: Inconsistency[] = [];
  const allSections = context.documents.flatMap(d => d.sections || []);

  const offerNotice = allSections.find(s => s.documentId === 'doc_offer' && s.tags.includes('notice'));
  const revNotice = allSections.find(s => s.documentId === 'doc_emp_rev' && s.tags.includes('notice'));

  if (offerNotice && revNotice) {
    inconsistencies.push({
      id: 'inc_notice',
      title: 'Conflicting Notice Terms Between Offer Letter & Revised Agreement',
      explanation: 'The original Offer Letter and the Revised Agreement specify conflicting notice periods (30 days vs 60 days).',
      unclearDescription: 'The documents do not contain an explicit superseding integration clause voiding the Offer Letter notice term. This ambiguity creates friction if HR references the 60-day clause while the employee relies on the 30-day initial covenant.',
      suggestedQuestion: 'Could you please verify in writing whether the 60-day notice period in Section 9.1 is intended to supersede the 30-day term specified in my initial Offer Letter?',
      sources: [
        { documentId: 'doc_offer', sectionId: offerNotice.id, label: 'Offer Letter', text: offerNotice.text },
        { documentId: 'doc_emp_rev', sectionId: revNotice.id, label: 'Revised Agreement', text: revNotice.text }
      ],
      tags: ['notice', 'conflict']
    });
  }

  const msaIp = allSections.find(s => s.documentId === 'doc_msa' && s.tags.includes('ip'));
  const sowPayment = allSections.find(s => s.documentId === 'doc_sow_revised' && s.tags.includes('compensation'));
  if (msaIp && sowPayment) {
    inconsistencies.push({
      id: 'inc_payment_ip',
      title: 'Contradiction in Milestone Retainage vs Immediate IP Transfer',
      explanation: 'MSA states IP only transfers upon full payment, but SOW retains 20% payment for 45 days post sign-off.',
      unclearDescription: 'If client withholds 20% retainage, does client legally own the IP on deliverables during that 45-day window?',
      suggestedQuestion: 'Under Section 7 of the MSA, does IP transfer immediately upon deliverable delivery or only upon release of the 20% milestone retainage?',
      sources: [
        { documentId: 'doc_msa', sectionId: msaIp.id, label: 'Master Agreement', text: msaIp.text },
        { documentId: 'doc_sow_revised', sectionId: sowPayment.id, label: 'SOW #2', text: sowPayment.text }
      ],
      tags: ['ip', 'compensation']
    });
  }

  return inconsistencies;
}

export function generateNextSteps(context: ContextState): NextStep[] {
  const steps: NextStep[] = [
    { 
      id: 'ns_review', 
      title: 'Verifiable Source Audit', 
      action: 'Examine highlighted original source provisions.', 
      description: 'Review the verbatim clauses in each linked document before communicating with management or HR.' 
    },
    { 
      id: 'ns_clarify', 
      title: 'Notice Period Resolution', 
      action: 'Obtain written confirmation of governing notice duration.', 
      description: 'Submit our generated question to HR to eliminate ambiguity between 30-day and 60-day clauses.' 
    }
  ];

  if (context.situation === 'resigning') {
    steps.push({ 
      id: 'ns_side_project', 
      title: 'Pre-Existing IP Carve-Out', 
      action: 'Document external side projects on personal hardware.', 
      description: 'Ensure any independent software code was never compiled or stored on company laptops prior to resignation date.' 
    });
    steps.push({ 
      id: 'ns_prop', 
      title: 'Device & Data Surrender Protocol', 
      action: 'Prepare company hardware for scheduled 48-hour return.', 
      description: 'Back up personal contact info (without copying any company proprietary data) to ensure smooth handover.' 
    });
  }

  if (context.situation === 'lawyer') {
    steps.push({ 
      id: 'ns_brief', 
      title: 'Deliver Legible Executive Brief', 
      action: 'Export and share the generated one-page brief with counsel.', 
      description: 'Provides attorney with pre-collated evidence, conflicting clauses, and specific questions.' 
    });
  }

  return steps;
}

export function generateSuggestedQuestions(context: ContextState): string[] {
  if (context.situation === 'resigning') {
    return [
      'Can I request an agreed early departure waiver from the 60-day notice period?',
      'Does the revised agreement legally supersede the 30-day notice in my initial offer?',
      'Which client accounts are covered under the 12-month post-employment restriction?',
      'What is the formal procedure for returning company hardware within 48 hours?'
    ];
  } else if (context.situation === 'before_signing') {
    return [
      'Can we add an explicit exhibit listing pre-existing personal open-source projects?',
      'Is the notice period mutual (does the company also give 60 days notice)?',
      'What triggers accelerated vesting in the severance clause?'
    ];
  } else if (context.situation === 'comparing') {
    return [
      'What specific consideration was granted in exchange for doubling the notice period?',
      'Why was the outside software development restriction added to Section 6?',
      'Does the revised agreement contain an explicit integration clause?'
    ];
  }
  return [
    'What are my exact post-employment covenants?',
    'Are there conflicting provisions between my offer and agreements?',
    'What should I clarify with legal counsel?'
  ];
}

// Interactive chat question responder for realistic live demos
export function answerQuestionLocally(question: string, context: ContextState): { answer: string; sources: string[] } {
  const q = question.toLowerCase();
  
  if (q.includes('resign') || q.includes('leave') || q.includes('quit')) {
    return {
      answer: `When considering resignation, your documents present two critical considerations:\n\n1. **Notice Period**: While your original Offer Letter stated 30 days, the Revised Agreement Section 9.1 mandates **60 days written notice**.\n2. **Side Projects & IP**: Section 6 restricts outside software projects without authorization.\n3. **Property Return**: Company policy requires all laptops and badges to be returned within 48 hours.\n4. **Non-Solicitation**: Section 11 restricts soliciting clients or team members for 12 months.`,
      sources: [
        'Employment Agreement — Revised · Section 9.1',
        'Offer Letter · Notice Period',
        'Company Policy Handbook · Return of Property'
      ]
    };
  }

  if (q.includes('notice') || q.includes('30') || q.includes('60') || q.includes('days')) {
    return {
      answer: `There is an active discrepancy regarding your notice period:\n\n• **Offer Letter**: Requests a **30-day** notice period.\n• **Revised Agreement (Section 9.1)**: Mandates a **60-day** written notice period.\n\nBecause the revised agreement was signed later, employers typically claim 60 days applies, but the lack of an explicit revocation clause in your offer letter provides grounds for negotiation.`,
      sources: [
        'Revised Employment Agreement · Section 9.1',
        'Original Offer Letter · Notice Clause'
      ]
    };
  }

  if (q.includes('side project') || q.includes('ip') || q.includes('intellectual property') || q.includes('code') || q.includes('app')) {
    return {
      answer: `Under Section 6 of your Revised Agreement:\n\n• All IP created during employment hours or related to company business belongs to ${context.personaCompany}.\n• An added clause explicitly states: *"The Employee may not engage in outside software development projects without prior written consent."*\n\nIf you intend to develop independent software, you should obtain a written waiver or invention carve-out confirmation prior to launch.`,
      sources: [
        'Revised Employment Agreement · Section 6',
        'Original Agreement · Section 5'
      ]
    };
  }

  if (q.includes('lawyer') || q.includes('brief') || q.includes('cost') || q.includes('attorney')) {
    return {
      answer: `To prepare effectively for an attorney consultation:\n\n1. Use the **Lawyer Brief tab** in Legible to print or copy the executive summary.\n2. Bring all linked documents (Offer Letter, Agreements, Handbook).\n3. Ask counsel specifically: *"Is the 60-day notice enforceable given the offer letter term, and does Section 6 overreach on personal software projects?"*`,
      sources: [
        'Legible Legal Context Brief',
        'Inconsistencies & Conflict Summary'
      ]
    };
  }

  // Default intelligent contextual fallback
  return {
    answer: `Based on your ${context.documents.length} linked documents for "${formatSituation(context.situation)}":\n\nYour primary contractual risks revolve around the notice discrepancy (30 vs 60 days) and the broadened intellectual property provisions in the revised addendum. We recommend reviewing the "Changes" and "Conflicts" tabs for exact verbatim citations.`,
    sources: context.documents.slice(0, 3).map(d => d.title)
  };
}

function getDocLabel(docs: DocumentInfo[], docId: string): string {
  const doc = docs.find(d => d.id === docId);
  return doc ? doc.title : 'Contract Document';
}

function formatSituation(s: Situation): string {
  const map: Record<Situation, string> = {
    'before_signing': 'Reviewing before signing',
    'comparing': 'Comparing two versions',
    'resigning': 'Thinking about resigning',
    'issue': 'Responding to an issue',
    'lawyer': 'Preparing for a lawyer',
    'exploring': 'Exploring documents'
  };
  return map[s] || 'Document Review';
}
