import React from "react";
import { Text, View } from "react-native";

const steps = ["SCHEDULED", "WASHER_ASSIGNED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS", "COMPLETED"];

export function StatusTimeline({ status }: { status: string }) {
  const activeIndex = steps.indexOf(status);

  return (
    <View style={{ marginTop: 12 }}>
      {steps.map((step, index) => {
        const isDone = activeIndex >= index;
        return (
          <View key={step} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginRight: 10,
                backgroundColor: isDone ? "#34d399" : "rgba(99, 138, 220, 0.3)"
              }}
            />
            <Text style={{ color: isDone ? "#eef2ff" : "#8fa8d4", fontWeight: isDone ? "700" : "500" }}>
              {step.replaceAll("_", " ")}
            </Text>
          </View>
        );
      })}
    </View>
  );
}