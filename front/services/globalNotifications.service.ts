import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter, Platform } from "react-native";

interface GlobalMessageEvent {
  senderId: string;
  roomId: string;
  content: string;
  timestamp: number;
}

class GlobalNotificationsService {
  private static instance: GlobalNotificationsService;
  private readonly EVENT_KEY = "global_message_event";
  private readonly PROCESSED_PREFIX = "processed_";

  static getInstance(): GlobalNotificationsService {
    if (!GlobalNotificationsService.instance) {
      GlobalNotificationsService.instance = new GlobalNotificationsService();
    }
    return GlobalNotificationsService.instance;
  }

  /**
   * Émettre un événement global quand un message est envoyé
   */
  async emitGlobalMessage(event: GlobalMessageEvent): Promise<void> {
    try {
      // Stocker l'événement dans AsyncStorage
      await AsyncStorage.setItem(this.EVENT_KEY, JSON.stringify(event));

      // Émettre un événement React Native pour notifier immédiatement
      DeviceEventEmitter.emit("globalMessageReceived", event);

      console.log(
        `📡 Événement global émis pour la room ${event.roomId} par l'utilisateur ${event.senderId}`
      );
    } catch (error) {
      console.error("Erreur lors de l'émission de l'événement global:", error);
    }
  }

  /**
   * Écouter les événements globaux pour un utilisateur
   */
  async startListening(
    userId: string,
    onMessage: (event: GlobalMessageEvent) => void
  ): Promise<() => void> {
    // Écouter les événements React Native
    const subscription = DeviceEventEmitter.addListener(
      "globalMessageReceived",
      async (event: GlobalMessageEvent) => {
        if (await this.shouldProcessEvent(userId, event)) {
          onMessage(event);
          await this.markEventAsProcessed(userId, event);
        }
      }
    );

    // Vérifier les événements stockés (au cas où on aurait raté quelque chose)
    const checkStoredEvents = async () => {
      try {
        const storedEvent = await AsyncStorage.getItem(this.EVENT_KEY);
        if (storedEvent) {
          const event: GlobalMessageEvent = JSON.parse(storedEvent);
          if (await this.shouldProcessEvent(userId, event)) {
            onMessage(event);
            await this.markEventAsProcessed(userId, event);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification des événements stockés:",
          error
        );
      }
    };

    // Vérifier une fois au démarrage
    checkStoredEvents();

    // Vérifier périodiquement (backup)
    const interval = setInterval(checkStoredEvents, 5000);

    // Retourner une fonction de nettoyage
    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }

  /**
   * Vérifier si un événement doit être traité par cet utilisateur
   */
  private async shouldProcessEvent(
    userId: string,
    event: GlobalMessageEvent
  ): Promise<boolean> {
    // Ne pas traiter ses propres messages
    if (event.senderId === userId) {
      return false;
    }

    // Vérifier si déjà traité
    const processedKey = `${this.PROCESSED_PREFIX}${userId}_${event.timestamp}`;
    const alreadyProcessed = await AsyncStorage.getItem(processedKey);

    return !alreadyProcessed;
  }

  /**
   * Marquer un événement comme traité
   */
  private async markEventAsProcessed(
    userId: string,
    event: GlobalMessageEvent
  ): Promise<void> {
    const processedKey = `${this.PROCESSED_PREFIX}${userId}_${event.timestamp}`;
    await AsyncStorage.setItem(processedKey, "true");
  }

  /**
   * Nettoyer les anciens événements traités (plus de 24h)
   */
  async cleanupOldEvents(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const processedKeys = allKeys.filter((key) =>
        key.startsWith(this.PROCESSED_PREFIX)
      );

      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;

      for (const key of processedKeys) {
        const timestamp = parseInt(key.split("_").pop() || "0");
        if (timestamp < oneDayAgo) {
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error("Erreur lors du nettoyage des anciens événements:", error);
    }
  }
}

export default GlobalNotificationsService.getInstance();
