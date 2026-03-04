import React from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "../components/StatusBadge";
import { StatusTimeline } from "../components/StatusTimeline";

const COLORS = {
  background: "#05091a",
  surface: "rgba(14, 22, 52, 0.70)",
  surface2: "rgba(14, 22, 52, 0.95)",
  border: "rgba(99, 138, 220, 0.18)",
  text: "#eef2ff",
  textMuted: "#8fa8d4",
  textXs: "#6481a8",
  brand: "#3b82f6",
  brand2: "#1d4ed8",
  brand3: "#60a5fa",
  mint: "#34d399",
  amber: "#fbbf24"
} as const;

const quickActions = ["Book Wash", "Track Washer", "Payment", "Support"];

export function HomeScreen({ navigation }: { navigation: any }) {
  const activeStatus = "EN_ROUTE";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>SudsOnTheGo</Text>
          <Text style={styles.heroTitle}>Your car wash, right where you are.</Text>
          <Text style={styles.heroSubtitle}>
            Schedule, track, and pay in one place with real-time washer updates.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("BookingDetails")}
          >
            <Text style={styles.ctaText}>Book a New Wash</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Current Booking</Text>
            <StatusBadge status={activeStatus} />
          </View>
          <Text style={styles.metaText}>Toyota Camry • Premium Exterior + Interior</Text>
          <Text style={styles.metaText}>Today, 2:30 PM • 14 min away</Text>
          <StatusTimeline status={activeStatus} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((label) => (
              <TouchableOpacity
                key={label}
                style={styles.quickAction}
                activeOpacity={0.85}
                onPress={() => {
                  if (label === "Track Washer") {
                    navigation.navigate("BookingDetails");
                  }
                }}
              >
                <Text style={styles.quickActionText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Washes Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4.9★</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 28
  },
  heroCard: {
    backgroundColor: COLORS.surface2,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  kicker: {
    color: COLORS.brand3,
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 8,
    letterSpacing: 0.6,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    marginBottom: 10
  },
  heroSubtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18
  },
  ctaButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.brand,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8
  },
  ctaText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800"
  },
  metaText: {
    marginTop: 6,
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: "500"
  },
  quickGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  quickAction: {
    minWidth: "48%",
    flexGrow: 1,
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.25)",
    paddingVertical: 14,
    paddingHorizontal: 12
  },
  quickActionText: {
    color: COLORS.brand3,
    fontWeight: "700",
    textAlign: "center"
  },
  statsRow: {
    flexDirection: "row",
    gap: 10
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center"
  },
  statValue: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4
  },
  statLabel: {
    color: COLORS.textMuted,
    fontWeight: "600"
  }
});
