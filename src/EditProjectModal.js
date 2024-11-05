// EditProjectModal.js

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"; // Importing icons
import styled from "@emotion/styled";
import axios from "axios";

// Styled component for the icons
const DeleteIcon = styled(FontAwesomeIcon)`
  color: red;
  cursor: pointer;
  margin-left: 10px;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px; // Space between images
`;

const StyledImage = styled.img`
  height: 150px;
  width: 150px;
  object-fit: cover;
  border: 1px solid #ccc; // Border around images
  border-radius: 5px; // Rounded corners
  position: relative;
`;

const ImageActions = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  flex-direction: column;
`;

const EditProjectModal = ({ open, onClose, project, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false); // State for managing the submit loading

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setLocation(project.location);
      setImages(project.images.map((image) => image.image)); // Adjust according to your data structure
    }
  }, [project]);

  const handleImageDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const base64Images = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Images.push(reader.result);
        if (base64Images.length === files.length) {
          setImages((prevImages) => [...prevImages, ...base64Images]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const base64Images = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Images.push(reader.result);
        if (base64Images.length === files.length) {
          setImages((prevImages) => [...prevImages, ...base64Images]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true); // Set loading state to true when submitting
    const projectData = {
      title,
      location,
      images,
    };

    try {
      await axios.put(
        `https://a-m-admin-api.onrender.com/project/${project.uuid}`,
        projectData
      );
      onUpdate(); // Callback to refresh projects
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating the project:", error);
    } finally {
      setSubmitting(false); // Reset loading state after submission
    }
  };

  const moveImageUp = (index) => {
    if (index > 0) {
      const updatedImages = [...images];
      [updatedImages[index - 1], updatedImages[index]] = [
        updatedImages[index],
        updatedImages[index - 1],
      ];
      setImages(updatedImages);
    }
  };

  const moveImageDown = (index) => {
    if (index < images.length - 1) {
      const updatedImages = [...images];
      [updatedImages[index + 1], updatedImages[index]] = [
        updatedImages[index],
        updatedImages[index + 1],
      ];
      setImages(updatedImages);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Location"
          fullWidth
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div
          style={{
            border: "2px dashed #ccc",
            padding: "20px",
            marginTop: "10px",
            textAlign: "center",
          }}
          onDrop={handleImageDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: "10px" }}
          />
          <ImageContainer>
            {images.map((image, index) => (
              <div key={index} style={{ position: "relative" }}>
                <StyledImage src={image} alt={`Project image ${index + 1}`} />
                <ImageActions>
                  <IconButton
                    size="small"
                    onClick={() => moveImageUp(index)}
                    disabled={index === 0}
                  >
                    <FontAwesomeIcon icon={faArrowUp} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => moveImageDown(index)}
                    disabled={index === images.length - 1}
                  >
                    <FontAwesomeIcon icon={faArrowDown} />
                  </IconButton>
                  <IconButton size="small" onClick={() => removeImage(index)}>
                    <DeleteIcon icon={faTrash} />
                  </IconButton>
                </ImageActions>
              </div>
            ))}
          </ImageContainer>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={!title || !location || images.length === 0 || submitting}
        >
          {submitting ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectModal;
