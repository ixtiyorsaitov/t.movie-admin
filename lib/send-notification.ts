import { INotification } from "@/types/notification";
import { connectToDatabase } from "./mongoose";
import Notification from "@/models/notification.model";

export async function sendNotification(
  data: Partial<INotification>
): Promise<{ success: boolean; data?: INotification; error?: string }> {
  try {
    await connectToDatabase();
    if (!data.title || !data.message || !data.type) {
      return {
        success: false,
        error: "Ma'lumotlarni to'liq kiriting",
      };
    }

    const notification = await Notification.create(data);
    return { success: true, data: notification };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Bildirishnoma yuborishda xatolik!" };
  }
}
