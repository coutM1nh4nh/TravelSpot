# TravelSpot

TravelSpot is a web application for discovering, sharing, and managing travel destinations.  
It allows users to explore spots on an interactive map, upload images, write reviews, and connect with other travelers.

---

## ✨ Features
- **User Authentication**: Register, login, and manage accounts with Passport.js.
- **CRUD Operations**: Create, read, update, and delete travel spots.
- **Image Uploads**: Integrated with Cloudinary for storing and managing images.
- **Geocoding & Maps**: Powered by MapTiler to display spots on an interactive cluster map.
- **Reviews System**: Users can leave reviews and ratings for each spot.
- **Responsive UI**: Built with Bootstrap and EJS templates for a clean, mobile-friendly interface.
- **Security**: Helmet for HTTP security headers, input validation & sanitization, authentication with Passport.js, and session storage using connect-mongo.

---

## 🛠️ Tech Stack
- **Frontend**: EJS, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Passport.js (Local Strategy)
- **Image Hosting**: Cloudinary
- **Maps & Geocoding**: MapTiler API
- **Deployment**: Render
- **Validation**: Joi
- **Security**: Helmet

## 📌 Project Goals
- Provide a platform for travelers to share and discover destinations.
- Visualize spots on an interactive map with clustering.
- Enable community-driven reviews and recommendations.

## 📌 Future Improvements
- Trip planning
- Favorites
- Search & filters
- Multi-language support

## 📷 Screenshots
<h1>Home</h1>
<p align="center">
<img src="screenshort/home.png" width="90%">
</p>
<h1>Login</h1>
<p align="center">
<img src="screenshort/login.png" width="90%">
</p>
<h1>Spot List</h1>
<p align="center">
<img src="screenshort/spots.png" width="90%">
</p>
<h1>Spot Details</h1>
<p align="center">
<img src="screenshort/detail.png" width="90%">
</p>
<h1>Interactive Map</h1>
<p align="center">
<img src="screenshort/map.png" width="90%">
</p>

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/coutM1nh4nh/TravelSpot
```

Navigate to the project directory

```bash
cd TravelSpot
```

Install dependencies

```bash
npm install
```

Create a `.env` file and configure the required environment variables.

Start the application

```bash
npm start
```

Visit:

```
http://localhost:3000
```