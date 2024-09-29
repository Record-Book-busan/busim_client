import { FileSystem } from 'react-native-file-access'

export const checkFileSize = async (uri: string): Promise<boolean> => {
  const fileInfo = await FileSystem.stat(uri)
  const fileSizeInMB = fileInfo.size / (1024 * 1024)
  console.log('파일 사이즈 (MB):', fileSizeInMB.toFixed(1))
  return fileSizeInMB <= 15
}
