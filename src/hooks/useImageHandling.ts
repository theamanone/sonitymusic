import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useSubscription } from '@/contexts/SubscriptionContext';

export function useImageHandling() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewImageName, setPreviewImageName] = useState<string>('');
  const [showImageConfirm, setShowImageConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { subscription } = useSubscription();

  // Image limit helpers: client-side 5/day limit (component scope)
  const getImageLimitKey = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return `imageCount_${today}`;
  }, []);

  const getImageCountToday = useCallback((): number => {
    const key = getImageLimitKey();
    return parseInt(localStorage.getItem(key) || '0', 10);
  }, [getImageLimitKey]);

  const incrementImageCount = useCallback(() => {
    const key = getImageLimitKey();
    const current = getImageCountToday();
    localStorage.setItem(key, (current + 1).toString());
  }, [getImageLimitKey, getImageCountToday]);

  const onClickImageButton = useCallback(() => {
    const currentCount = getImageCountToday();
    const dailyLimit = subscription?.plan === 'premium' ? 50 : 5;
    
    if (currentCount >= dailyLimit) {
      toast.error(`Daily image limit reached (${dailyLimit}). ${subscription?.plan === 'premium' ? '' : 'Upgrade to Premium for more images.'}`, { duration: 2500 });
      return;
    }
    
    fileInputRef.current?.click();
  }, [getImageCountToday, subscription]);

  const handleImageSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 10MB', { duration: 2500 });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewImage(dataUrl);
      setPreviewImageName(file.name);
      setShowImageConfirm(true);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  }, []);

  const confirmSendPreviewImage = useCallback(() => {
    if (previewImage) {
      return {
        dataUrl: previewImage,
        fileName: previewImageName
      };
    }
    return null;
  }, [previewImage, previewImageName]);

  const cancelPreviewImage = useCallback(() => {
    setPreviewImage(null);
    setPreviewImageName('');
    setShowImageConfirm(false);
  }, []);

  // Paste handler: support pasting images from clipboard
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setPreviewImage(dataUrl);
          setPreviewImageName(`pasted-image-${Date.now()}.png`);
          setShowImageConfirm(true);
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  return {
    previewImage,
    previewImageName,
    showImageConfirm,
    fileInputRef,
    onClickImageButton,
    handleImageSelected,
    confirmSendPreviewImage,
    cancelPreviewImage,
    handlePaste,
    incrementImageCount,
    getImageCountToday
  };
}
