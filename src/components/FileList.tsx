type FileListProps = {
  videoFiles: {
    name: string;
    duration: number;
    createdAt?: string;
    author?: string;
    fileUrl: string;
  }[];
  onSelectVideo: (video: any) => void;
};

export const FileList = ({ videoFiles, onSelectVideo }: FileListProps) => {
  return (
    <ul className="space-y-4">
      {videoFiles.map((file, index) => (
        <li
          key={index}
          className="p-4 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition"
          onClick={() => onSelectVideo(file)}
        >
          <h3 className="text-gray-800 font-semibold">{file.name}</h3>
          <div className="text-sm text-gray-600 mt-2">
            <span className="block">时长: {file.duration.toFixed(2)} 秒</span>
            <span className="block">创建时间: {file.createdAt || "未知"}</span>
            <span className="block">作者: {file.author || "未知"}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
