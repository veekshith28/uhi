import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { useParams } from "react-router-dom";
import { ReactMic } from "react-mic";

function PatientDetails() {
  const [profileData, setProfileData] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        dispatch(showLoading());
        const response = await axios.post(
          "/api/user/get-user-info-by-id",
          {
            userId: params.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(hideLoading());

        if (response.data.success) {
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.log(error);
        dispatch(hideLoading());
      }
    }

    fetchData();
  }, [dispatch, params.userId]);

  const onStartRecording = () => {
    setIsRecording(true);
  };

  const onStopRecording = (recordedBlob) => {
    console.log("Recorded Blob:", recordedBlob);
    setRecordedBlob(recordedBlob);
    setIsRecording(false);
  };

  const handlePlay = () => {
    const audioElement = document.getElementById("audio-preview");
    if (audioElement) {
      audioElement.play();
    }
  };

  const handlePause = () => {
    const audioElement = document.getElementById("audio-preview");
    if (audioElement) {
      audioElement.pause();
    }
  };

  return (
    <Layout>
      <h1 className="page-title">User Profile</h1>
      <hr />
      {profileData ? (
        <div>
        <p><strong>ID:</strong> {profileData._id}</p>
        <p><strong>Name:</strong> {profileData.name}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Password:</strong> {profileData.password}</p> {/* Note: Displaying passwords is not recommended */}
        <p><strong>Is Doctor:</strong> {profileData.isDoctor.toString()}</p>
        <p><strong>Is Admin:</strong> {profileData.isAdmin.toString()}</p>
        <p><strong>Seen Notifications:</strong> {profileData.seenNotifications.length}</p>
        <p><strong>Unseen Notifications:</strong> {profileData.unseenNotifications.length}</p>
        
          
      </div>
      ) : (
        <p>Loading...</p>
      )}

      {/* Recording control buttons */}
      <ReactMic
        record={isRecording}
        onStop={onStopRecording}
        onData={() => {}}
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />
      <button onClick={onStartRecording}>Start Recording</button>
      <button onClick={onStopRecording}>Stop Recording</button>

      {/* Audio preview */}
      {recordedBlob && (
        <div>
          <audio
            id="audio-preview"
            controls
            src={recordedBlob.blobURL}
          />
          <button onClick={handlePlay}>Play</button>
          <button onClick={handlePause}>Pause</button>
        </div>
      )}
    </Layout>
  );
}

export default PatientDetails;
