import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "在线旋转 PDF 文件 - 免费且安全的 PDF 旋转工具",
    template: "%s | PDF 旋转工具"
  },
  description: "使用我们免费的在线工具旋转 PDF 文件。无需上传到服务器，所有处理都在您的浏览器中完成，确保文件安全。",
  keywords: ["PDF旋转", "PDF工具", "在线PDF", "文档处理", "PDF编辑", "免费工具"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Name",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
