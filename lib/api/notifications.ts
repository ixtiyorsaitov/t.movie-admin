import api from "../axios";

export async function getNotifications(limit: number) {
  const { data: res } = await api.get(`/notifications?limit=${limit}`);
  return res;
}

export async function getNotification(notificationId: string) {
  const { data: res } = await api.get(`/notifications/${notificationId}`);
  return res;
}
