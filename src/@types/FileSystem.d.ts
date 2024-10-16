import 'expo-file-system';

declare module 'expo-file-system' {
  type FileInfoSizeProp = { size: number };
  export interface IFileInfo extends FileInfoSizeProp {}
}
