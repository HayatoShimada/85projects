'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { generateUniqueSKU } from '@/lib/shopify'
import ImageUpload from './ImageUpload'

// バリデーションスキーマ
const productSchema = z.object({
  title: z.string().min(1, '商品名は必須です'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, '有効な価格を入力してください'),
  category: z.string().optional(),
  description: z.string().optional(),
  isVintage: z.boolean(),

  // 古着専用フィールド
  shoulder: z.string().optional(),
  chest: z.string().optional(),
  sleeve: z.string().optional(),
  length: z.string().optional(),
  material: z.string().optional(),
  origin: z.string().optional(),

  // 新品専用フィールド
  size: z.string().optional(),
  color: z.string().optional(),
  stock: z.string().optional(),
}).refine((data) => {
  // 新品の場合は在庫数が必須
  if (!data.isVintage && (!data.stock || parseInt(data.stock) <= 0)) {
    return false
  }
  return true
}, {
  message: '新品の場合、在庫数は必須です',
  path: ['stock'],
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  onSuccess: (productId: string, sku: string, title?: string) => void
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sku, setSku] = useState('')
  const [images, setImages] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isVintage: true,
    },
  })

  const isVintage = watch('isVintage')

  // SKU自動生成プレビュー
  useEffect(() => {
    setSku(generateUniqueSKU(isVintage))
  }, [isVintage])

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          sku,
          images,
          measurements: isVintage ? {
            shoulder: data.shoulder,
            chest: data.chest,
            sleeve: data.sleeve,
            length: data.length,
          } : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('商品登録に失敗しました')
      }

      const result = await response.json()
      onSuccess(result.productId, result.sku, data.title)
      reset()
      setImages([])
      setSku(generateUniqueSKU(isVintage))
    } catch (error) {
      alert(error instanceof Error ? error.message : '商品登録に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
      {/* 商品タイプトグル */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('isVintage')}
            className="w-5 h-5"
          />
          <span className="font-semibold">古着（一点物）</span>
        </label>
        <p className="text-sm text-gray-600 mt-1">
          チェックを外すと新品（複数在庫）モードになります
        </p>
      </div>

      {/* 基本情報 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">基本情報</h2>

        <div>
          <label className="block font-medium mb-1">
            商品名 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title')}
            className="w-full border rounded px-3 py-2"
            placeholder="例: ヴィンテージデニムジャケット"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">
            価格 (円) <span className="text-red-500">*</span>
          </label>
          <input
            {...register('price')}
            className="w-full border rounded px-3 py-2"
            placeholder="例: 8900"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">カテゴリー</label>
          <select {...register('category')} className="w-full border rounded px-3 py-2">
            <option value="">選択してください</option>
            <option value="アウター">アウター</option>
            <option value="トップス">トップス</option>
            <option value="ボトムス">ボトムス</option>
            <option value="アクセサリー">アクセサリー</option>
            <option value="その他">その他</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">商品説明</label>
          <textarea
            {...register('description')}
            className="w-full border rounded px-3 py-2 h-24"
            placeholder="商品の詳細説明を入力してください"
          />
        </div>
      </div>

      {/* 画像アップロード */}
      <div className="space-y-4">
        <ImageUpload images={images} onChange={setImages} />
      </div>

      {/* 古着専用フィールド */}
      {isVintage && (
        <div className="space-y-4 bg-amber-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">古着専用 - 採寸データ</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">肩幅 (cm)</label>
              <input
                {...register('shoulder')}
                className="w-full border rounded px-3 py-2"
                placeholder="例: 45"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">胸囲 (cm)</label>
              <input
                {...register('chest')}
                className="w-full border rounded px-3 py-2"
                placeholder="例: 50"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">袖丈 (cm)</label>
              <input
                {...register('sleeve')}
                className="w-full border rounded px-3 py-2"
                placeholder="例: 60"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">着丈 (cm)</label>
              <input
                {...register('length')}
                className="w-full border rounded px-3 py-2"
                placeholder="例: 65"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">素材</label>
            <input
              {...register('material')}
              className="w-full border rounded px-3 py-2"
              placeholder="例: コットン100%"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">原産国</label>
            <input
              {...register('origin')}
              className="w-full border rounded px-3 py-2"
              placeholder="例: USA"
            />
          </div>
        </div>
      )}

      {/* 新品専用フィールド */}
      {!isVintage && (
        <div className="space-y-4 bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">新品専用 - バリアント情報</h2>

          <div>
            <label className="block font-medium mb-1">サイズ</label>
            <select {...register('size')} className="w-full border rounded px-3 py-2">
              <option value="">選択してください</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">カラー</label>
            <input
              {...register('color')}
              className="w-full border rounded px-3 py-2"
              placeholder="例: ブラック"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              在庫数 <span className="text-red-500">*</span>
            </label>
            <input
              {...register('stock')}
              type="number"
              min="1"
              className="w-full border rounded px-3 py-2"
              placeholder="例: 10"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
            )}
          </div>
        </div>
      )}

      {/* SKUプレビュー */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block font-medium mb-1">自動生成SKU（プレビュー）</label>
        <input
          value={sku}
          readOnly
          className="w-full border rounded px-3 py-2 bg-white"
        />
        <p className="text-sm text-gray-600 mt-1">
          このSKUは商品登録時に自動的に割り当てられます
        </p>
      </div>

      {/* 送信ボタン */}
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '登録中...' : '商品を登録'}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
        >
          クリア
        </button>
      </div>
    </form>
  )
}
