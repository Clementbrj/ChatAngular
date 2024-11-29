import React, { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Authpage.css";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [user, setUser] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();

  // Fonction pour inscrire un nouvel utilisateur
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/chat");
    } catch (error) {
      console.error("Erreur d'inscription : ", error.message);
    }
  };

  // Fonction pour connecter un utilisateur
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/chat");
    } catch (error) {
      console.error("Erreur de connexion : ", error.message);
    }
  };

  // Fonction pour envoyer un email de réinitialisation de mot de passe
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Un email de réinitialisation a été envoyé !");
      setIsResetPassword(false);
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe : ", error.message);
    }
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/auth");
    } catch (error) {
      console.error("Erreur lors de la déconnexion : ", error.message);
    }
  };

  // Fonction pour se connecter via Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/chat");
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google : ", error.message);
    }
  };

  // Gérer l'état utilisateur avec onAuthStateChanged
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate("/chat"); // Redirection seulement si l'utilisateur est connecté
      }
    });

    return () => {
      unsubscribe(); // Nettoyage de l'écouteur
    };
  }, [auth, navigate]);

  return (
    <div className="auth-container">
      <h2>
        {user
          ? "Bienvenue"
          : isSignup
          ? "Inscription"
          : isResetPassword
          ? "Réinitialisation du mot de passe"
          : "Connexion"}
      </h2>

      {user ? (
        <div>
          <p>Bienvenue, {user.email}</p>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      ) : (
        <>
          {!isResetPassword && isSignup && (
            <form onSubmit={handleSignup}>
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">S'inscrire</button>
            </form>
          )}

          {!isResetPassword && !isSignup && (
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Se connecter</button>
            </form>
          )}

          {isResetPassword && (
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Envoyer l'email de réinitialisation</button>
            </form>
          )}

          <div>
            {!isResetPassword && (
              <>
                <p onClick={() => setIsSignup(!isSignup)}>
                  {isSignup
                    ? "Déjà un compte ? Se connecter"
                    : "Pas encore inscrit ? S'inscrire"}
                </p>
                <p onClick={() => setIsResetPassword(true)}>
                  Mot de passe oublié ?
                </p>
              </>
            )}

            {isResetPassword && (
              <p onClick={() => setIsResetPassword(false)}>
                Retour à la connexion
              </p>
            )}
          </div>

          <button className="google-btn" onClick={handleGoogleLogin}>
            Se connecter avec Google
          </button>
        </>
      )}
    </div>
  );
};

export default AuthPage;
