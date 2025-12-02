import api from "../axios";
import { SITE_URL } from "../constants";

export async function getNotifications(limit: number) {
  const { data: res } = await api.get(`/notifications?limit=${limit}`);

  return res;
}

export async function getNotification(notificationId: string) {
  const req = await fetch(`${SITE_URL}/api/notifications/${notificationId}`);
  const res = await req.json();
  return res;
}

export async function createNotification(data: any) {
  const { data: res } = await api.post(`/notifications`, data);
  return res;
}

export async function updateNotification({
  data,
  id,
}: {
  data: any;
  id: string;
}) {
  const { data: res } = await api.patch(`/notifications/${id}`, data);
  return res;
}

export async function deleteNotification(notificationId: string) {
  const { data: res } = await api.delete(`/notifications/${notificationId}`);
  return res;
}

export async function markNotificationRead(notificationId: string) {
  const { data: res } = await api.post(`/notifications/mark-read`, {
    notificationId,
  });
  return res;
}

export async function getNotificationFilmSubscribers(filmId: string) {
  const { data: res } = await api.post(`/notifications/film-subscribers`, {
    filmId,
  });
  return res;
}

export async function getNotificationFilmBatches(filmId: string) {
  const { data: res } = await api.get(`/notifications/film/${filmId}`);
  return res;
}
