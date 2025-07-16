# 💬 Système de Gestion des Messages Non Lus

## 🎯 Vue d'ensemble

Ce système permet de gérer les badges de messages non lus dans l'application Skillly, avec une approche moderne utilisant React Context et des hooks personnalisés.

## 🏗️ Architecture

### 📁 Fichiers principaux

```
front/
├── context/
│   └── UnreadMessagesContext.tsx     # Contexte global des messages non lus
├── lib/hooks/
│   └── useGlobalUnreadMessages.ts    # Hooks pour la gestion globale
├── app/(protected)/messages/components/
│   ├── MessagesList.tsx              # Liste des conversations avec badges
│   ├── ChatroomItem.tsx              # Item de conversation avec badge
│   └── Chatroom.tsx                  # Vue de conversation (marque comme lu)
└── navigation/
    └── CustomTabBar.tsx              # Navigation avec badge global
```

## ⚙️ Fonctionnalités

### ✅ Implémentées

1. **Badge global** sur l'onglet Messages de la navigation
2. **Badge par conversation** dans la liste des messages
3. **Stockage persistant** avec AsyncStorage
4. **Marquage automatique comme lu** quand l'utilisateur entre dans une conversation
5. **Bouton de test** pour simuler des messages non lus (mode développement)

### 🔄 À implémenter (backend requis)

1. **WebSocket global** pour recevoir tous les messages de l'utilisateur
2. **API pour récupérer** les compteurs initiaux depuis le serveur
3. **Synchronisation** avec le backend pour la persistance

## 🚀 Utilisation

### 📝 Context Provider

Le `UnreadMessagesProvider` est déjà configuré dans `app/_layout.tsx` :

```tsx
<AuthProvider>
  <UnreadMessagesProvider>
    <App />
  </UnreadMessagesProvider>
</AuthProvider>
```

### 🎣 Hook principal

```tsx
import { useUnreadMessages } from "@/context/UnreadMessagesContext";

function MyComponent() {
  const {
    unreadCountByRoom, // Compteurs par conversation
    totalUnreadCount, // Compteur total
    markRoomAsRead, // Marquer comme lu
    incrementUnreadCount, // Incrémenter compteur
    setUnreadCount, // Définir compteur
  } = useUnreadMessages();
}
```

## 📊 Données et Stockage

### 💾 Stockage local

Les compteurs sont automatiquement sauvegardés dans AsyncStorage avec la clé :

```
unread_messages_{userId}
```

### 🔄 Format des données

```typescript
{
  "1": 3,    // Conversation 1 : 3 messages non lus
  "2": 1,    // Conversation 2 : 1 message non lu
  "5": 12    // Conversation 5 : 12 messages non lus
}
```

## 🌐 Intégration Backend (TODO)

### 📡 WebSocket Global

```typescript
// Endpoint suggéré
const wsUrl = `/ws/user/${userId}`;

// Message reçu
{
  "sender": "123",
  "content": "Hello!",
  "roomId": "456",
  "sent_at": "2024-01-01T10:00:00Z"
}
```

### 🗄️ API Endpoints

```typescript
// Récupérer les compteurs initiaux
GET /api/messages/unread-counts

// Marquer une conversation comme lue
POST /api/messages/mark-read
{
  "roomId": "123"
}
```

## 🎨 Customisation

### 🏷️ Style des badges

Les badges utilisent les couleurs :

- **Rouge** : `#EF4444` pour les messages non lus
- **Blanc** : bordure et texte
- **Ombre** : pour la profondeur

### 📐 Responsive

Les badges s'adaptent automatiquement :

- **Taille minimale** : 20x20px
- **Format 99+** pour les nombres > 99
- **Positionnement** adaptatif selon l'état

## 🐛 Dépannage

### ❌ Badge ne s'affiche pas

1. Vérifiez que le `UnreadMessagesProvider` englobe votre composant
2. Assurez-vous que l'utilisateur est connecté
3. Utilisez le bouton de test en mode dev

### 🔄 Badge ne se met pas à jour

1. Vérifiez les dépendances des `useEffect`
2. Assurez-vous que `markRoomAsRead` est appelé
3. Vérifiez les logs de AsyncStorage

### 📱 Badge ne persiste pas

1. Vérifiez les permissions AsyncStorage
2. Contrôlez les logs d'erreur de sauvegarde
3. Vérifiez que l'ID utilisateur est disponible

## 📋 Checklist d'implémentation complète

- [x] Context de gestion des messages non lus
- [x] Badge global sur la navigation
- [x] Badge par conversation
- [x] Stockage persistant local
- [x] Marquage automatique comme lu

- [ ] WebSocket global backend
- [ ] API pour compteurs initiaux
- [ ] Synchronisation backend
- [ ] Tests unitaires
- [ ] Documentation backend

## 🎯 Prochaines étapes

1. **Implémenter l'endpoint WebSocket global** sur le backend
2. **Ajouter l'API** pour récupérer les compteurs initiaux
3. **Synchroniser** les actions avec le backend
4. **Optimiser** les performances pour de nombreuses conversations
5. **Ajouter des tests** unitaires et d'intégration

---

💡 **Astuce** : Le système WebSocket global est maintenant fonctionnel et remplace la simulation !
