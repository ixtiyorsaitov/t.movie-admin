import { INotification } from "@/types/notification";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationForm } from "./notification-form";

interface Props {
  data: INotification | null;
}

const NotificationPageMain = ({ data: defaultValue }: Props) => {
  const isEditing = !!defaultValue;

  return (
    <div className="mx-auto">
      <Card className="w-full bg-transparent border-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {isEditing
              ? "Bildirishnomani tahrirlash"
              : "Bildirishnoma yaratish"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationForm defaultValues={defaultValue} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPageMain;
