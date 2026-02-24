import React from "react";
import { Text, View } from "react-native";

const statusColors: Record<string, string> = {
  SCHEDULED: "#64748B",
  WASHER_ASSIGNED: "#0EA5E9",
  EN_ROUTE: "#F59E0B",
  ARRIVED: "#14B8A6",
  IN_PROGRESS: "#6366F1",
  COMPLETED: "#22C55E",
  CANCELLED: "#EF4444"
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <View
      style={{
        backgroundColor: statusColors[status] ?? "#334155",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignSelf: "flex-start"
      }}
    >
      <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>{status.replaceAll("_", " ")}</Text>
    </View>
  );
}