'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/ImageUpload'

// バリデーションスキーマ
const productSchema = z.object({
  title: z.string().min(1, '商品名は必須です'),
  price: z.string().regex(/^\d+(\\.\\d{1,2})?$/, '有効な価格を入力してください'),
  category: z.string().optional(),
  description: z.string().optional(),
  isVintage: z.boolean(),

  // 古着専用フィールド
  condition: z.string().optional(),
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
})

type ProductFormData = z.infer<typeof productSchema>

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [sku, setSku] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isVintage: true,
    },
  })

  const isVintage = watch('isVintage')

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products/${productId}`)

      if (!response.ok) {
        throw new Error('商品情報の取得に失敗しました')
      }

      const product = await response.json()

      // フォームに値をセット
      setValue('title', product.title)
      setValue('price', product.price)
      setValue('category', product.category || '')
      setValue('description', product.description || '')
      setValue('isVintage', product.isVintage)
      setValue('condition', product.condition || '')
      setValue('material', product.material || '')
      setValue('origin', product.origin || '')

      if (product.measurements) {
        setValue('shoulder', product.measurements.shoulder || '')
        setValue('chest', product.measurements.chest || '')
        setValue('sleeve', product.measurements.sleeve || '')
        setValue('length', product.measurements.length || '')
      }

      setSku(product.sku)
    } catch (err) {
      setError(err instanceof Error ? err.message : '商品情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
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
        throw new Error('商品の更新に失敗しました')
      }

      alert('商品情報を更新しました')
      router.push('/products')
    } catch (error) {
      alert(error instanceof Error ? error.message : '商品の更新に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">商品情報を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto p-8">
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">エラー</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.push('/products')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            商品一覧に戻る
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">商品編集</h1>
        <p className="text-gray-600">商品情報の編集 (F108)</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
        {/* 商品タイプトグル（読み取り専用） */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('isVintage')}
              disabled
              className="w-5 h-5"
            />
            <span className="font-semibold">古着（一点物）</span>
          </label>
          <p className="text-sm text-gray-600 mt-1">
            ※ 商品タイプは変更できません
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
            <h2 className="text-xl font-semibold">古着専用情報</h2>

            {/* 状態ランク */}
            <div>
              <label className="block font-medium mb-1">状態ランク</label>
              <select {...register('condition')} className="w-full border rounded px-3 py-2">
                <option value="">選択してください</option>
                <option value="S">S - 新品同様（タグ付き、未使用）</option>
                <option value="A">A - 美品（使用感がほぼなく、目立つダメージなし）</option>
                <option value="B">B - 良好（多少の使用感あり、大きなダメージなし）</option>
                <option value="C">C - 使用感あり（目立つ使用感、小さなダメージあり）</option>
                <option value="D">D - ダメージあり（大きなダメージ、汚れ、破れ等）</option>
              </select>
            </div>

            <h3 className="text-lg font-semibold mt-4">採寸データ</h3>

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

        {/* SKU表示 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block font-medium mb-1">SKU（変更不可）</label>
          <input
            value={sku}
            readOnly
            className="w-full border rounded px-3 py-2 bg-white"
          />
        </div>

        {/* ボタン */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '更新中...' : '更新する'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
          >
            キャンセル
          </button>
        </div>
      </form>
    </main>
  )
}
