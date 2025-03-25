import React, { useState, useEffect, useRef } from 'react';
import video1 from '../assets/videos/SampleVideo1.mp4';
import video2 from '../assets/videos/SampleVideo2.mp4';
import video3 from '../assets/videos/SampleVideo3.mp4';
import video6 from '../assets/videos/SampleVideo4.mp4';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './LessonPage.css';

function LessonVideo() {
  const [currentTimes, setCurrentTimes] = useState({});
  const [completedVideos, setCompletedVideos] = useState([]);
  const [titleModal, setTitleModal] = React.useState();
  const [contentModal, setContentModal] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = (lesson) => {
    setTitleModal(lesson.title)
    setContentModal(lesson.description)
    handleVideoEnded(lesson.id)
    setOpen(true)
  };
  const handleClose = () => {
    setOpen(false)
  };
  
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

  //type: video/text/pdf/doc/slider/...
  const lessons = [
    {
      id: 1,
      title: 'Lesson 1',
      src: video1,
      type: 'video',
      description: 'Description for Lesson 1'
    },
    {
      id: 2,
      title: 'Lesson 2',
      src: null,
      type: 'text',
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
    },
    {
      id: 3,
      title: 'Lesson 3',
      src: null,
      type: 'text',
      description: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`
    },
    {
      id: 4,
      title: 'Lesson 4',
      src: video2,
      type: 'video',
      description: 'Description for Lesson 4'
    },
    {
      id: 5,
      title: 'Lesson 5',
      src: video3,
      type: 'video',
      description: 'Description for Lesson 5'
    },
    {
      id: 6,
      title: 'Lesson 6',
      src: video6,
      type: 'video',
      description: 'Description for Lesson 6'
    }
  ];

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lesson videos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {canPlayVideo(lesson.id) ? (
              lesson.type === 'video' ? (
                <video 
                  className="w-full h-48 object-cover"
                  controls
                  preload="metadata"
                  disablePictureInPicture
                  controlsList="nodownload noplaybackrate"
                  onTimeUpdate={(e) => handleTimeUpdate(lesson.id, e)}
                  onEnded={() => handleVideoEnded(lesson.id)}
                >
                  <source src={lesson.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    onClick={() => handleOpen(lesson)}
                  >
                    Đọc
                  </button>
                </div>
              )
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <i className="fas fa-lock text-gray-500 text-2xl mb-2"></i>
                  <p className="text-gray-600">Hãy xem bài học {lesson.id - 1} trước</p>
                </div>
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
              <p className="text-gray-600">{lesson.description.substring(0, 35)}</p>
              {!canPlayVideo(lesson.id) && (
                <p className="text-red-500 text-sm mt-2">
                  ⚠️ Bạn cần hoàn thành bài học trước để mở khóa bài học này
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {titleModal}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {contentModal}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default LessonVideo; 