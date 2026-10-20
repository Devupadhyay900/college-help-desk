# CampusCare — AI-Powered Smart College Help Desk System

Responsive front-end project built with separate HTML, CSS, and JavaScript files.

## Features
- Student portal dashboard with total, pending, and resolved request counts
- Submit complaints/requests with unique IDs
- Search and filter by status and category
- Keyword-based category suggestion
- Demo admin dashboard to update complaint status
- Local demo notifications on submission/status changes
- Built-in FAQ chatbot about the website and help desk workflow
- Responsive mobile and desktop layout
- Browser localStorage persistence

## Run
1. Extract the ZIP.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in a browser, or use VS Code + Live Server.

## Important
This is a front-end prototype. It does not implement real student registration/login, shared server storage, secure admin authentication, email/SMS notifications, or a live generative AI model. The chatbot uses built-in FAQ rules and the category suggestion uses keywords. Data stays in the current browser; do not enter confidential student data.

For production, add a backend, database, secure authentication and role-based authorization, server-side validation, real notifications, and a server-side AI API endpoint. Never expose an AI API key in browser JavaScript.
