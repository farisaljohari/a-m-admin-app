import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons"; // Importing icons
import styled from "@emotion/styled";

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

const EditProjectDialog = ({ open, onClose, project, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false); // State for managing the submit loading

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setLocation(project.location);
      setImages(project.images || []);
    }
  }, [project]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const projectData = { title, location, images };

    try {
      await onSubmit(project.uuid, projectData);
      onClose();
    } catch (error) {
      console.error("Error updating the project:", error);
    } finally {
      setSubmitting(false);
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
      <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
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
          {submitting ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectDialog;
