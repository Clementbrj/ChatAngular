import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importer useNavigate
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";
import "./chat.css";

const Chat = () => {
  const { chatId } = useParams(); // Récupère l'ID du chat à partir de l'URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate(); // Initialiser le hook de navigation

  // Charger les messages du chat
  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Envoyer un message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Vous devez être connecté pour envoyer un message.");
      return;
    }

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage,
        sender: user.uid,
        senderName: user.displayName || "Utilisateur Anonyme", // Ajoute le nom de l'utilisateur
        timestamp: new Date(),
      });
      setNewMessage(""); // Vide le champ de texte
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error.message);
    }
  };

  // Fonction pour revenir en arrière
  const handleGoBack = () => {
    navigate("/chat"); // Retour à la liste des chats
  };

  return (
    <div className="chat-container">
      {/* Bouton de retour */}
      <button onClick={handleGoBack} className="back-button">Retour à la liste</button>

      <h2>Discussion</h2>

      {/* Afficher les messages */}
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="message-bubble">
            <p><strong>{message.senderName} :</strong> {message.text}</p> {/* Affiche le nom de l'utilisateur et le message */}
          </div>
        ))}
      </div>

      {/* Champ pour envoyer un message */}
      <div className="send-message-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Votre message..."
        />
        <button onClick={handleSendMessage}>Envoyer</button>
      </div>
    </div>
  );
};

export default Chat;
