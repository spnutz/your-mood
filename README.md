# Your Mood Tracker 📝

A beautiful, responsive web application to track your daily mood and emotions. Built with React and Firebase, featuring a clean pastel aesthetic and secure data handling.

![Project Preview](src/assets/login.jpg)

## ✨ Features

- **Mood Logging:** Track your daily mood on a scale of 1-5 with expressive icons.
- **Notes:** Add optional notes to explain your feelings.
- **History View:** Visualize your mood history with weekly and monthly calendar views.
- **Authentication:** Secure Google Sign-In via Firebase Auth.
- **Data Persistence:** Your data is safely stored in Cloud Firestore.
- **Responsive Design:** Fully optimized for desktop and mobile (including hamburger menu).
- **Pastel Theme:** A soothing, consistent pastel color palette for a relaxing experience.

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** CSS Modules, Lucide React (Icons)
- **Backend:** Firebase Authentication, Firestore Database
- **Hosting:** (Ready for deployment)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn or npm
- A Firebase project with Auth (Google) and Firestore enabled

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/your-mood.git
    cd your-mood
    ```

2.  Install dependencies:
    ```bash
    yarn install
    ```

3.  Configure Environment Variables:
    - Create a `.env` file in the root directory.
    - Copy the keys from `.env.example`:
      ```
      VITE_FIREBASE_API_KEY=your_api_key
      VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
      ...
      ```
    - Fill in your actual Firebase credentials.

4.  Start the development server:
    ```bash
    yarn dev
    ```

## 🔐 Environment Variables

This project uses **Environment Variables** to secure Firebase credentials.
**DO NOT** commit your `.env` file to version control.

See `.env.example` for the required keys.

## 📱 Mobile Support

The application is fully responsive. On mobile devices (< 768px), the navigation bar automatically switches to a hamburger menu for better usability.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
