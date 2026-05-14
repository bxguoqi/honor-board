'use client';

import { useState, useRef, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';

// ============ 类型定义 ============

interface PhotoSlot {
  id: string;
  name: string;
  photoUrl: string | null;
  type: 'gold' | 'silver' | 'bronze';
  size: '2x2' | '2x1' | '1x1';
  index: number;
}

interface PhotosClientProps {
  slots: PhotoSlot[];
  stats: {
    gold: number;
    silver: number;
    bronze: number;
    filled: number;
    total: number;
  };
}

// ============ 常量 ============

const WORKER_URL = 'https://honor-board-api.bxguoqi.workers.dev';
const API_KEY = 'honor-board-2024';

// 裁剪输出尺寸（像素）
const CROP_SIZE = {
  '2x2': { width: 800, height: 800 },
  '2x1': { width: 800, height: 400 },
  '1x1': { width: 400, height: 400 },
};

const MEDAL_ICON = { gold: '🥇', silver: '🥈', bronze: '🥉' };
const SIZE_LABEL = { '2x2': '2×2', '2x1': '2×1', '1x1': '1×1' };

// ============ 花朵占位图 ============

function getPlaceholderSvg(type: 'gold' | 'silver' | 'bronze', index: number): string {
  const colors = {
    gold: [['#F9A8D4', '#FB7185'], ['#D8B4FE', '#818CF8'], ['#93C5FD', '#22D3EE']],
    silver: [['#86EFAC', '#34D399'], ['#FDE047', '#FBBF24']],
    bronze: [['#FDBA74', '#F87171'], ['#5EEAD4', '#06B6D4'], ['#F0ABFC', '#EC4899']],
  };
  const [c1, c2] = colors[type][index % colors[type].length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="url(#g)"/>
    <g transform="translate(100,100)" opacity="0.25">
      <circle cx="0" cy="-35" r="22" fill="white"/><circle cx="33" cy="-12" r="22" fill="white"/>
      <circle cx="20" cy="28" r="22" fill="white"/><circle cx="-20" cy="28" r="22" fill="white"/>
      <circle cx="-33" cy="-12" r="22" fill="white"/><circle cx="0" cy="0" r="18" fill="${c2}"/>
    </g></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// ============ 图片裁剪工具 ============

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function getCroppedImage(imageSrc: string, pixelCrop: Area, outputSize: { width: number; height: number }): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = outputSize.width;
  canvas.height = outputSize.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, outputSize.width, outputSize.height
  );

  return canvas.toDataURL('image/jpeg', 0.85);
}

// ============ 主组件 ============

export default function PhotosClient({ slots, stats }: PhotosClientProps) {
  // 裁剪状态
  const [editingSlot, setEditingSlot] = useState<PhotoSlot | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 选择文件
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    // 重置 input 以便重复选择同一文件
    e.target.value = '';
  };

  // 裁剪完成回调
  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // 确认上传
  const handleConfirmUpload = async () => {
    if (!editingSlot || !croppedAreaPixels || !imageSrc) return;
    setUploading(true);

    try {
      const outputSize = CROP_SIZE[editingSlot.size];
      const croppedBase64 = await getCroppedImage(imageSrc, croppedAreaPixels, outputSize);

      // 发送到 Worker
      const resp = await fetch(`${WORKER_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': API_KEY,
        },
        body: JSON.stringify({
          slotId: editingSlot.id,
          image: croppedBase64,
        }),
      });

      if (!resp.ok) throw new Error('上传失败');

      setUploadSuccess(true);
      setTimeout(() => {
        // 刷新页面
        window.location.reload();
      }, 1000);
    } catch (err) {
      alert('上传失败，请重试');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // 关闭弹窗
  const handleClose = () => {
    setEditingSlot(null);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setUploadSuccess(false);
  };

  // 裁剪框宽高比
  const getAspect = (size: string) => {
    switch (size) {
      case '2x2': return 1;
      case '2x1': return 2;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-gradient-to-br from-pink-400 to-pink-500 px-5 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-white text-xl font-bold">📸 照片墙</h1>
        <p className="text-white/80 text-sm mt-1">记录美好瞬间</p>
      </div>

      {/* 统计 */}
      <div className="flex justify-around py-4 px-4 bg-white mx-4 -mt-3 rounded-2xl shadow-sm">
        <div className="text-center">
          <div className="text-lg">{MEDAL_ICON.gold}×{stats.gold}</div>
          <div className="text-[10px] text-gray-400">大照片位</div>
        </div>
        <div className="text-center">
          <div className="text-lg">{MEDAL_ICON.silver}×{stats.silver}</div>
          <div className="text-[10px] text-gray-400">中照片位</div>
        </div>
        <div className="text-center">
          <div className="text-lg">{MEDAL_ICON.bronze}×{stats.bronze}</div>
          <div className="text-[10px] text-gray-400">小照片位</div>
        </div>
      </div>

      <div className="px-4 py-2 text-xs text-gray-400 text-center">
        已使用 {stats.filled} / {stats.total} 格
      </div>

      {/* 照片墙网格 */}
      <div className="px-4 pb-24">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoFlow: 'dense',
          }}
        >
          {slots.map((slot) => {
            const isEmpty = !slot.photoUrl;
            const imageUrl = slot.photoUrl || getPlaceholderSvg(slot.type, slot.index);
            const colSpan = slot.size === '1x1' ? 1 : 2;
            const rowSpan = slot.size === '2x2' ? 2 : 1;

            return (
              <div
                key={slot.id}
                className="relative overflow-hidden rounded-xl bg-white shadow-sm group"
                style={{
                  gridColumn: `span ${colSpan}`,
                  gridRow: `span ${rowSpan}`,
                  aspectRatio: slot.size === '2x1' ? '2/1' : '1/1',
                }}
              >
                <img
                  src={imageUrl}
                  alt={slot.name}
                  className="w-full h-full object-cover"
                />

                {/* 更换按钮 - 右上角 */}
                <button
                  onClick={() => setEditingSlot(slot)}
                  className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {/* 空位遮罩 */}
                {isEmpty && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5">
                    <span className="text-4xl drop-shadow-lg">{MEDAL_ICON[slot.type]}</span>
                    <span className="text-white text-xs font-bold mt-1 drop-shadow-md">
                      {SIZE_LABEL[slot.size]}
                    </span>
                    <span className="text-white text-xl mt-0.5 drop-shadow-md">+</span>
                  </div>
                )}

                {/* 有照片时的名称标签 */}
                {!isEmpty && slot.name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <span className="text-white text-xs">{slot.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 隐藏的文件选择器 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 裁剪弹窗 */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 bg-black/70 flex flex-col">
          {/* 顶部栏 */}
          <div className="flex items-center justify-between px-4 py-3 bg-white">
            <button onClick={handleClose} className="text-gray-500 text-sm">取消</button>
            <span className="text-sm font-medium">
              {editingSlot.type === 'gold' ? '🥇' : editingSlot.type === 'silver' ? '🥈' : '🥉'}
              {' '}选择照片 ({SIZE_LABEL[editingSlot.size]})
            </span>
            {imageSrc && !uploadSuccess && (
              <button
                onClick={handleConfirmUpload}
                disabled={uploading}
                className="text-pink-500 text-sm font-medium disabled:opacity-50"
              >
                {uploading ? '上传中...' : '完成'}
              </button>
            )}
            {uploadSuccess && (
              <span className="text-green-500 text-sm">✅ 成功</span>
            )}
            {!imageSrc && (
              <div className="w-10" />
            )}
          </div>

          {/* 裁剪区域 / 选择提示 */}
          <div className="flex-1 relative bg-black">
            {!imageSrc ? (
              /* 选择照片提示 */
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  onClick={handleSelectFile}
                  className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4 active:bg-white/20"
                >
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <p className="text-white/70 text-sm">点击选择照片</p>
                <p className="text-white/40 text-xs mt-1">
                  {editingSlot.size === '2x2' && '建议选择正方形照片'}
                  {editingSlot.size === '2x1' && '建议选择横向照片'}
                  {editingSlot.size === '1x1' && '建议选择正方形照片'}
                </p>
                <button
                  onClick={handleSelectFile}
                  className="mt-6 px-6 py-2.5 bg-pink-500 text-white rounded-full text-sm font-medium active:bg-pink-600"
                >
                  从相册选择
                </button>
              </div>
            ) : (
              /* 裁剪器 */
              <>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={getAspect(editingSlot.size)}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  style={{ containerStyle: { position: 'absolute', inset: 0 } }}
                />
                {/* 缩放滑块 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                  <div className="flex justify-between text-white/50 text-xs mt-1">
                    <span>缩小</span>
                    <span>放大</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 底部：重新选择 */}
          {imageSrc && !uploadSuccess && (
            <div className="px-4 py-3 bg-white border-t">
              <button
                onClick={handleSelectFile}
                className="w-full py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl active:bg-gray-50"
              >
                重新选择照片
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
