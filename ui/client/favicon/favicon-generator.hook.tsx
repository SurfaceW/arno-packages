import { useEffect } from 'react';

export const useEmojiFavicon = (emoji: string) => {
  useEffect(() => {
    // use a canvas to draw emoji
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');

    if (!context) {
      console.warn('❌ Canvas 2D context is not supported.');
      return;
    }

    // adjust the font size and alignment
    context.font = '64px serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.fillText(emoji, canvas.width / 2, canvas.height / 2);

    const dataURL = canvas.toDataURL('image/png');

    // programmatically update the favicon
    let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link') as HTMLLinkElement;
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = dataURL;
  }, [emoji]);
};