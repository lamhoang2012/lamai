import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, SwitchCamera, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
      return;
    }
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setIsInitializing(true);
    setCameraError(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      // Try fallback to any available video device
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (fallbackErr) {
        setCameraError(
          'Không thể kết nối máy ảnh. Vui lòng cho phép quyền truy cập camera trong trình duyệt hoặc sử dụng tính năng tải ảnh từ thư viện.'
        );
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-slate-100">Chụp ảnh bài làm học sinh</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder or Preview */}
        <div className="relative aspect-4/3 w-full bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <p className="text-sm text-slate-300 mb-4">{cameraError}</p>
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Thử lại
              </button>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Document Alignment Overlay Box */}
              <div className="pointer-events-none absolute inset-6 sm:inset-10 border-2 border-dashed border-sky-400/80 rounded-xl">
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[11px] text-sky-200 font-mono">
                  Căn chỉnh mép giấy bài thi vào khung này
                </div>
                {/* Crosshairs */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sky-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sky-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-sky-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-sky-400" />
              </div>
            </>
          )}

          {isInitializing && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-400 border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Hidden Canvas for capture processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Controls Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-4">
          {!capturedImage ? (
            <>
              <button
                onClick={toggleCamera}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors"
                title="Đổi camera trước/sau"
              >
                <SwitchCamera className="w-5 h-5" />
                <span className="hidden sm:inline">Đổi camera</span>
              </button>

              <button
                onClick={takeSnapshot}
                disabled={!!cameraError || isInitializing}
                className="group relative flex items-center justify-center p-1 rounded-full bg-white hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
              >
                <div className="w-14 h-14 rounded-full border-4 border-slate-900 bg-sky-500 group-hover:bg-sky-400 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>

              <div className="w-24 text-right">
                <span className="text-xs text-slate-400">Độ phân giải HD</span>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Chụp lại
              </button>

              <button
                onClick={handleConfirm}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-md shadow-emerald-900/30 transition-all"
              >
                <Check className="w-4 h-4" /> Dùng ảnh này để chấm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
