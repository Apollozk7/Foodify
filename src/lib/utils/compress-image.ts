import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file on the client-side to ensure it is under a specific size.
 * This is particularly important for users with limited bandwidth or large photos.
 * 
 * @param imageFile - The original File object to compress.
 * @returns A promise that resolves to the compressed File object.
 */
export async function compressImage(imageFile: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    console.info(`[Compression] Starting compression for: ${imageFile.name} (Original size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB)`);
    
    const compressedFile = await imageCompression(imageFile, options);
    
    console.info(`[Compression] Finished. New size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    return compressedFile;
  } catch (error) {
    console.error('[Compression] Error during image compression:', error);
    
    // Fallback: return the original file so the upload process can attempt to proceed
    return imageFile;
  }
}
