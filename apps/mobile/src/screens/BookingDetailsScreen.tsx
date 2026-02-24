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
  accent: "#0EA5E9"
} as const;

export function BookingDetailsScreen({ navigation }: { navigation: any }) {
  const bookingStatus = "EN_ROUTE";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.85}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Booking Details</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.statusRow}>
            <Text style={styles.cardTitle}>Order #SUDS-12984</Text>
            <StatusBadge status={bookingStatus} />
          </View>
          <Text style={styles.meta}>Washer: Alex M.</Text>
          <Text style={styles.meta}>Vehicle: Toyota Camry</Text>
          <Text style={styles.meta}>Scheduled: Today • 2:30 PM</Text>
          <Text style={styles.meta}>Address: 2400 Main St, Houston, TX</Text>
          <StatusTimeline status={bookingStatus} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Premium Exterior + Interior</Text>
            <Text style={styles.value}>$48.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Eco Add-on</Text>
            <Text style={styles.value}>$6.00</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>$54.00</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
          <Text style={styles.primaryText}>Contact Washer</Text>
        </TouchableOpacity>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  backButton: {
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  backText: {
    color: COLORS.ink,
    fontWeight: "700"
  },
  screenTitle: {
    color: COLORS.ink,
    fontSize: 24,
    fontWeight: "800"
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.subtle,
    padding: 16
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  cardTitle: {
    color: COLORS.ink,
    fontSize: 18,
    fontWeight: "800"
  },
  meta: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12
  },
  label: {
    color: COLORS.muted,
    fontWeight: "600"
  },
  value: {
    color: COLORS.ink,
    fontWeight: "700"
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.subtle,
    paddingTop: 12,
    marginTop: 14
  },
  totalLabel: {
    color: COLORS.ink,
    fontSize: 16,
    fontWeight: "800"
  },
  totalValue: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "900"
  },
  primaryButton: {
    backgroundColor: COLORS.ink,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center"
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15
  }
});
