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
  brand3: "#60a5fa"
} as const;

export function BookingDetailsScreen({ navigation }: { navigation: any }) {
  const bookingStatus = "EN_ROUTE";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
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
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  backText: {
    color: COLORS.text,
    fontWeight: "700"
  },
  screenTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800"
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800"
  },
  meta: {
    color: COLORS.textMuted,
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
    color: COLORS.textMuted,
    fontWeight: "600"
  },
  value: {
    color: COLORS.text,
    fontWeight: "700"
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 14
  },
  totalLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800"
  },
  totalValue: {
    color: COLORS.brand3,
    fontSize: 18,
    fontWeight: "900"
  },
  primaryButton: {
    backgroundColor: COLORS.brand,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8
  },
    paddingVertical: 14,
    alignItems: "center"
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15
  }
});
