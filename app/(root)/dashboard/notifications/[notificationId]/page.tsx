import React from "react";
import { getNotification } from "@/lib/api/notifications";
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
    const data = await getNotification(notificationId);
    if (data.error) throw new Error(data.error);

    defaultData = data.data;
  }

  return <NotificationPageMain data={defaultData} />;
};

export default NotificationPage;
