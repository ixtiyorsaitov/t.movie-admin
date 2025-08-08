import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   const session = await getServerSession(authOptions);

  

  return <>{children}</>;
}
