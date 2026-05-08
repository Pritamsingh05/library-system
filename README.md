<h1>The Librarian's Vault<h1>
Bridging the gap between messy spreadsheets and professional inventory management.

🌟 Overview
Most student projects stop at localStorage. This Library Management System takes the leap into full-stack development by implementing a persistent SQLite backend. It’s a lightweight, efficient, and robust solution for tracking book collections without losing data on page refreshes.


✨ Magic Under the Hood

Persistent Storage: No more vanishing data. Every book is stored in a structured SQL database.

Full CRUD Logic: Create, Read, and Delete records through a clean REST API.

Responsive UI: A sleek, user-centric dashboard designed for librarians who value speed.

Middleware Powered: Built with Express.js to ensure smooth communication between the browser and the server.

🛠️ The Engine Room (Tech Stack)

Component	Technology
Frontend	HTML5, CSS3(Custom Styles), JavaScript
Server	Node.js & Express.js
Database	SQLite3 (Persistent .db storage)
Communication	Fetch API / JSON


📂 Project Blueprint

Library-system/
├── server.js          # The "Brain"

├── package.json       # Project dependencies & scripts

├── library.db         # The "Vault"

└── public/            # The "Face"
   
    ├── index.html     
    
    ├── style.css      
    
    └── script.js


🚀 Deployment (How to Run)

1.Clone the Vault: git clone https://github.com/Pritamsingh05/library-system.git

2.Fuel Up (Install Dependencies): npm install

3.Ignition: node server.js

4.Access the Dashboard:
Open http://localhost:3000 in your favorite browser.

🧠 Dev Notes: Why SQLite?

I chose SQLite for this project because it offers the power of a traditional SQL database without the overhead of a separate server. It allows the project to be portable—the database is just a file—making it perfect for local management systems.

👨‍💻 Author
Pritam Singh Aspiring Developer | Explorer of SQL & Node.js
