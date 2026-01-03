/**
 * Reads a file as text.
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file content"));
      }
    };
    reader.onerror = () => reject(new Error("File reading error"));
    reader.readAsText(file);
  });
};

/**
 * The core business logic:
 * 1. Splits text by newline.
 * 2. Reverses the array of lines.
 * 3. Joins them back together.
 * 4. Decodes Base64 to binary.
 * 5. Returns a Blob (ZIP).
 */
export const convertTextToZipBlob = (textContent: string): Blob => {
  // 1. Split text into lines, handling both \r\n and \n
  const lines = textContent.split(/\r?\n/);

  // 2. Reverse the lines (assuming the original file was split and stacked in reverse order)
  const reversedLines = lines.reverse();

  // 3. Join them to form the Base64 string
  let base64String = reversedLines.join('');
  
  // Clean up any remaining whitespace that might corrupt Base64 decoding
  base64String = base64String.replace(/\s/g, '');

  if (!base64String) {
    throw new Error("Resulting string is empty.");
  }

  try {
    // 4. Decode Base64
    // Using simple atob (works for Latin1/binary chars which zip uses). 
    // For specific UTF-8 text content we might need manual decoding, 
    // but for ZIP binary data, atob -> Uint8Array is standard.
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 5. Create Blob
    return new Blob([bytes], { type: "application/zip" });
  } catch (error) {
    console.error(error);
    throw new Error("Invalid Base64 content. Please ensure the file contains valid Base64 parts.");
  }
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Parses a ZIP blob to extract filenames from the Central Directory.
 * This allows previewing the contents without external libraries.
 */
export const getZipFileList = async (blob: Blob): Promise<string[]> => {
  try {
    const buffer = await blob.arrayBuffer();
    const view = new DataView(buffer);
    const u8 = new Uint8Array(buffer);
    const len = view.byteLength;

    // Search for End of Central Directory Record (signature 0x06054b50)
    // It is at the end of the file. Minimum size of EOCD is 22 bytes.
    let eocdOffset = -1;
    // We scan backwards within the last 65KB + 22 bytes
    const maxScan = Math.min(len, 65535 + 22);
    for (let i = len - 22; i >= len - maxScan; i--) {
      if (view.getUint32(i, true) === 0x06054b50) {
        eocdOffset = i;
        break;
      }
    }

    if (eocdOffset === -1) {
      return []; // Not a valid zip or signature not found
    }

    const entriesCount = view.getUint16(eocdOffset + 10, true);
    const centralDirOffset = view.getUint32(eocdOffset + 16, true);

    const files: string[] = [];
    let offset = centralDirOffset;

    for (let i = 0; i < entriesCount; i++) {
        if (offset + 46 > len) break;
        // Central Directory Header Signature: 0x02014b50
        if (view.getUint32(offset, true) !== 0x02014b50) break;

        const fileNameLen = view.getUint16(offset + 28, true);
        const extraFieldLen = view.getUint16(offset + 30, true);
        const fileCommentLen = view.getUint16(offset + 32, true);

        // Filename is at offset 46 within the header
        const nameBytes = u8.subarray(offset + 46, offset + 46 + fileNameLen);
        const fileName = new TextDecoder("utf-8").decode(nameBytes);
        files.push(fileName);

        offset += 46 + fileNameLen + extraFieldLen + fileCommentLen;
    }

    return files;
  } catch (err) {
    console.error("Failed to parse zip directory", err);
    return [];
  }
};
