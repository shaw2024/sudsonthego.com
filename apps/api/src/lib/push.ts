import { Expo } from "expo-server-sdk";
import { prisma } from "./prisma";

const expo = new Expo();

export async function sendPushToUser(userId: string, title: string, body: string, data?: Record<string, any>) {
  const tokens = await prisma.pushToken.findMany({ where: { userId } });
  const messages = tokens
    .map((entry) => entry.token)
    .filter((token) => Expo.isExpoPushToken(token))
    .map((token) => ({
      to: token,
      sound: "default" as const,
      title,
      body,
      data
    }));

  if (!messages.length) {
    return;
  }

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }
}