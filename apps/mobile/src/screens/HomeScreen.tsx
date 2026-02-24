import React from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "../components/StatusBadge";
import { StatusTimeline } from "../components/StatusTimeline";

const COLORS = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  ink: "#0F172A",
  muted: "#64748B",
  subtle: "#E2E8F0",
  accent: "#0EA5E9",
  success: "#22C55E"
} as const;

const quickActions = ["Book Wash", "Track Washer", "Payment", "Support"];

export function HomeScreen({ navigation }: { navigation: any }) {
  const activeStatus = "EN_ROUTE";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

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
    backgroundColor: COLORS.ink,
    borderRadius: 20,
    padding: 20
  },
  kicker: {
    color: COLORS.accent,
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 8,
    letterSpacing: 0.6,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    marginBottom: 10
  },
  heroSubtitle: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18
  },
  ctaButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  ctaText: {
    color: "#052E16",
    fontWeight: "800",
    fontSize: 15
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.subtle
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  sectionTitle: {
    color: COLORS.ink,
    fontSize: 18,
    fontWeight: "800"
  },
  metaText: {
    marginTop: 6,
    color: COLORS.muted,
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
    backgroundColor: "#EEF6FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C7E6FF",
    paddingVertical: 14,
    paddingHorizontal: 12
  },
  quickActionText: {
    color: "#0C4A6E",
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
    borderColor: COLORS.subtle,
    alignItems: "center"
  },
  statValue: {
    color: COLORS.ink,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4
  },
  statLabel: {
    color: COLORS.muted,
    fontWeight: "600"
  }
});
