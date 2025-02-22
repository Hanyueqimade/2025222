import PDFRotator from '@/components/PDFRotator'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            旋转 PDF 文件
          </h1>
          <p className="text-xl text-gray-600">
            在浏览器中轻松旋转 PDF 文件，完全免费且保护隐私
          </p>
        </div>
        <PDFRotator />
      </div>
    </main>
  )
}

// 添加元数据以优化 SEO
export const metadata = {
  title: '在线旋转 PDF 文件 - 免费且安全的 PDF 旋转工具',
  description: '使用我们免费的在线工具旋转 PDF 文件。无需上传到服务器，所有处理都在您的浏览器中完成，确保文件安全。',
  keywords: 'PDF旋转, PDF工具, 在线PDF, 文档处理, PDF编辑'
}
