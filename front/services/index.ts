// Export de l'instance Axios
import instance from "./api";
export { instance };

// Export des services
export * as UserService from "./user.service";

// Vous pourrez ajouter d'autres exports ici au fur et à mesure que vous créerez de nouveaux services
// Par exemple :
// export * as AuthService from "./auth.service";
