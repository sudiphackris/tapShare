import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SeeFiles.css";
import { IoMdDownload } from "react-icons/io";
import { MdContentCopy, MdOutlineQrCode } from "react-icons/md";

//model
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { frontendUrlProd } from "./config";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 3,
};

const QR =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png";

const SeeFiles = () => {
  //model START
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //model END

  const { id } = useParams();
  const [files, setFiles] = React.useState([]); // [state, setState]

  const fetchFiles = async function fetchFiles() {
    const res = await axios.get(`https://tapshare.onrender.com/${id}`);
    // const res = await axios.get(`http://localhost:1337/${id}`);

    if (res.data.status === 200) {
      setFiles(res.data.files);
    } else {
      alert(res.data.message);
    }
  };
  React.useEffect(() => {
    fetchFiles();
  }, []);

  // copy link JS START
  const copyButtons = document.querySelectorAll(".sender .btn-copy-links");

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Get the input element next to the clicked button
      const input = button.parentNode.querySelector(".input-links");

      // Create a new temporary input element
      const tempInput = document.createElement("input");

      // Set the value of the temporary input element to the value of the original input element
      tempInput.value = input.value;

      // Append the temporary input element to the document
      document.body.appendChild(tempInput);

      // Select the text in the temporary input element
      tempInput.select();

      // Copy the selected text to the clipboard using the Clipboard API
      navigator.clipboard.writeText(tempInput.value);

      // Remove the temporary input element from the document
      document.body.removeChild(tempInput);

      // Change the text of the copy button to indicate that the text has been copied
      button.innerHTML = "Copied!";

      // Set a timeout to change the text of the copy button back to 'Copy' after 2 seconds
      setTimeout(() => {
        button.innerHTML = " Copy";
      }, 2000);
    });
  });
  const [remainingTime, setRemainingTime] = useState(
    parseInt(localStorage.getItem("remainingTime"), 10) || 24 * 60 * 60
  ); // retrieve remaining time from localStorage or set it to 24 hours in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("remainingTime", remainingTime.toString());
  }, [remainingTime]);

  // convert remaining time in seconds to hours, minutes, and seconds
  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  // copy link JS END
  return (
    <div>
      {localStorage.getItem("userId") === id ? (
        <div className="css-container sender">
          <h3 className="card-links-title title">Keep tapping! 👏</h3>
          {/* <div className="css-alert css-alert-success">
           <h5 className="css-alert-text">File Uploaded (10.9 MB)</h5>
         </div> */}
          <div className="css-alert css-alert-success">
            <h6 className="css-alert-text">
              Expires In: {hours}h {minutes}m {seconds}s
            </h6>
          </div>
          <div className="card-links">
            <div className="css-form-control">
              <label style={{ textAlign: "center", marginBottom: "10px" }}>
                The share <b>All</b> files, copy this link:
              </label>

              <div className="form-row">
                <input
                  type="text"
                  name="link"
                  id="link"
                  className="input-links"
                  value={"https://tapshare.xyz/" + id}
                  readOnly
                />
                <button className="css-btn-primary btn-copy-links btn-with-icon">
                  Copy{" "}
                  <span className="btn-icon">
                    <MdContentCopy />
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="card-links">
            <label>
              The share <b>Single</b> file, copy below link:
            </label>
            {files.map((file) => {
              {
              }
              return (
                <div className="css-form-control" key={file._id}>
                  <div className="form-row">
                    <input
                      type="text"
                      name="link"
                      id="link"
                      className="input-links"
                      value={file.name}
                      readOnly
                    />
                    <button className="css-btn-primary btn-copy-links btn-with-icon">
                      Copy{" "}
                      <span className="btn-icon">
                        <MdContentCopy />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}

            <div
              className="main-control-wrap"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "30px",
                flexWrap: "wrap",
              }}
            >
              <span>
                <a href={frontendUrlProd}>
                  <button className="css-btn-primary btn-primary-reverse">
                    Share Another
                  </button>
                </a>
              </span>
              <span>
                <a href="#">
                  <button
                    className="css-btn-primary btn-with-icon"
                    onClick={handleOpen}
                  >
                    {" "}
                    Share QR{" "}
                    <span className="btn-icon">
                      <MdOutlineQrCode />
                    </span>{" "}
                  </button>
                </a>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="css-container">
          <h3 className="card-links-title title">Keep tapping! 👏</h3>
          {/* <div className="css-alert css-alert-success">
            <h5 className="css-alert-text">File Received (10.99 MB)</h5>
          </div> */}
          <label>The download this file, click on the download button</label>
          <div className="card-links">
            {files.map((file) => {
              return (
                <div className="css-form-control" key={file._id}>
                  <div className="form-row">
                    <input
                      type="text"
                      name="link"
                      id="link"
                      className="input-links"
                      value={file.name}
                      readOnly
                    />

                    <a href={file.path}>
                      <button
                        className="css-btn-primary btn-copy-links btn-with-icon"
                        style={{ width: "100%" }}
                      >
                        Download
                        <span className="btn-icon">
                          <IoMdDownload />
                        </span>
                      </button>
                    </a>
                  </div>
                </div>
              );
            })}

            <div>
              <a href={frontendUrlProd}>
                <button className="css-btn-primary">Share your file</button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* model  START*/}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <img src={QR} /> */}
          <h3 style={{ textAlign: "center" }}>Coming Soon, Keep tapping !</h3>
        </Box>
      </Modal>
      {/* modeal END  */}
    </div>
  );
};

export default SeeFiles;
