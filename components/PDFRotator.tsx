'use client'

import { useState, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { PDFDocument, degrees } from 'pdf-lib'
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFRotatorProps {
  file?: File;
}

export default function PDFRotator({ file: propFile }: PDFRotatorProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageRotations, setPageRotations] = useState<{ [key: number]: number }>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [file, setFile] = useState<File | undefined>(propFile)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setError('')
    setIsLoading(false)
  }

  function onDocumentLoadError() {
    setError('PDF 加载失败，请重试')
    setIsLoading(false)
  }

  function handleRotatePage(pageNumber: number, direction: 'left' | 'right') {
    setPageRotations(prev => ({
      ...prev,
      [pageNumber]: (prev[pageNumber] || 0) + (direction === 'left' ? -90 : 90)
    }))
  }

  const handleDownload = async () => {
    if (!file) return
    
    try {
      setIsLoading(true)
      setError('')
      
      const existingPdfBytes = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      
      Object.entries(pageRotations).forEach(([pageNum, rotation]) => {
        const page = pdfDoc.getPage(parseInt(pageNum) - 1)
        page.setRotation(degrees(rotation as 0 | 90 | 180 | 270))
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `rotated-${file.name}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      setError('PDF 处理失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFile = (newFile?: File) => {
    if (newFile && newFile.type === 'application/pdf') {
      setFile(newFile)
      setPageRotations({})
      setError('')
    } else if (newFile) {
      setError('请选择有效的 PDF 文件')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-blue-500')
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500')
    }
    
    const droppedFile = e.dataTransfer.files[0]
    handleFile(droppedFile)
  }

  return (
    <div className="w-full">
      <div 
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8 transition-colors duration-200"
      >
        <input
          type="file"
          accept=".pdf"
          onChange={(event) => {
            handleFile(event.target.files?.[0])
          }}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          选择 PDF 文件
        </button>
        <p className="mt-2 text-gray-600">或将 PDF 文件拖放到此处</p>
        {file && (
          <p className="mt-2 text-sm text-gray-500">
            当前文件：{file.name}
          </p>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
          处理中...请稍候
        </div>
      )}

      {file && (
        <div className="mt-8">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="text-center p-4">
                正在加载 PDF...
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(new Array(numPages), (_, index) => (
                <div key={`page_${index + 1}`} className="relative">
                  <Page
                    pageNumber={index + 1}
                    rotate={pageRotations[index + 1] || 0}
                    className="border border-gray-300"
                    width={300}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleRotatePage(index + 1, 'left')}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      ↺
                    </button>
                    <button
                      onClick={() => handleRotatePage(index + 1, 'right')}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      ↻
                    </button>
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-500">
                    第 {index + 1} 页
                  </div>
                </div>
              ))}
            </div>
          </Document>
          
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className={`fixed bottom-8 right-8 px-6 py-3 rounded-lg text-white
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {isLoading ? '处理中...' : '下载旋转后的 PDF'}
          </button>
        </div>
      )}
    </div>
  )
}
