import React from 'react';

// Utility để render icons từ LONGBLOB data
export const renderBlobIcon = (blobData, className = "w-5 h-5", fallbackIcon = null) => {
  // Nếu có blob data, render SVG từ base64
  if (blobData) {
    try {
      // Convert blob data thành base64 string nếu cần
      let base64String = blobData;
      
      // Nếu blobData là ArrayBuffer hoặc Uint8Array
      if (blobData instanceof ArrayBuffer || blobData instanceof Uint8Array) {
        const bytes = new Uint8Array(blobData);
        base64String = btoa(String.fromCharCode(...bytes));
      }
      
      // Nếu đã là base64 string, decode thành SVG
      let svgString;
      if (typeof base64String === 'string') {
        try {
          svgString = atob(base64String);
        } catch (e) {
          // Nếu không phải base64, có thể đã là SVG string
          svgString = base64String;
        }
      }
      
      // Render SVG với className được truyền vào
      if (svgString && svgString.includes('<svg')) {
        // Thêm className vào SVG
        const svgWithClass = svgString.replace(
          /<svg([^>]*)>/,
          `<svg$1 class="${className}">`
        );
        
        return (
          <div 
            className="inline-block"
            dangerouslySetInnerHTML={{ __html: svgWithClass }}
          />
        );
      }
    } catch (error) {
      console.warn('Error rendering blob icon:', error);
    }
  }
  
  // Fallback: render fallback icon hoặc placeholder
  if (fallbackIcon) {
    return fallbackIcon;
  }
  
  return (
    <div 
      className={`${className} bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600`}
      title="Icon not available"
    >
      ?
    </div>
  );
};

// Hook để convert blob data thành data URL
export const useBlobIcon = (blobData) => {
  const [iconUrl, setIconUrl] = React.useState(null);
  
  React.useEffect(() => {
    if (!blobData) {
      setIconUrl(null);
      return;
    }
    
    try {
      let base64String = blobData;
      
      // Convert ArrayBuffer/Uint8Array to base64
      if (blobData instanceof ArrayBuffer || blobData instanceof Uint8Array) {
        const bytes = new Uint8Array(blobData);
        base64String = btoa(String.fromCharCode(...bytes));
      }
      
      // Create data URL
      if (typeof base64String === 'string') {
        let svgString;
        try {
          svgString = atob(base64String);
        } catch (e) {
          svgString = base64String;
        }
        
        if (svgString && svgString.includes('<svg')) {
          const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
          setIconUrl(dataUrl);
        }
      }
    } catch (error) {
      console.warn('Error processing blob icon:', error);
      setIconUrl(null);
    }
  }, [blobData]);
  
  return iconUrl;
};

// Component để render icon từ blob với img tag
export const BlobIconImage = ({ blobData, className = "w-5 h-5", alt = "Icon" }) => {
  const iconUrl = useBlobIcon(blobData);
  
  if (!iconUrl) {
    return (
      <div 
        className={`${className} bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600`}
        title="Icon not available"
      >
        ?
      </div>
    );
  }
  
  return (
    <img 
      src={iconUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling?.style.display = 'flex';
      }}
    />
  );
};
