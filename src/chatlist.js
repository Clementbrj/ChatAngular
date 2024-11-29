import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth, signOut } from "firebase/auth"; // Importer la fonction signOut
import { Link } from "react-router-dom";
import "./chatlist.css";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [newChatName, setNewChatName] = useState("");
  const auth = getAuth();
  const user = auth.currentUser; // Récupérer l'utilisateur actuel

  // Charger les discussions
  useEffect(() => {
    const chatsRef = collection(db, "chats");
    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      const chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatsData);
    });

    return () => unsubscribe();
  }, []);

  // Ajouter une discussion
  const handleAddChat = async () => {
    if (newChatName.trim() === "") return;
    try {
      await addDoc(collection(db, "chats"), { name: newChatName });
      setNewChatName("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la discussion :", error.message);
    }
  };

  // Supprimer une discussion
  const handleDeleteChat = async (chatId) => {
    try {
      await deleteDoc(doc(db, "chats", chatId));
      console.log("chatId à supprimer :", chatId);
    } catch (error) {
      console.error("Erreur lors de la suppression de la discussion :", error.message);
    }
  };

  // Fonction de déconnexion
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Déconnexion de l'utilisateur
      console.log("Utilisateur déconnecté");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };

  return (
    <div className="chatlist-container">
      <h2>Liste des discussions</h2>

      {/* Vérification si l'utilisateur est connecté */}
      {user ? (
        <div className="user-info">
          <p>Bienvenue, {user.displayName || user.email} !    </p>
          <button onClick={handleSignOut} className="logout-button">Se déconnecter</button>
        </div>
      ) : (
        <p>Veuillez vous connecter pour participer aux discussions.</p>
      )}

      {/* Liste des discussions */}
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="chat-item">
            <Link to={`/chat/${chat.id}`} className="chat-link">
              {chat.name}
            </Link>
            <button onClick={() => handleDeleteChat(chat.id)} className="delete-chat-button">
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      {/* Ajouter une discussion */}
      <div className="add-chat-container">
        <input
          type="text"
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          placeholder="Nom de la nouvelle discussion"
        />
        <button onClick={handleAddChat}>Ajouter</button>
      </div>
    </div>
  );
};

export default ChatList;
