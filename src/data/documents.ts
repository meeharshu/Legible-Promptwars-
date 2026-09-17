import { DocumentInfo } from '../types';

export interface PresetScenario {
  id: string;
  name: string;
  tagline: string;
  role: string;
  company: string;
  defaultSituation: 'resigning' | 'comparing' | 'before_signing';
  defaultFocus: string[];
  documents: DocumentInfo[];
}

export const SAMPLE_DOCUMENTS: DocumentInfo[] = [
  {
    id: 'doc_offer',
    title: 'Offer Letter',
    summary: 'Initial offer of employment detailing compensation, notice, and start date.',
    type: 'Offer Letter',
    content: 'Full text of Offer Letter:\nBase salary: $150,000/year.\nNotice: Employment is at-will. However, we request a 30-day notice period in the event you choose to resign.\nBenefits: Standard health, 401(k), and 20 days PTO.',
    sections: [
      {
        id: 'sec_offer_comp',
        documentId: 'doc_offer',
        title: 'Compensation',
        text: 'Your base salary will be $150,000 per year, paid semi-monthly on standard payroll cycles.',
        tags: ['compensation']
      },
      {
        id: 'sec_offer_notice',
        documentId: 'doc_offer',
        title: 'Notice Period',
        text: 'Employment is at-will. However, we request a 30-day notice period in the event you choose to resign.',
        tags: ['notice', 'termination']
      }
    ]
  },
  {
    id: 'doc_emp_orig',
    title: 'Employment Agreement — Original',
    summary: 'The original primary employment contract signed at start of employment.',
    type: 'Agreement',
    content: 'Section 4. Compensation: Base salary of $150,000.\nSection 8.1 Notice of Termination: The Employee must provide 30 days written notice prior to voluntary resignation.\nSection 5. Intellectual Property: All intellectual property created during employment belongs to Northstar Labs.',
    sections: [
      {
        id: 'sec_orig_comp',
        documentId: 'doc_emp_orig',
        title: 'Section 4. Compensation',
        text: 'Base salary of $150,000 per annum, subject to standard performance reviews.',
        tags: ['compensation']
      },
      {
        id: 'sec_orig_notice',
        documentId: 'doc_emp_orig',
        title: 'Section 8.1 Notice of Termination',
        text: 'The Employee must provide 30 days written notice prior to voluntary resignation.',
        tags: ['notice', 'termination']
      },
      {
        id: 'sec_orig_ip',
        documentId: 'doc_emp_orig',
        title: 'Section 5. Intellectual Property',
        text: 'All intellectual property created during employment hours or utilizing company resources belongs to Northstar Labs.',
        tags: ['ip', 'side_projects']
      }
    ]
  },
  {
    id: 'doc_emp_rev',
    title: 'Employment Agreement — Revised (Addendum)',
    summary: 'An updated employment agreement signed 2 years into tenure during promotion.',
    type: 'Agreement',
    content: 'Section 9.1 Notice of Termination: The Employee must provide 60 days written notice prior to voluntary resignation.\nSection 6. Intellectual Property & Outside Activities: All IP created during employment, and any projects created on company hardware or related to company business, belong to Northstar Labs. The Employee may not engage in outside software development projects without prior written consent.\nSection 11. Post-Employment Obligations: The Employee agrees not to solicit company employees or clients for a period of 12 months following termination.',
    sections: [
      {
        id: 'sec_rev_notice',
        documentId: 'doc_emp_rev',
        title: 'Section 9.1 Notice of Termination',
        text: 'The Employee must provide 60 days written notice prior to voluntary resignation.',
        tags: ['notice', 'termination']
      },
      {
        id: 'sec_rev_ip',
        documentId: 'doc_emp_rev',
        title: 'Section 6. Intellectual Property & Outside Activities',
        text: 'All IP created during employment, and any projects created on company hardware or related to company business, belong to Northstar Labs. The Employee may not engage in outside software development projects without prior written consent.',
        tags: ['ip', 'side_projects']
      },
      {
        id: 'sec_rev_post',
        documentId: 'doc_emp_rev',
        title: 'Section 11. Post-Employment Obligations',
        text: 'The Employee agrees not to solicit company employees or clients for a period of 12 months following termination.',
        tags: ['restrictions', 'post_employment']
      }
    ]
  },
  {
    id: 'doc_nda',
    title: 'Non-Disclosure Agreement',
    summary: 'Standard confidentiality agreement covering proprietary technology.',
    type: 'NDA',
    content: 'Section 4. Confidentiality: The Employee shall maintain the confidentiality of all Trade Secrets indefinitely, and all other Confidential Information for a period of 3 years post-employment.',
    sections: [
      {
        id: 'sec_nda_conf',
        documentId: 'doc_nda',
        title: 'Section 4. Confidentiality',
        text: 'The Employee shall maintain the confidentiality of all Trade Secrets indefinitely, and all other Confidential Information for a period of 3 years post-employment.',
        tags: ['confidentiality', 'post_employment']
      }
    ]
  },
  {
    id: 'doc_policy',
    title: 'Company Policy Handbook',
    summary: 'Internal handbook outlining hardware return and departure logistics.',
    type: 'Policy',
    content: 'Return of Company Property: Upon termination, all company-issued laptops, badges, and hardware must be returned within 48 hours.',
    sections: [
      {
        id: 'sec_pol_prop',
        documentId: 'doc_policy',
        title: 'Return of Company Property',
        text: 'Upon termination, all company-issued laptops, badges, and hardware must be returned within 48 hours.',
        tags: ['termination', 'property']
      }
    ]
  }
];

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'scenario_tech_resignation',
    name: 'Tech Resignation & IP Rights',
    tagline: 'Staff Software Engineer at Northstar Labs (5 documents)',
    role: 'Staff Software Engineer',
    company: 'Northstar Labs',
    defaultSituation: 'resigning',
    defaultFocus: ['Notice', 'Intellectual property', 'Side projects', 'Restrictions after leaving'],
    documents: SAMPLE_DOCUMENTS
  },
  {
    id: 'scenario_contractor_ip',
    name: 'Consultant Master Agreement & SOW',
    tagline: 'Principal Designer & Developer at Vertex Media (3 documents)',
    role: 'Principal Consultant',
    company: 'Vertex Media',
    defaultSituation: 'comparing',
    defaultFocus: ['Intellectual property', 'Compensation', 'Changes between documents', 'Termination'],
    documents: [
      {
        id: 'doc_msa',
        title: 'Master Services Agreement (MSA)',
        summary: 'Primary contract governing independent contractor consulting relationship.',
        type: 'Agreement',
        content: 'Section 3. Payment: Net 30 payment terms upon approved invoice.\nSection 7. Intellectual Property: Work Product transfers upon complete payment of all fees.\nSection 9. Exclusivity: Contractor remains free to provide services to third parties.',
        sections: [
          {
            id: 'sec_msa_ip',
            documentId: 'doc_msa',
            title: 'Section 7. IP Assignment Conditional on Payment',
            text: 'All right, title, and interest in Work Product shall assign to Client solely upon receipt of full payment of applicable invoices.',
            tags: ['ip', 'compensation']
          },
          {
            id: 'sec_msa_nonexclusive',
            documentId: 'doc_msa',
            title: 'Section 9. Non-Exclusive Engagement',
            text: 'Nothing herein shall restrict Contractor from performing services for other clients, provided client confidential information is not disclosed.',
            tags: ['restrictions', 'side_projects']
          }
        ]
      },
      {
        id: 'doc_sow_revised',
        title: 'Statement of Work — SOW Addendum #2',
        summary: 'Latest project statement introducing accelerated deadlines and exclusivity.',
        type: 'SOW',
        content: 'Section 4. Exclusivity Rider: During the active term of SOW #2, Contractor agrees not to perform services for direct competitors in generative UI.\nSection 5. Milestone Retainage: 20% retainage withheld until final QA sign-off.',
        sections: [
          {
            id: 'sec_sow_exclusivity',
            documentId: 'doc_sow_revised',
            title: 'Section 4. Exclusivity Rider',
            text: 'During the active term of SOW #2, Contractor shall not provide consulting or design services to direct competitors in the enterprise AI space without written authorization.',
            tags: ['restrictions', 'conflict']
          },
          {
            id: 'sec_sow_payment',
            documentId: 'doc_sow_revised',
            title: 'Section 5. Milestone Retainage',
            text: 'Client shall withhold 20% of each milestone payment until final user acceptance testing, payable within 45 days of sign-off.',
            tags: ['compensation']
          }
        ]
      },
      {
        id: 'doc_contractor_nda',
        title: 'Mutual Non-Disclosure Agreement',
        summary: 'Mutual secrecy protection for proprietary workflows.',
        type: 'NDA',
        content: 'Term: 2 years from disclosure. Trade secrets protected under DTSA.',
        sections: [
          {
            id: 'sec_c_nda',
            documentId: 'doc_contractor_nda',
            title: 'Section 3. Non-Disclosure Term',
            text: 'Confidentiality obligations shall continue for a period of two (2) years following the conclusion of all Statements of Work.',
            tags: ['confidentiality']
          }
        ]
      }
    ]
  },
  {
    id: 'scenario_executive_offer',
    name: 'Executive Leadership Package',
    tagline: 'VP of Engineering at Stratos Cloud (3 documents)',
    role: 'VP of Engineering',
    company: 'Stratos Cloud',
    defaultSituation: 'before_signing',
    defaultFocus: ['Compensation', 'Restrictions after leaving', 'Notice', 'Confidentiality'],
    documents: [
      {
        id: 'doc_exec_offer',
        title: 'Executive Employment Offer',
        summary: 'Leadership offer package with base, equity grant, and severance parameters.',
        type: 'Offer Letter',
        content: 'Base: $285,000. Equity: 1.25% common stock options with 4-year vesting and 1-year cliff.\nSeverance: 6 months base salary upon termination without cause.',
        sections: [
          {
            id: 'sec_exec_comp',
            documentId: 'doc_exec_offer',
            title: 'Section 2. Executive Compensation & Severance',
            text: 'Base salary of $285,000. In the event of involuntary termination without Cause, Executive is entitled to 6 months severance and accelerated vesting of unvested options.',
            tags: ['compensation', 'termination']
          }
        ]
      },
      {
        id: 'doc_exec_covenants',
        title: 'Restrictive Covenants Agreement',
        summary: 'Non-compete, non-solicitation, and non-disparagement rider.',
        type: 'Agreement',
        content: 'Section 1. Non-Competition: 12 months nationwide restriction in cloud infrastructure.\nSection 2. Non-Solicitation of Key Personnel: 24 months from departure date.',
        sections: [
          {
            id: 'sec_exec_noncompete',
            documentId: 'doc_exec_covenants',
            title: 'Section 1. Non-Competition Scope',
            text: 'For twelve (12) months following termination, Executive shall not engage in, advise, or invest in any business directly competing with Stratos Cloud within North America.',
            tags: ['restrictions', 'post_employment']
          },
          {
            id: 'sec_exec_nonsolicit',
            documentId: 'doc_exec_covenants',
            title: 'Section 2. Customer & Employee Non-Solicitation',
            text: 'For twenty-four (24) months post-departure, Executive shall not solicit or encourage any employee or client of Stratos Cloud to terminate their relationship.',
            tags: ['restrictions']
          }
        ]
      }
    ]
  }
];
