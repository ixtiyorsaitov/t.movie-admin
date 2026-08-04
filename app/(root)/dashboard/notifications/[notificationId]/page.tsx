import React from "react";
import { serverFetch } from "@/lib/server-fetch";
import { INotification } from "@/types/notification";
import NotificationPageMain from "../components/notification-page";
export const dynamic = "force-dynamic";
const NotificationPage = async ({
  params,
}: {
  params: Promise<{ notificationId: string }>;
}) => {
  const { notificationId } = await params;
  let defaultData: null | INotification = null;
  if (notificationId !== "create") {
    const res = await serverFetch(`/api/notifications/${notificationId}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    defaultData = data.data;
  }

  return <NotificationPageMain data={defaultData} />;
};

export default NotificationPage;
