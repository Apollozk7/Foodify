import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ChatInterface } from './chat-interface';
import { compressImage } from '@/lib/utils/compress-image';

// Mock next/image to render a plain <img>
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, ...rest } = props;
    return <img data-fill={fill ? 'true' : undefined} {...rest} />;
  },
}));

// Mock framer-motion to render plain elements
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => (
      <div {...props}>{children as React.ReactNode}</div>
    ),
    h1: ({ children, ...props }: Record<string, unknown>) => (
      <h1 {...props}>{children as React.ReactNode}</h1>
    ),
    p: ({ children, ...props }: Record<string, unknown>) => (
      <p {...props}>{children as React.ReactNode}</p>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock BeforeAfterSlider
vi.mock('@/components/ui/before-after-slider', () => ({
  BeforeAfterSlider: () => <div data-testid="before-after-slider" />,
}));

// Mock compressImage to control its resolution timing
vi.mock('@/lib/utils/compress-image', () => ({
  compressImage: vi.fn(),
}));

const mockedCompressImage = vi.mocked(compressImage);

describe('ChatInterface — image compression loading state', () => {
  const defaultProps = {
    messages: [],
    onSendMessage: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Stub URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:preview-url');
  });

  it('should disable the input and show "Otimizando imagem..." placeholder while an image is being compressed', async () => {
    // compressImage returns a promise we control so the component stays in isCompressing=true
    let resolveCompression!: (file: File) => void;
    mockedCompressImage.mockImplementation(
      () =>
        new Promise<File>(resolve => {
          resolveCompression = resolve;
        })
    );

    render(<ChatInterface {...defaultProps} />);

    const input = screen.getByPlaceholderText('Diga algo ou descreva um visual...');
    expect(input).not.toBeDisabled();

    // Simulate selecting a file through the hidden file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const testFile = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // While compression is in-flight, the input should be disabled with the loading placeholder
    await waitFor(() => {
      const compressingInput = screen.getByPlaceholderText('Otimizando imagem...');
      expect(compressingInput).toBeDisabled();
    });

    // Resolve compression and verify the input returns to its normal state
    const compressedFile = new File(['compressed'], 'photo-compressed.jpg', { type: 'image/jpeg' });
    resolveCompression(compressedFile);

    await waitFor(() => {
      const normalInput = screen.getByPlaceholderText('Diga algo ou descreva um visual...');
      expect(normalInput).not.toBeDisabled();
    });
  });

  it('should disable the send button while an image is being compressed', async () => {
    mockedCompressImage.mockImplementation(
      () => new Promise<File>(() => {}) // never resolves
    );

    render(<ChatInterface {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    // The send button is the second-to-last (before the Reference button)
    const sendBtn = buttons[buttons.length - 2];

    // Before selecting a file, send button is disabled (no text/file)
    expect(sendBtn).toBeDisabled();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const testFile = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // While compressing, send button should remain disabled
    await waitFor(() => {
      expect(sendBtn).toBeDisabled();
    });
  });

  it('should disable the attach-image button while an image is being compressed', async () => {
    mockedCompressImage.mockImplementation(
      () => new Promise<File>(() => {}) // never resolves
    );

    render(<ChatInterface {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    // The attach button is the third-to-last (before send and Reference)
    const attachBtn = buttons[buttons.length - 3];

    expect(attachBtn).not.toBeDisabled();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const testFile = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // While compressing, the attach button should be disabled
    await waitFor(() => {
      expect(attachBtn).toBeDisabled();
    });
  });
});
