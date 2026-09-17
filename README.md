# Legible

## Chosen Vertical
Legible is designed for **employees reviewing employment agreements (offer letters, contracts, NDAs)**. It specifically helps them navigate complex, dense legal language and understand what terms they are committing to, while taking into account their unique situation.

## Approach and Logic
The fundamental principle of Legible is that **the same document requires different attention depending on the user's context.**

Instead of just summarizing a document generically, Legible's architecture introduces a **Context Engine** that acts as an intermediate layer between the raw agreement and the user interface. 

The logic follows this flow:
1. **Context Acquisition:** The user provides their `Intent` (e.g., "About to sign" vs "Thinking about resigning"), `Role`, `Priorities`, and specific `Concerns`.
2. **Document Ingestion:** A synthetic document is processed and broken down into structured clauses.
3. **Contextual Analysis (The Core Intelligence):** The engine evaluates each clause against the user's context. 
   - If a user is resigning, "Notice Period" and "Post-Employment Restrictions" become High Attention. 
   - If a user is signing and mentions they have personal software projects, "Intellectual Property" and "Side Projects" are elevated.
4. **Actionable Presentation:** The interface renders an "Attention Map," clearly marking clauses as High Attention, Worth Reviewing, or Informational, based *strictly* on the contextual evaluation.

## How the Solution Works
This is a polished, highly responsive frontend prototype built with React, Vite, and Tailwind CSS. It is designed to demonstrate the user experience and conceptual architecture without requiring a backend or live AI API.

Key features include:
*   **Onboarding Flow:** Gathers structured and unstructured user context.
*   **Synthetic Analysis Pipeline:** Simulates document processing and applies the Context Engine rules to sample data.
*   **Attention Map Dashboard:** The main workspace where clauses are prioritized dynamically based on the scenario.
*   **Document Viewer:** A side-by-side view highlighting exactly where the insights come from.
*   **Interactive Chat:** A simulated Q&A feature constrained to the document's contents.
*   **Comparison & Next Steps:** Tools for evaluating changes and preparing for conversations or legal consultations.

## Assumptions Made
*   **Frontend Scope:** We assume for this prototype that the complex NLP extraction of clauses from a raw PDF is handled by a separate, theoretical backend service. The prototype operates on pre-structured JSON data representing the output of that service.
*   **Standard Clauses:** We assume the employment agreement follows a standard structure (IP, Notice, Confidentiality, etc.).
*   **Honest Context:** We assume the user accurately represents their situation and priorities during onboarding.
*   **Not Legal Advice:** We assume the user understands this tool provides insights for clarification and negotiation preparation, and does not replace a qualified legal professional (communicated via explicit UI disclaimers).
