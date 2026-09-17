export const sampleAgreementText = `
NORTHSTAR LABS INC.
EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into as of October 1, 2023, by and between Northstar Labs Inc. ("Company"), and Alex Morgan ("Employee").

1. Position and Duties
The Company agrees to employ the Employee, and the Employee agrees to be employed by the Company, as a Software Engineer. The Employee will perform duties as assigned by the Company from time to time.

2. Compensation
2.1 Base Salary. The Company shall pay the Employee an annual base salary of $120,000, payable in accordance with the Company's standard payroll practices.
2.2 Bonus. The Employee may be eligible for an annual performance bonus of up to 10% of their base salary, at the sole discretion of the Company.

3. Working Hours
The Employee is expected to work a standard 40-hour workweek.

4. Probationary Period
The first 90 days of employment shall constitute a probationary period. During this time, either party may terminate the employment relationship with one week's notice.

5. Confidentiality
The Employee agrees to maintain the confidentiality of all proprietary information and trade secrets of the Company, both during and after the term of employment. "Confidential Information" includes, but is not limited to, customer lists, software code, business plans, and financial data.

6. Intellectual Property
6.1 Company Ownership. The Employee agrees that any and all inventions, discoveries, designs, developments, methods, modifications, improvements, ideas, products, processes, algorithms, databases, computer programs, formulae, techniques, know-how, secrets, graphics or images, audio or visual works, and other works of authorship (collectively "Inventions") that the Employee creates, develops, or conceives during the period of employment shall be the sole and exclusive property of the Company.
6.2 Pre-existing IP. The Employee must disclose any pre-existing intellectual property prior to the commencement of employment.

7. Outside Activities and Side Projects
During the term of employment, the Employee shall devote their full business time and attention to the business of the Company. The Employee shall not engage in any other employment, consulting, or other business activity (whether full-time or part-time) that would create a conflict of interest with the Company. The agreement does not clearly establish whether all independently developed personal projects created on the Employee's own time, without Company resources, are excluded from Company ownership or considered a conflict of interest.

8. Termination
8.1 At-Will Employment. Employment with the Company is "at-will," meaning that either the Company or the Employee may terminate the employment relationship at any time, with or without cause.
8.2 Termination for Cause. The Company may terminate the Employee's employment immediately for "Cause," which includes willful misconduct, breach of this Agreement, or conviction of a felony.

9. Resignation and Notice
The Employee agrees to provide the Company with a minimum of sixty (60) days' written notice of their intent to resign ("Notice Period"). The Company may, at its option, elect to pay the Employee for the Notice Period in lieu of requiring the Employee to work during that time.

10. Post-Employment Restrictions
For a period of twelve (12) months following the termination of employment, the Employee shall not directly or indirectly solicit any customer, client, or employee of the Company for the purpose of competing with the Company's business.

11. Return of Company Property
Upon termination of employment, or at any time requested by the Company, the Employee shall immediately return all Company property, including laptops, access keys, documents, and any Confidential Information.

12. Dispute Resolution
Any disputes arising out of or related to this Agreement shall be resolved through binding arbitration in the state of California.

IN WITNESS WHEREOF, the parties have executed this Agreement.
`;

export const sampleClauses = [
  {
    id: "clause-ip",
    category: "intellectual_property",
    title: "Intellectual Property Ownership",
    section: "6.1",
    page: 2,
    sourceText: "The Employee agrees that any and all inventions... that the Employee creates, develops, or conceives during the period of employment shall be the sole and exclusive property of the Company.",
    plainEnglish: "The company claims ownership over virtually anything you create or invent while employed by them.",
    whyItMatters: "This clause is very broad. It might claim ownership over your personal side projects, even if you build them on weekends using your own equipment.",
    questions: ["Can we add an exhibit explicitly excluding my existing and future personal open-source projects?"],
  },
  {
    id: "clause-side-projects",
    category: "side_projects",
    title: "Outside Activities & Side Projects",
    section: "7",
    page: 2,
    sourceText: "The Employee shall not engage in any other employment, consulting, or other business activity... that would create a conflict of interest with the Company. The agreement does not clearly establish whether all independently developed personal projects created on the Employee's own time, without Company resources, are excluded...",
    plainEnglish: "You cannot take on work that conflicts with the company. However, the agreement is vague about whether your personal side projects count as a conflict or if the company owns them.",
    whyItMatters: "Because you mentioned you build personal software projects, this ambiguity is a significant risk. The company could argue your side projects conflict with their business.",
    questions: ["How does the company define a 'conflict of interest' regarding personal software projects?", "Can I get written permission for my current side projects before signing?"],
  },
  {
    id: "clause-notice",
    category: "notice",
    title: "Resignation and Notice",
    section: "9",
    page: 3,
    sourceText: "The Employee agrees to provide the Company with a minimum of sixty (60) days' written notice of their intent to resign (\"Notice Period\"). The Company may, at its option, elect to pay the Employee for the Notice Period in lieu of requiring the Employee to work during that time.",
    plainEnglish: "If you want to quit, you must give 60 days' notice. The company can choose to pay you for those 60 days but ask you to stop working immediately (garden leave).",
    whyItMatters: "60 days is a long time in the tech industry. It could make it harder to accept a new job offer if the new employer wants you to start sooner.",
    questions: ["Is this 60-day notice period negotiable to a standard 14 or 30 days?"],
  },
  {
    id: "clause-post-emp",
    category: "post_employment",
    title: "Post-Employment Restrictions",
    section: "10",
    page: 3,
    sourceText: "For a period of twelve (12) months following the termination of employment, the Employee shall not directly or indirectly solicit any customer, client, or employee of the Company for the purpose of competing with the Company's business.",
    plainEnglish: "For one year after you leave, you cannot try to hire away the company's employees or poach their clients.",
    whyItMatters: "This limits who you can work with after leaving. If you start your own business, you cannot hire your former colleagues for a year.",
    questions: ["Does this non-solicitation apply to employees I didn't personally work with?"],
  },
  {
    id: "clause-confidentiality",
    category: "confidentiality",
    title: "Continuing Confidentiality",
    section: "5",
    page: 1,
    sourceText: "The Employee agrees to maintain the confidentiality of all proprietary information and trade secrets of the Company, both during and after the term of employment.",
    plainEnglish: "You must keep company secrets confidential forever, even after you leave.",
    whyItMatters: "You need to be careful not to use any proprietary knowledge gained here at your next job.",
    questions: ["What exactly is classified as a trade secret vs. general industry knowledge?"],
  },
  {
    id: "clause-termination",
    category: "termination",
    title: "At-Will Termination",
    section: "8.1",
    page: 2,
    sourceText: "Employment with the Company is \"at-will,\" meaning that either the Company or the Employee may terminate the employment relationship at any time, with or without cause.",
    plainEnglish: "The company can fire you at any time for almost any reason, and you can quit at any time.",
    whyItMatters: "Standard in the US, but it means you have little job security beyond your notice period.",
    questions: ["Are severance packages standard in the event of termination without cause?"],
  },
  {
    id: "clause-property",
    category: "property",
    title: "Return of Company Property",
    section: "11",
    page: 3,
    sourceText: "Upon termination of employment, or at any time requested by the Company, the Employee shall immediately return all Company property, including laptops, access keys, documents...",
    plainEnglish: "You must return all company equipment and data immediately when you leave.",
    whyItMatters: "Standard procedure, but ensure you don't have any personal data on your work laptop before giving notice.",
    questions: [],
  }
];

export const comparisonData = {
  clauseA: {
    text: "The Employee agrees to provide the Company with a minimum of thirty (30) days' written notice of their intent to resign.",
    source: "Section 9.1"
  },
  clauseB: {
    text: "The Employee agrees to provide the Company with a minimum of sixty (60) days' written notice of their intent to resign (\"Notice Period\").",
    source: "Section 9"
  },
  whatChanged: "The notice requirement has been extended from 30 days to 60 days.",
  whyItMatters: "This doubles the amount of time you are locked into the company after deciding to leave, which could complicate starting a new job."
};

