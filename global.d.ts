interface Window {
  showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
}

interface FileSystemDirectoryHandle {
  values: () => AsyncIterable<FileSystemHandle>;
}


interface FileSystemFileHandle extends FileSystemHandle {
  getFile: () => Promise<File>;
}

interface FileSystemHandle {
  kind: "file" | "directory"; // 明确句柄类型
  name: string;              // 文件或目录的名称
}