import React from "react";
import { Text, View } from "react-native";

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  SCHEDULED: { bg: "rgba(99, 138, 220, 0.12)", text: "#60a5fa", border: "rgba(99, 138, 220, 0.25)" },
  WASHER_ASSIGNED: { bg: "rgba(59, 130, 246, 0.12)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.25)" },
  EN_ROUTE: { bg: "rgba(251, 191, 36, 0.12)", text: "#fbbf24", border: "rgba(251, 191, 36, 0.25)" },
  ARRIVED: { bg: "rgba(52, 211, 153, 0.12)", text: "#34d399", border: "rgba(52, 211, 153, 0.25)" },
  IN_PROGRESS: { bg: "rgba(168, 85, 247, 0.12)", text: "#a855f7", border: "rgba(168, 85, 247, 0.25)" },
  COMPLETED: { bg: "rgba(52, 211, 153, 0.12)", text: "#34d399", border: "rgba(52, 211, 153, 0.25)" },
  CANCELLED: { bg: "rgba(248, 113, 113, 0.12)", text: "#f87171", border: "rgba(248, 113, 113, 0.25)" }
};

export function StatusBadge({ status }: { status: string }) {
  const colors = statusColors[status] ?? { bg: "rgba(99, 138, 220, 0.12)", text: "#8fa8d4", border: "rgba(99, 138, 220, 0.25)" };
  
  return (
    <View
      style={{
        backgroundColor: colors.bg,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignSelf: "flex-start",
        borderWidth: 1,
        borderColor: colors.border
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "700", fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>
        {status.replaceAll("_", " ")}
      </Text>
    </View>
  );
}