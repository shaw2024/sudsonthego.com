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
                backgroundColor: isDone ? "#22C55E" : "#CBD5E1"
              }}
            />
            <Text style={{ color: isDone ? "#0F172A" : "#64748B", fontWeight: isDone ? "700" : "500" }}>
              {step.replaceAll("_", " ")}
            </Text>
          </View>
        );
      })}
    </View>
  );
}