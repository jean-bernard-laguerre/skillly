import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { Match } from "@/types/interfaces";
import {
  ArrowLeft,
  Heart,
  User,
  Mail,
  MapPin,
  Briefcase,
} from "lucide-react-native";

interface MatchesListProps {
  jobId: string;
  onBack: () => void;
}

export default function MatchesList({ jobId, onBack }: MatchesListProps) {
  const { matches } = useJobPost();
  const job = matches?.find((job) => job.id === jobId);

  return (
    <View style={styles.container}>
      {/* Header moderne */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#7C3AED", "#8B5CF6"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Pressable onPress={onBack} style={styles.backButton}>
              <ArrowLeft size={20} color="white" />
              <Text style={styles.backText}>Retour</Text>
            </Pressable>
            <View style={styles.titleSection}>
              <Heart size={24} color="white" />
              <Text style={styles.jobTitle}>{job?.title}</Text>
              <Text style={styles.matchCount}>
                {job?.matches?.length || 0} match
                {(job?.matches?.length || 0) > 1 ? "es" : ""}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {!job?.matches || job.matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Heart size={40} color="#6B7280" />
            </View>
            <Text style={styles.emptyTitle}>Aucun match pour ce poste</Text>
            <Text style={styles.emptySubtitle}>
              Les matches apparaîtront ici après validation des candidatures
            </Text>
          </View>
        ) : (
          job.matches.map((match: Match) => (
            <View key={match.id} style={styles.matchCard}>
              <LinearGradient
                colors={["#FFFFFF", "#F8FAFC"]}
                style={styles.matchCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Header de la carte */}
                <View style={styles.matchCardHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                      <User size={24} color="#7C3AED" />
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>
                        {match.candidate.user.first_name}{" "}
                        {match.candidate.user.last_name}
                      </Text>
                      <Text style={styles.userRole}>Candidat matched</Text>
                    </View>
                  </View>
                  <View style={styles.matchBadge}>
                    <Heart size={16} color="white" />
                  </View>
                </View>

                {/* Informations de contact */}
                <View style={styles.contactSection}>
                  <View style={styles.infoRow}>
                    <Mail size={16} color="#6B7280" />
                    <Text style={styles.infoText}>
                      {match.candidate.user.email}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.infoText}>
                      Localisation non renseignée
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Briefcase size={16} color="#6B7280" />
                    <Text style={styles.infoText}>
                      Expérience non renseignée
                    </Text>
                  </View>
                </View>

                {/* Compétences */}
                {match.candidate.skills &&
                  match.candidate.skills.length > 0 && (
                    <View style={styles.skillsSection}>
                      <Text style={styles.sectionTitle}>Compétences</Text>
                      <View style={styles.skillsContainer}>
                        {match.candidate.skills.slice(0, 4).map((skill) => (
                          <View key={skill.id} style={styles.skillBadge}>
                            <Text style={styles.skillText}>{skill.name}</Text>
                          </View>
                        ))}
                        {match.candidate.skills.length > 4 && (
                          <View style={styles.skillBadgeExtra}>
                            <Text style={styles.skillTextExtra}>
                              +{match.candidate.skills.length - 4}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                {/* Statut du match */}
                <View style={styles.dateSection}>
                  <Text style={styles.dateText}>
                    Match confirmé - Candidat approuvé
                  </Text>
                </View>
              </LinearGradient>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  headerContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  headerGradient: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    padding: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  titleSection: {
    alignItems: "center",
    gap: 8,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  matchCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    backgroundColor: "#F3F4F6",
    borderRadius: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  matchCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  matchCardGradient: {
    borderRadius: 12,
    padding: 16,
  },
  matchCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: "#7C3AED",
    fontWeight: "600",
  },
  matchBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  contactSection: {
    marginBottom: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  skillsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  skillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  skillBadgeExtra: {
    backgroundColor: "#6B7280",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillTextExtra: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  dateSection: {
    backgroundColor: "rgba(124, 58, 237, 0.05)",
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#7C3AED",
  },
  dateText: {
    fontSize: 12,
    color: "#7C3AED",
    fontWeight: "600",
  },
});
