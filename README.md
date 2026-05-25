# 🌐 SocialApp

A modern **MERN-based Social Media Platform** where users can register, create posts, upload images, like posts, and interact through comments in a clean and responsive interface.

---

## 🚀 Features

### 🔐 Authentication System

- User Registration & Login
- Secure password hashing using **bcryptjs**
- JWT-based Authentication
- Protected Routes

### 📝 Post System

- Create **text posts**
- Upload **image posts**
- Text + Image combined posts
- Real-time feed updates

### ❤️ Like System

- Like / Unlike posts
- Dynamic like counter
- Multi-user interaction support

### 💬 Comment System

- Add comments to posts
- Real-time comment updates
- Multi-user comments support

### ☁️ Cloudinary Integration

- Image uploads using **Cloudinary**
- Secure cloud image storage

### 📱 Responsive UI

- Clean modern UI
- Mobile-friendly design
- Toast notifications for better UX

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ React.js
- 🎨 Tailwind CSS
- 🔄 Axios
- 🧭 React Router DOM
- 🔔 React Hot Toast

### Backend

- 🟢 Node.js
- 🚀 Express.js
- 🍃 MongoDB Atlas
- 📦 Mongoose
- 🔑 JWT Authentication
- 🔒 bcryptjs
- ☁️ Cloudinary
- 📤 Multer

---

## 📸 Features Preview

✅ User Authentication  
✅ Create Posts  
✅ Upload Images  
✅ Like / Unlike Posts  
✅ Comment System  
✅ Real-time Feed  
✅ Multi-user Interaction

---

## 📂 Project Structure

```bash
SocialApp/
│── client/        # React Frontend
│── server/        # Express Backend
│── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/socialapp-mern.git
cd socialapp-mern
```

---

### 2️⃣ Install Dependencies

#### Client

```bash
cd client
npm install
```

#### Server

```bash
cd server
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file inside the **server** folder.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 4️⃣ Run Project

#### Start Backend

```bash
cd server
npm run dev
```

#### Start Frontend

```bash
cd client
npm run dev
```

---

## 🌍 Future Improvements

- 👤 User Profile Page
- ➕ Follow / Unfollow System
- 🖼️ Profile Picture Upload
- 📩 Messaging System
- 🔍 Search Users

---

## Live Demo

Frontend:
https://socialapp-mern.vercel.app/

Backend API:
https://socialapp-backend-acv1.onrender.com

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork the project and improve it.

---

## 📜 License

This project is built for learning and educational purposes.

---

## 👨‍💻 Developer

Built with ❤️ by **Sourasish Biswas**
