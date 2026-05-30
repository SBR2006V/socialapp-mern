# 🌐 SocialApp

A full-stack **Social Media Platform** built with the MERN stack. Users can register, create posts, interact through likes and comments, follow other users, and manage their profiles — all in a clean, responsive interface.

**Live Demo:** [socialapp-mern.vercel.app](https://socialapp-mern.vercel.app)  
**Backend API:** [socialapp-backend-acv1.onrender.com](https://socialapp-backend-acv1.onrender.com)

> ⚠️ The backend runs on Render's free tier and may take 30–60 seconds to wake up on first request.

---

## ✅ Features

### 🔐 Authentication

- User Registration & Login
- Secure password hashing with **bcryptjs**
- JWT-based authentication
- Protected routes

### 👤 User Profiles

- View any user's profile and their posts
- Upload and update profile picture
- Edit username and bio
- Profile picture fallback with initials avatar

### 📝 Posts

- Create text posts, image posts, or both
- Upload images via **Cloudinary**
- Delete your own posts (with confirmation modal)
- Real-time feed updates without page refresh

### ❤️ Like System

- Like / Unlike posts
- Live like counter
- Multi-user support

### 💬 Comments

- Add comments to any post
- Collapsible comment section per post
- Submit via button or Enter key
- Multi-user comment support

### 👥 Follow System

- Follow / Unfollow other users
- Live follower and following count updates
- Follow button hidden on your own posts

### 🎨 UI/UX

- Clean, modern design with **Tailwind CSS**
- Fully responsive layout
- Toast notifications for all user actions
- Custom delete confirmation modal
- Profile pictures shown beside usernames in the feed

---

## 🛠️ Tech Stack

| Layer         | Technology                                                       |
| ------------- | ---------------------------------------------------------------- |
| Frontend      | React.js, Tailwind CSS, React Router DOM, Axios, React Hot Toast |
| Backend       | Node.js, Express.js                                              |
| Database      | MongoDB Atlas, Mongoose                                          |
| Auth          | JWT, bcryptjs                                                    |
| Image Storage | Cloudinary, Multer                                               |
| Deployment    | Vercel (frontend), Render (backend)                              |

---

## 📂 Project Structure

```
SocialApp/
├── client/                  # React frontend
│   └── src/
│       ├── pages/           # Home, Login, Register, Profile
│       ├── components/      # Navbar
│       └── services/        # Axios API instance
└── server/                  # Express backend
    └── src/
        ├── controllers/     # authController, postController
        ├── middleware/       # authMiddleware, uploadMiddleware
        ├── models/          # User, Post
        └── routes/          # authRoutes, postRoutes
```

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SBR2006V/socialapp-mern.git
cd socialapp-mern
```

### 2. Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file inside the `client/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Project

```bash
# Start backend (from /server)
npm run dev

# Start frontend (from /client)
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:5000`

---

## 🔮 Planned Features

- 🔍 Search users
- 🔔 Notifications (likes, comments, follows)
- 📩 Direct messaging
- ⏱️ Post timestamps ("2 hours ago")
- ✏️ Edit post after publishing
- 📄 Infinite scroll / pagination

---

## 📜 License

Built for learning and educational purposes.

---

## 👨‍💻 Developer

Built with ❤️ by **Sourasish Biswas**  
[GitHub](https://github.com/SBR2006V)
