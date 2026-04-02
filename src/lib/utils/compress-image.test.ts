import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { compressImage } from './compress-image';
import imageCompression from 'browser-image-compression';

vi.mock('browser-image-compression', () => {
  return {
    default: vi.fn(),
  };
});

describe('compressImage', () => {
  const mockFile = new File(['test image content'], 'test.jpg', { type: 'image/jpeg' });
  const mockCompressedFile = new File(['compressed content'], 'test-compressed.jpg', {
    type: 'image/jpeg',
  });

  // Override sizes for logging purposes to ensure predictable numbers
  Object.defineProperty(mockFile, 'size', { value: 2000000, configurable: true }); // ~1.91 MB
  Object.defineProperty(mockCompressedFile, 'size', { value: 500000, configurable: true }); // ~0.48 MB

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should compress the image successfully', async () => {
    vi.mocked(imageCompression).mockResolvedValueOnce(mockCompressedFile);

    const result = await compressImage(mockFile);

    expect(imageCompression).toHaveBeenCalledWith(mockFile, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });
    expect(result).toBe(mockCompressedFile);
    expect(console.info).toHaveBeenCalledTimes(2);
    expect(console.info).toHaveBeenNthCalledWith(
      1,
      '[Compression] Starting compression for: test.jpg (Original size: 1.91 MB)'
    );
    expect(console.info).toHaveBeenNthCalledWith(2, '[Compression] Finished. New size: 0.48 MB');
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should return the original file if compression fails', async () => {
    const error = new Error('Compression failed');
    vi.mocked(imageCompression).mockRejectedValueOnce(error);

    const result = await compressImage(mockFile);

    expect(imageCompression).toHaveBeenCalledWith(mockFile, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });
    expect(result).toBe(mockFile);
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenNthCalledWith(
      1,
      '[Compression] Starting compression for: test.jpg (Original size: 1.91 MB)'
    );
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      '[Compression] Error during image compression:',
      error
    );
  });
});
