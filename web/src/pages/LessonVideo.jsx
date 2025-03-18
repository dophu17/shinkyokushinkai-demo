import React, { useState, useEffect, useRef } from 'react';
import video1 from '../assets/videos/SampleVideo1.mp4';
import video2 from '../assets/videos/SampleVideo2.mp4';
import video3 from '../assets/videos/SampleVideo3.mp4';

function LessonVideo() {
  const [currentTimes, setCurrentTimes] = useState({});
  const [completedVideos, setCompletedVideos] = useState([]);
  
  const handleTimeUpdate = (videoId, event) => {
    const video = event.target;
    const currentTime = currentTimes[videoId] || 0;
    
    // Nếu thời gian hiện tại vượt quá thời gian đã lưu quá nhiều
    // (nghĩa là người dùng đang cố kéo nhanh)
    if (video.currentTime - currentTime > 1) {
      video.currentTime = currentTime;
    } else {
      setCurrentTimes(prev => ({
        ...prev,
        [videoId]: video.currentTime
      }));
    }
  };

  const handleVideoEnded = (videoId) => {
    setCompletedVideos(prev => [...prev, videoId]);
  };

  const canPlayVideo = (videoId) => {
    if (videoId === 1) return true; // Video đầu tiên luôn được phép xem
    // Kiểm tra xem video trước đó đã xem xong chưa
    return completedVideos.includes(videoId - 1);
  };

  const videos = [
    {
      id: 1,
      title: 'Lesson 1',
      videoSrc: video1,
      description: 'Description for Lesson 1'
    },
    {
      id: 2,
      title: 'Lesson 2',
      videoSrc: video2,
      description: 'Description for Lesson 2'
    },
    {
      id: 3,
      title: 'Lesson 3',
      videoSrc: video3,
      description: 'Description for Lesson 3'
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lesson videos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {canPlayVideo(video.id) ? (
              <video 
                className="w-full h-48 object-cover"
                controls
                preload="metadata"
                disablePictureInPicture
                controlsList="nodownload noplaybackrate"
                onTimeUpdate={(e) => handleTimeUpdate(video.id, e)}
                onEnded={() => handleVideoEnded(video.id)}
              >
                <source src={video.videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <i className="fas fa-lock text-gray-500 text-2xl mb-2"></i>
                  <p className="text-gray-600">Hãy xem video {video.id - 1} trước</p>
                </div>
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
              <p className="text-gray-600">{video.description}</p>
              {!canPlayVideo(video.id) && (
                <p className="text-red-500 text-sm mt-2">
                  ⚠️ Bạn cần hoàn thành bài học trước để mở khóa video này
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LessonVideo; 