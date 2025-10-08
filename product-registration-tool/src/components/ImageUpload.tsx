'use client'

import { useState, useRef } from 'react'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(images)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPreviews: string[] = []
    const readers: Promise<string>[] = []

    Array.from(files).slice(0, 5 - previews.length).forEach((file) => {
      // ファイル形式チェック
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        alert('JPEG, PNG, WebP形式の画像のみアップロードできます')
        return
      }

      // ファイルサイズチェック (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('画像サイズは5MB以下にしてください')
        return
      }

      const reader = new FileReader()
      const promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
        reader.readAsDataURL(file)
      })
      readers.push(promise)
    })

    Promise.all(readers).then((results) => {
      const updated = [...previews, ...results]
      setPreviews(updated)
      onChange(updated)
    })
  }

  const handleRemove = (index: number) => {
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
    onChange(updated)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <label className="block font-medium">商品画像</label>
        <span className="text-sm text-gray-600">
          (最大5枚、JPEG/PNG/WebP、5MB以下)
        </span>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`商品画像 ${index + 1}`}
              className="w-full h-32 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}

        {previews.length < 5 && (
          <button
            type="button"
            onClick={handleClick}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 flex flex-col items-center justify-center text-gray-500 hover:text-blue-500 transition"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm">画像を追加</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {previews.length > 0 && (
        <p className="text-sm text-gray-600">
          {previews.length}枚の画像が選択されています
        </p>
      )}
    </div>
  )
}
