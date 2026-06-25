I want to build a software for my father to handle the paperwork. My father is a self-employed professional who works independently in painting and carpentry. He runs a small business under the name "Decolonia." His process for managing client work follows a specific flow.

# Process Flow for Client Budgets and Invoices
1. The client contacts my father and arranges a visit to the client's home or site.
2. During this visit, the client explains the work they need done.
3. After the visit, my father returns home and creates a budget, summarizing all discussed details.
4. This budget acts as the initial cost estimate, which he provides to the client.
5. If the client approves the budget, my father visits the site again to begin the work.
6. Once the work is completed, he prepares the final invoices to reflect the actual costs.
7. These invoices are then sent to the client, either via email, WhatsApp, or in print, and he receives the payment for the completed job.

# Current Tools and Methods
* For budgets, my father currently uses Microsoft Word, starting from a blank page without any structure.
* He then sends or prints this budget for the client.
* For invoices, he uses Microsoft Excel. He has a template provided by his accountant, which he copies and updates with the new project details.
* He uses both iPad and laptop.

# Initial idea for the software
The software should provide a structured list of clients, so he can keep track of each one and their related budgets and invoices. When he selects a client, the software should allow him to create a budget directly from that client’s information, auto-filling details like address, contact info, and so forth. He should also be able to create invoices both from the budget and independently. The budgets and invoices must be created and edited using a rich text editor within the app (basic formatting: bold, italic, bullet points), and exportable as PDFs from a template and easily shared via WhatsApp, email, or printed. Additionally, he should be able to export all budgets and invoices in batches, for example every three months, so he can send them to his accountant. Another important feature is the ability to register external invoices from other stores—these invoices, whether received by email or scanned, should also be uploaded and categorized. In the future, he wants the software to automatically recognize and import those invoices from his email, so he only scans paper ones. Also, both types of invoices—his own and external—should be exportable in batches, with clear dates and a consistent numbering system. Budgets will increment by one each time, and invoices will use the year plus a sequential number, independent of the client, but tied to the year.
The software may have also a dashboard or something.
The software should be usable with its iPad and laptop.
It should be taken into account that my father is not really good at technology.
The software should be in catalan, spanish and english.
The software should work as a PWA, installable on ipad ("add to home screen") to open like a native app. It should have offline features too: create budgets/invoices while offline, store local pending changes and sync automatically when back online. Not full database replication offline, offline is best effort, not full ERP offline system.
In the future, the software may be enhanced with OCR for scanned invoices, automaticc categorization of expenses, background jobs system (for OCR/email processing).
