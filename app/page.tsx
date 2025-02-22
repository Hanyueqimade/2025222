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
