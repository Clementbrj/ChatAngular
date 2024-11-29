import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChatList from "./chatlist";
import Chat from "./chat";
import AuthPage from "./Authpage"; // Page de connexion/authentification
import "./App.css"; // Style général de l'application

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Barre de navigation */}
        <nav className="navbar">
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link to="/" className="navbar-link">Accueil</Link>
            </li>
            <li className="navbar-item">
              <Link to="/auth" className="navbar-link">Connexion/Chat</Link>
            </li>
          </ul>
        </nav>

        {/* Contenu des routes */}
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="home-page">
                <h1>Bienvenue sur notre application de chat en temps réel !</h1>
                <p>Connectez-vous pour rejoindre la discussion ou inscrivez-vous si vous êtes nouveau.</p>
                <Link to="/auth" className="cta-button">Commencez maintenant</Link>
              </div>
            } 
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/chat" element={<ChatList />} />
          {/* Route modifiée avec un paramètre dynamique pour l'ID du chat */}
          <Route path="/chat/:chatId" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
