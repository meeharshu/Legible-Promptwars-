import { DocumentInfo } from '../types';

export const SAMPLE_DOCUMENTS: DocumentInfo[] = [
  {
    id: 'doc_offer',
    title: 'Offer Letter',
    summary: 'Initial offer of employment detailing compensation and start date.',
    type: 'Offer Letter',
    content: 'Full text of the Offer Letter...',
    sections: [
      {
        id: 'sec_offer_comp',
        documentId: 'doc_offer',
        title: 'Compensation',
        text: 'Your base salary will be $150,000 per year, paid semi-monthly.',
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
    summary: 'The original employment contract signed at the start of employment.',
    type: 'Agreement',
    content: 'Full text of original agreement...',
    sections: [
      {
        id: 'sec_orig_comp',
        documentId: 'doc_emp_orig',
        title: 'Section 4. Compensation',
        text: 'Base salary of $150,000.',
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
        text: 'All intellectual property created during employment belongs to Northstar Labs.',
        tags: ['ip', 'side_projects']
      }
    ]
  },
  {
    id: 'doc_emp_rev',
    title: 'Employment Agreement — Revised',
    summary: 'An updated employment agreement signed 2 years into employment.',
    type: 'Agreement',
    content: 'Full text of revised agreement...',
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
    summary: 'Standard NDA covering company proprietary information.',
    type: 'NDA',
    content: 'Full text of NDA...',
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
    summary: 'General employee policies and guidelines.',
    type: 'Policy',
    content: 'Full text of Company Policy...',
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
