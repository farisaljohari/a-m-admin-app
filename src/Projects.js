import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faMapMarkerAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "@emotion/styled";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css"; // Adjust the path as necessary

const LocationIcon = styled(FontAwesomeIcon)`
  margin-right: 5px;
  color: #23ce6b;
`; // Using your primary green color

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`; // Space between images
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

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectDetails, setProjectDetails] = useState({
    title: "",
    location: "",
    images: [],
  });
  const [projectUuid, setProjectUuid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "https://a-m-admin-api.onrender.com/project"
      );
      setProjects(response.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Error fetching the projects.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpen = () => {
    if (projects.length >= 30) {
      toast.error(
        "You can only have up to 30 projects. Please remove a project to add a new one."
      );
      return;
    }
    setOpen(true);
    setProjectDetails({ title: "", location: "", images: [] }); // Reset for new project
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteOpen = (project) => {
    setProjectToDelete(project);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setProjectToDelete(null);
  };

  const confirmDelete = async () => {
    if (projects.length <= 2) {
      toast.error("You must keep at least two projects.");
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(
        `https://a-m-admin-api.onrender.com/project/${projectToDelete.uuid}`
      );
      fetchProjects();
    } catch (error) {
      const message =
        error.response?.data?.message || "Error deleting the project.";
      toast.error(message);
    } finally {
      setDeleting(false);
      handleDeleteClose();
    }
  };

  const handleImageDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const newImagesCount = projectDetails.images.length + files.length;

    if (newImagesCount > 6) {
      toast.error("You can only add up to 6 images.");
      return;
    }

    const base64Images = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Images.push(reader.result);
        if (base64Images.length === files.length) {
          setProjectDetails((prev) => ({
            ...prev,
            images: [...prev.images, ...base64Images],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };
  console.log("projectDetails", projectDetails);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImagesCount = projectDetails.images.length + files.length;

    if (newImagesCount > 6) {
      toast.error("You can only add up to 6 images.");
      return;
    }

    const base64Images = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Images.push({ image: reader.result });
        if (base64Images.length === files.length) {
          setProjectDetails((prev) => ({
            ...prev,
            images: [...prev.images, ...base64Images],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const projectData = {
      title: projectDetails.title,
      location: projectDetails.location,
      images: projectDetails.images,
    };

    const transformedProjectData = {
      ...projectData,
      images: projectDetails.images.map((image) => image.image),
    };

    try {
      await axios.post(
        "https://a-m-admin-api.onrender.com/project",
        transformedProjectData
      );
      fetchProjects();
      handleClose();
    } catch (error) {
      const message =
        error.response?.data?.message || "Error adding the project.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index) => {
    setProjectDetails((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveImageUp = (index) => {
    if (index > 0) {
      const newImages = [...projectDetails.images];
      [newImages[index], newImages[index - 1]] = [
        newImages[index - 1],
        newImages[index],
      ];
      setProjectDetails((prev) => ({ ...prev, images: newImages }));
    }
  };

  const moveImageDown = (index) => {
    if (index < projectDetails.images.length - 1) {
      const newImages = [...projectDetails.images];
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
      setProjectDetails((prev) => ({ ...prev, images: newImages }));
    }
  };

  const handleProjectClick = (project) => {
    setProjectDetails({
      title: project.title,
      location: project.location,
      images: project.images || [],
    });
    setProjectUuid(project.uuid);
    setDetailsOpen(true);
  };

  const handleSaveDetails = async () => {
    setIsSaving(true);
    try {
      const transformedProjectDetails = {
        ...projectDetails,
        images: projectDetails.images.map((image) => image.image),
      };

      await axios.put(
        `https://a-m-admin-api.onrender.com/project/${projectUuid}`,
        transformedProjectDetails
      );
      fetchProjects();
      setDetailsOpen(false);
    } catch (error) {
      const message =
        error.response?.data?.message || "Error saving project details.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Projects
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ marginBottom: "20px" }}
      >
        Add Project
      </Button>
      {loading ? (
        <CircularProgress style={{ display: "block", margin: "0 auto" }} />
      ) : (
        <Grid container spacing={5} className="grid">
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={6} lg={5} key={project.id}>
              <Card
                className="card"
                style={{ position: "relative" }}
                onClick={() => handleProjectClick(project)}
              >
                <Slider
                  dots
                  infinite={project.images.length > 1} // Disable infinite loop for single image
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                >
                  {project.images && project.images.length > 0 ? (
                    project.images.map((image, index) => (
                      <div key={index}>
                        <CardMedia
                          component="img"
                          image={`${image.image}`}
                          alt={`Project ${project.id} image ${index + 1}`}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      </div>
                    ))
                  ) : (
                    <div>No images available for this project.</div>
                  )}
                </Slider>

                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <span style={{ fontWeight: "bold" }}>{project.title}</span>
                    <Typography variant="subtitle1">
                      <LocationIcon
                        icon={faMapMarkerAlt}
                        style={{ color: "gray" }}
                      />
                      <span style={{ color: "gray", fontWeight: "200" }}>
                        {" "}
                        {project.location}
                      </span>{" "}
                    </Typography>
                    <div
                      style={{
                        backgroundColor: "red",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        cursor: "pointer",
                        padding: "7px",
                        zIndex: 1000,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        color="white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOpen(project);
                        }}
                      />
                    </div>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal for adding a project */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={projectDetails.title}
            onChange={(e) =>
              setProjectDetails((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            variant="outlined"
            value={projectDetails.location}
            onChange={(e) =>
              setProjectDetails((prev) => ({
                ...prev,
                location: e.target.value,
              }))
            }
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
            <Typography variant="body1">Drag and drop images here</Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginTop: "10px" }}
            />
            <Typography
              variant="caption"
              style={{ display: "block", marginTop: "5px" }}
            >
              Or click to select files
            </Typography>
          </div>
          {projectDetails.images.length > 0 && (
            <ImageContainer>
              <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
                Selected Images:
              </Typography>
              {projectDetails.images.map((img, index) => (
                <div
                  key={index}
                  style={{ position: "relative", marginTop: "10px" }}
                >
                  <StyledImage src={img.image} alt={`Preview ${index + 1}`} />
                  <ImageActions>
                    <div
                      style={{
                        backgroundColor: "red",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        cursor: "pointer",
                        padding: "2px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        color="white"
                        onClick={() => removeImage(index)}
                      />
                    </div>

                    <div
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#212121b2",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "60px",
                        padding: "2px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        color="white"
                        onClick={() => moveImageUp(index)}
                        style={{
                          fontSize: "20px",
                        }} // Adjust styles as needed
                      />
                    </div>
                    <div
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#212121b2",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "25px",
                        padding: "2px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faArrowDown}
                        color="white"
                        onClick={() => moveImageDown(index)}
                        style={{
                          fontSize: "20px",
                        }} // Adjust styles as needed
                      />
                    </div>
                  </ImageActions>
                </div>
              ))}
            </ImageContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={
              !projectDetails.title ||
              !projectDetails.location ||
              projectDetails.images.length === 0 ||
              isSubmitting // Disable while submitting
            }
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for deleting a project */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this project?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary" disabled={deleting}>
            {deleting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for project details */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <DialogTitle>Project Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={projectDetails.title}
            onChange={(e) =>
              setProjectDetails((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            variant="outlined"
            value={projectDetails.location}
            onChange={(e) =>
              setProjectDetails((prev) => ({
                ...prev,
                location: e.target.value,
              }))
            }
          />
          <div
            style={{
              border: "2px dashed #ccc",
              padding: "20px",
              marginTop: "10px",
              textAlign: "center",
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange(e);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Typography variant="body1">Drag and drop images here</Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginTop: "10px" }}
            />
            <Typography
              variant="caption"
              style={{ display: "block", marginTop: "5px" }}
            >
              Or click to select files
            </Typography>
          </div>
          {projectDetails.images.length > 0 && (
            <ImageContainer>
              <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
                Images:
              </Typography>
              {projectDetails.images.map((img, index) => (
                <div
                  key={index}
                  style={{ position: "relative", marginTop: "10px" }}
                >
                  <StyledImage
                    src={img.image}
                    alt={`Details Preview ${index + 1}`}
                  />
                  <ImageActions>
                    <div
                      style={{
                        backgroundColor: "red",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        cursor: "pointer",
                        padding: "2px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        color="white"
                        onClick={() => removeImage(index)}
                      />
                    </div>
                    <div
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#212121b2",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "60px",
                        padding: "2px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        color="white"
                        onClick={() => moveImageUp(index)}
                        style={{
                          fontSize: "20px",
                        }} // Adjust styles as needed
                      />
                    </div>
                    <div
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#212121b2",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "25px",
                        padding: "2px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faArrowDown}
                        color="white"
                        onClick={() => moveImageDown(index)}
                        style={{
                          fontSize: "20px",
                        }} // Adjust styles as needed
                      />
                    </div>
                  </ImageActions>
                </div>
              ))}
            </ImageContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveDetails}
            color="primary"
            disabled={
              !projectDetails.title ||
              !projectDetails.location ||
              projectDetails.images.length === 0 ||
              isSaving // Disable while saving
            }
          >
            {isSaving ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Projects;
