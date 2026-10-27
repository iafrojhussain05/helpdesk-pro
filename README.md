# HelpDesk Pro — IT Support Ticket Management System

A responsive, browser-based IT help desk ticket management demo built with HTML, CSS, Bootstrap 5, and vanilla JavaScript. This is a portfolio/learning project; it does not connect to a real company's service desk or a backend server.

## Features

- Dashboard counters for total, open, in-progress, and resolved tickets
- Create support tickets with requester, title, description, category, and priority
- Automatically generated ticket IDs (for example, `HD-1005`)
- View full ticket details
- Change ticket status between Open, In Progress, and Resolved
- Search tickets by ID, requester, title, description, category, priority, or status
- Filter tickets by status and category
- Delete tickets after confirmation
- Browser persistence using `localStorage`
- Responsive Bootstrap layout for desktop, tablet, and mobile
- Seeded sample tickets so the dashboard is populated on first launch

## Tech stack

- HTML5
- CSS3
- Bootstrap 5.3 (CDN)
- Bootstrap Icons (CDN)
- Vanilla JavaScript
- Browser `localStorage`

## Run locally

1. Download or clone this project folder.
2. Open `index.html` in a modern browser.
3. For the best development workflow, open the folder in VS Code and use the Live Server extension, or run any simple local static server.
4. Internet access is required for the Bootstrap and Bootstrap Icons CDN stylesheets/scripts. The core files are local, but the external CDN assets will not load offline.

No Node.js, database, API key, or build step is required.

## Test checklist

1. Load the page and verify the four dashboard counts match the seeded tickets.
2. Create a ticket with all required fields; verify a new ID is shown and the Open count increases.
3. Search by ticket ID, requester, or part of an issue title.
4. Filter by status and category, and confirm the result count changes.
5. Open View details and verify the full description appears.
6. Change a ticket status and verify the dashboard counters update.
7. Refresh the page and verify changes persist in the same browser.
8. Delete a ticket after confirmation and verify it is removed.
9. Use Reset demo data to restore the sample tickets.
10. Resize the browser to mobile width and check that the table can scroll horizontally and the form remains usable.

## Data and limitations

- Ticket records are stored only in the current browser's `localStorage` on the current device/browser profile.
- There is no authentication, user roles, server-side storage, email notification, SLA timer, or real ticket assignment.
- Sample names and incidents are fictional demo data.
- Clearing browser site data removes locally saved tickets. This prototype should not be used for confidential or real customer data.

## Suggested resume entry

**HelpDesk Pro — IT Support Ticket Management System** | HTML, CSS, JavaScript, Bootstrap

- Built a responsive IT support ticket dashboard with ticket creation, unique ID generation, status updates, and priority/category classification.
- Implemented search, filtering, ticket detail views, deletion confirmation, and dashboard statistics using vanilla JavaScript.
- Used browser `localStorage` to persist ticket records across page refreshes and Bootstrap to create a responsive user interface.

Only include the project on your resume after you have run it, tested the main workflows, and can explain how its code works.

## Future improvements

- Add a Java/Spring Boot or Node.js backend and a database
- Add login and role-based access
- Add ticket assignment, comments, and activity history
- Add SLA tracking, email notifications, and automated tests

## Author

MD Afroj Hussain
