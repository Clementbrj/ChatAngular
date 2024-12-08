import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom"; // Importer useNavigate
import "./chatlist.css";

const ChatList = () => {
  const [chats, setChats] = useState([]); // Chats publics
  const [privateChats, setPrivateChats] = useState([]); // Chats privés
  const [newChatName, setNewChatName] = useState(""); // Nom du chat public
  const [privateChatUserId, setPrivateChatUserId] = useState(""); // ID utilisateur pour chat privé
  const [chatsVisible, setChatsVisible] = useState(true); // true = chats publics, false = chats privés
  const auth = getAuth();
  const user = auth.currentUser; // Récupérer l'utilisateur actuel
  const navigate = useNavigate(); // Initialiser useNavigate

  // Charger les discussions publiques
  useEffect(() => {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("type", "==", "public")); // Filtrer les chats publics
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatsData);
    });
  
    return () => unsubscribe();
  }, []);
  

  // Charger les discussions privées (basées sur l'utilisateur actuel)
  useEffect(() => {
    if (user) {
      const privateChatsRef = collection(db, "chats");
      const q = query(privateChatsRef, where("participants", "array-contains", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const privateChatsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrivateChats(privateChatsData);
      });
  
      return () => unsubscribe();
    }
  }, [user]);
  

  // Ajouter une discussion publique
  const handleAddChat = async () => {
    if (newChatName.trim() === "") return;
    try {
      await addDoc(collection(db, "chats"), { 
        name: newChatName, 
        type: "public" // Indique que ce chat est public
      });
      setNewChatName("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la discussion :", error.message);
    }
  };

  // Ajouter un chat privé
  const handleAddPrivateChat = async () => {
    if (privateChatUserId.trim() === "") return;
  
    try {
      await addDoc(collection(db, "chats"), {
        participants: [user.uid, privateChatUserId],
        type: "private" // Indique que ce chat est privé
      });
      setPrivateChatUserId(""); // Réinitialiser l'ID utilisateur
    } catch (error) {
      console.error("Erreur lors de la création du chat privé :", error.message);
    }
  };
  

  // Supprimer une discussion
  const handleDeleteChat = async (chatId) => {
    try {
      await deleteDoc(doc(db, "chats", chatId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la discussion :", error.message);
    }
  };

  // Fonction de déconnexion
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Déconnexion de l'utilisateur
      navigate("/auth"); // Redirection après déconnexion
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
    <p>Bienvenue, {user.displayName || user.email} !</p>
    <p>Votre UID : {user.uid}</p> {/* Affichage de l'UID */}
    <button onClick={handleSignOut} className="logout-button">
      Se déconnecter
    </button>
  </div>
) : (
  <p>Veuillez vous connecter pour participer aux discussions.</p>
)}


      {/* Onglets pour les chats publics et privés */}
      <div className="chat-tabs">
        <button className="tab-button" onClick={() => setChatsVisible(true)}>
          Chats publics
        </button>
        <button className="tab-button" onClick={() => setChatsVisible(false)}>
          Chats privés
        </button>
      </div>

      {/* Affichage des chats publics */}
      {chatsVisible ? (
        <div className="chat-list">
          <ul>
            {chats.map((chat) => (
              <li key={chat.id} className="chat-item">
                <Link to={`/chat/${chat.id}`} className="chat-link">
                  {chat.name}
                </Link>
                <button
                  onClick={() => handleDeleteChat(chat.id)}
                  className="delete-chat-button"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          {/* Ajouter une discussion publique */}
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
      ) : (
        <div className="chat-list">
          {/* Affichage des chats privés */}
          <ul>
            {privateChats.map((chat) => (
              <li key={chat.id} className="chat-item">
                <Link to={`/chat/${chat.id}`} className="chat-link">
                  Chat privé
                </Link>
                <button
                  onClick={() => handleDeleteChat(chat.id)}
                  className="delete-chat-button"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          {/* Ajouter un chat privé */}
          <div className="add-chat-container">
            <input
              type="text"
              value={privateChatUserId}
              onChange={(e) => setPrivateChatUserId(e.target.value)}
              placeholder="ID utilisateur pour chat privé"
            />
            <button onClick={handleAddPrivateChat}>Créer un chat privé</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;
