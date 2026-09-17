import { describe, it, expect } from 'vitest';
import { analyzeDocumentContext, UserContext, Clause } from './context-engine';

const mockClauses: Clause[] = [
  {
    id: 'ip',
    category: 'intellectual_property',
    title: 'Intellectual Property',
    section: '7',
    page: 4,
    sourceText: '...',
    plainEnglish: 'Company owns IP.',
    whyItMatters: '...',
    questions: []
  },
  {
    id: 'notice',
    category: 'notice',
    title: 'Notice Period',
    section: '9',
    page: 6,
    sourceText: '...',
    plainEnglish: '60 days notice.',
    whyItMatters: '...',
    questions: []
  },
  {
    id: 'side_projects',
    category: 'side_projects',
    title: 'Outside Activities',
    section: '8',
    page: 5,
    sourceText: '...',
    plainEnglish: 'No moonlighting.',
    whyItMatters: '...',
    questions: []
  },
  {
    id: 'confidentiality',
    category: 'confidentiality',
    title: 'Confidentiality',
    section: '6',
    page: 4,
    sourceText: '...',
    plainEnglish: 'Keep secrets.',
    whyItMatters: '...',
    questions: []
  }
];

describe('Context Engine', () => {
  it('prioritizes IP and Side Projects when selected as priorities', () => {
    const context: UserContext = {
      role: 'Software Engineer',
      intent: 'sign',
      priorities: ['intellectual_property', 'side_projects'],
      concern: ''
    };

    const results = analyzeDocumentContext(context, mockClauses);
    
    // IP and Side projects should be high attention
    expect(results.find(c => c.id === 'ip')?.attention).toBe('high');
    expect(results.find(c => c.id === 'side_projects')?.attention).toBe('high');
    
    // Notice is medium by default
    expect(results.find(c => c.id === 'notice')?.attention).toBe('medium');
    
    // IP should be sorted before notice (high before medium)
    expect(results.findIndex(c => c.id === 'ip')).toBeLessThan(results.findIndex(c => c.id === 'notice'));
  });

  it('shifts focus towards obligations when intent is to resign', () => {
    const context: UserContext = {
      role: 'Software Engineer',
      intent: 'resign',
      priorities: ['intellectual_property'], // Priorities are ignored for resignation
      concern: ''
    };

    const results = analyzeDocumentContext(context, mockClauses);
    
    // Notice and confidentiality become high
    expect(results.find(c => c.id === 'notice')?.attention).toBe('high');
    expect(results.find(c => c.id === 'confidentiality')?.attention).toBe('high');
    
    // IP becomes low because it's not relevant to resignation timeline directly
    expect(results.find(c => c.id === 'ip')?.attention).toBe('low');
    
    // Notice should be sorted first
    expect(results[0].id).toBe('notice');
  });

  it('triggers specific WOW override when concern mentions software projects', () => {
    const context: UserContext = {
      role: 'Software Engineer',
      intent: 'sign',
      priorities: [], // Not explicitly selected
      concern: 'I build software projects outside work.'
    };

    const results = analyzeDocumentContext(context, mockClauses);
    
    // IP and Side Projects are elevated to HIGH because of the concern
    expect(results.find(c => c.id === 'ip')?.attention).toBe('high');
    expect(results.find(c => c.id === 'side_projects')?.attention).toBe('high');
    
    // Notice stays medium
    expect(results.find(c => c.id === 'notice')?.attention).toBe('medium');
  });

  it('handles empty context gracefully', () => {
    const context: UserContext = {
      role: 'Designer',
      intent: 'sign',
      priorities: [],
      concern: ''
    };

    const results = analyzeDocumentContext(context, mockClauses);
    
    // Standard defaults (medium)
    expect(results.find(c => c.id === 'notice')?.attention).toBe('medium');
    expect(results.find(c => c.id === 'ip')?.attention).toBe('medium');
    
    // No high attention items
    expect(results.filter(c => c.attention === 'high').length).toBe(0);
  });
});
