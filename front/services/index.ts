// Export de l'instance Axios
import instance from "./api";
export { instance };

// Export des services
export * as UserService from "./user.service";
export * as SkillService from "./skill.service";
export * as AuthService from "./auth.service";
export * as CertificationService from "./certification.service";
export * as MessageService from "./message.service";
