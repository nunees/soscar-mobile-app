/* eslint-disable @typescript-eslint/no-explicit-any */
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';

export function useDownload() {
  const [downloadProgress, setDownloadProgress] = useState(0);

  const callback = (downloadProgress: any) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  };

  /**  Download a file from a remote location
   * @param url Remote location where the file is located
   * @param filename Name of the file to be saved
   */
  async function download(url: string, filename: string) {
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      `${FileSystem.documentDirectory}${filename}`,
      {},
      callback
    );

    return downloadResumable.downloadAsync();
  }

  return { download, downloadProgress };
}
