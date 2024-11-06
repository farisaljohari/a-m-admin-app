import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AboutImage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imageUuid, setImageUuid] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchImage = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://a-m-admin-api.onrender.com/picture/about"
      );
      setImageUrl(`data:image/png;base64,${response.data.image}`);
      setImageUuid(response.data.uuid);
    } catch (error) {
      const message =
        error.response?.data?.message || "Error fetching the image.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  const handleImageDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleUpload = async () => {
    if (!newImage) return;
    try {
      setLoading(true);
      const base64Image = await convertToBase64(newImage);
      const jsonBody = {
        image: base64Image.split(",")[1],
        type: "about_image",
      };

      axios
        .put(
          `https://a-m-admin-api.onrender.com/picture/${imageUuid}`,
          jsonBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Image uploaded successfully:", response);
          fetchImage(); // Re-fetch the image after uploading
          setPreviewUrl(""); // Clear the preview after upload
          setNewImage(null);
        })
        .catch((error) => {
          console.error("Error uploading the image:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      const message =
        error.response?.data?.message || "Error editing the image.";
      toast.error(message);
      setLoading(false);
    }
  };

  // Setup the dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleImageDrop,
    accept: "image/*",
  });

  return (
    <>
      <Box
        sx={{
          p: 3,
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          marginTop: "50px",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ color: "#333" }}
        >
          About Image
        </Typography>

        <Card
          sx={{
            maxWidth: 600,
            margin: "0 auto",
            boxShadow: 3,
            borderRadius: "8px",
          }}
        >
          <CardContent>
            {loading ? (
              <Box display="flex" justifyContent="center" p={5}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Fetched from API"
                    style={{
                      width: "100%",
                      height: "400px",
                      borderRadius: "8px",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                )}
                {previewUrl && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
                      Preview:
                    </Typography>
                    <img
                      src={previewUrl}
                      alt="Selected"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}
            <Box
              {...getRootProps()}
              sx={{
                mt: 2,
                p: 2,
                border: "2px dashed #007bff",
                borderRadius: "8px",
                backgroundColor: isDragActive ? "#e7f1ff" : "#fff",
                transition: "background-color 0.3s",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography sx={{ color: "#007bff" }}>
                  Drop the image here...
                </Typography>
              ) : (
                <Typography sx={{ color: "#666" }}>
                  Drag & drop an image here, or click to select
                </Typography>
              )}
            </Box>
            {newImage && (
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: "100%",
                  backgroundColor: "#28a745",
                  "&:hover": {
                    backgroundColor: "#218838",
                  },
                  mt: 2,
                }}
                onClick={handleUpload}
              >
                Upload Image
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
      <ToastContainer position="top-center" />
    </>
  );
};

export default AboutImage;
