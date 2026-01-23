import "./globals.css";
import { LayoutWrapper } from "@/components";

export const metadata = {
  title: "PulseStack",
  description: "Reusable layout and component architecture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
