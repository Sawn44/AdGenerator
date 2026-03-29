export function loadFont(fontFamily: string): Promise<void> {
  const normalizedName = fontFamily.replace(/\s+/g, '+');
  const linkId = `google-font-${normalizedName}`;
  
  if (document.getElementById(linkId)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${normalizedName}:wght@400;500;600;700&display=swap`;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load font: ${fontFamily}`));
    document.head.appendChild(link);
  });
}

export function loadFonts(fontFamilies: string[]): Promise<void[]> {
  return Promise.all(fontFamilies.map(loadFont));
}
