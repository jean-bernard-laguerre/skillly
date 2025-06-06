# Guide d'utilisation de la Navbar avec Gradient

## Vue d'ensemble

La nouvelle navbar utilise un design moderne avec :

- **Gradient violet/bleu** (`#8B5CF6` vers `#6366F1`)
- **Design flottant** avec coins arrondis
- **Ombres et effets visuels**
- **Animation sur l'onglet actif** avec fond semi-transparent
- **Badges de notification** pour les messages

## Composants créés

### 1. `CustomTabBar.tsx`

Composant principal de la navbar avec :

- Gradient LinearGradient
- Gestion des états actif/inactif
- Support des badges
- Positionnement flottant

### 2. `ScreenWrapper.tsx`

Wrapper pour les écrans afin d'éviter que le contenu soit caché par la navbar flottante.

## Utilisation

### Dans vos écrans

Enveloppez le contenu de vos écrans avec `ScreenWrapper` :

```tsx
import ScreenWrapper from "@/components/ScreenWrapper";

export default function MonEcran() {
  return <ScreenWrapper>{/* Votre contenu ici */}</ScreenWrapper>;
}
```

### Configuration automatique

La navbar est automatiquement appliquée dans `TabNavigator.tsx` pour tous les rôles :

- Candidats
- Recruteurs
- Utilisateurs non connectés

## Personnalisation

### Couleurs du gradient

Modifiez les couleurs dans `CustomTabBar.tsx` :

```tsx
colors={['#8B5CF6', '#6366F1']} // Violet vers bleu
```

### Hauteur et espacement

Ajustez dans `CustomTabBar.tsx` :

```tsx
height: 70, // Hauteur de la navbar
bottom: insets.bottom + 20, // Marge du bas
```

### Padding des écrans

Modifiez dans `ScreenWrapper.tsx` :

```tsx
paddingBottom: insets.bottom + 100, // Espace pour la navbar
```

## Dépendances ajoutées

- `expo-linear-gradient` : Pour les effets de gradient (compatible Expo)

## Installation

Les dépendances sont déjà installées. `expo-linear-gradient` est compatible avec Expo et ne nécessite pas de configuration native supplémentaire.

## Fonctionnalités

✅ Design moderne avec gradient  
✅ Animation sur sélection  
✅ Support des badges  
✅ Responsive et adaptatif  
✅ Compatible iOS/Android  
✅ Intégration avec React Navigation
