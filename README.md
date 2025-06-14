File Flow is a fully responsive, real-time file and text sharing web application that allows users to securely share data within private rooms using AES-256-CBC encryption. Built with a clean UI and features like chat, room customization, and access control, this app is ideal for both casual and controlled sharing sessions.

🚀 Features
🔐 Secure Room-Based Sharing:
Users can create private rooms to start sharing files and text. Each room has a unique encryption key (AES-256-CBC) to encrypt all data before saving it to the database.

☁️ File Storage:
Files are stored securely using Cloudinary or Google Drive, depending on availability.

🔄 Auto-Delete on Room Close:
Files and text are automatically deleted when the room is closed.

📄 Text Download:
Users can download shared text content as a file.

🛠️ Room Customization:

Change username

View number of participants

Set room closing time

Remove guest (can rejoin)

Block guest (cannot rejoin until room is closed)

Restrict room (no one can join without host approval)

Custom room code support (code can’t be changed once created)

💬 Real-Time Chat:
In-room messaging support with smooth UI.

🌗 Light/Dark Mode:
UI comes with both themes for better usability.

🧰 Tech Stack
Category	Technologies Used
Frontend	HTML, CSS, JavaScript
Backend	Python (FastAPI)
Database	PostgreSQL (with ORM), MongoDB (with ORM)
File Storage	Cloudinary / Google Drive
Encryption	AES-256-CBC for data encryption
Others	Git, GitHub, Responsive Design, Dark/Light Themes

⚙️ How It Works
User creates a room (can use a custom code).

A unique encryption key is generated for that room.

User can share files and text within the room.

Chat, edit settings, remove/block participants — all in real-time.

Once the room is closed:

All files and data are deleted

Blocked users can rejoin if same code is reused later
