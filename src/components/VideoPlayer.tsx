type VideoPlayerProps = {
  video: {
    name: string;
    duration: number;
    fileUrl: string;
  };
};

export const VideoPlayer = ({ video }: VideoPlayerProps) => {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{video.name}</h2>
      <video
        src={video.fileUrl}
        controls
        autoPlay
        className="w-full rounded-lg shadow-lg"
      />
    </div>
  );
};
