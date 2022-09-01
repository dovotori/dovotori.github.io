let dropbox = null;
let uploadLog = null;

const stopPropa = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

const dragEnter = (e) => {
  stopPropa(e);
  dropbox.style.opacity = 0.8;
};

const dragLeave = (e) => {
  stopPropa(e);
  dropbox.style.opacity = 0.5;
};

const resetError = () => {
  if (uploadLog) {
    uploadLog.innerHTML = "";
    uploadLog.style.display = "none";
  }
};

export const setError = (log) => {
  if (uploadLog) {
    uploadLog.innerHTML = log;
    uploadLog.style.display = "block";
  }
};

export const setup = (handleFile) => {
  const inputSelectFile = (e) => {
    stopPropa(e);
    resetError();
    const file = e.target.files[0] || null;
    if (file) handleFile(file);
  };

  const dropSelectFile = (e) => {
    stopPropa(e);
    resetError();
    const file = e.dataTransfer.files[0] || null;
    if (file) handleFile(file);
  };

  dropbox = document.querySelector("#dropbox");
  dropbox.addEventListener("dragenter", dragEnter);
  dropbox.addEventListener("dragleave", dragLeave);
  dropbox.addEventListener("dragover", stopPropa);
  dropbox.addEventListener("drop", dropSelectFile);

  const uploadInput = document.querySelector("#fileinput");
  uploadInput.addEventListener("change", inputSelectFile);

  uploadLog = document.querySelector("#filelog");
};

export const destroy = () => {
  if (dropbox) {
    dropbox.removeEventListener("dragenter", dragEnter);
    dropbox.removeEventListener("dragleave", dragLeave);
    dropbox.removeEventListener("dragover", stopPropa);
  }
}
