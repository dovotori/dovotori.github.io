const stopPropa = (e) => {
    e.stopPropagation();
    e.preventDefault();
};

const dragEnter = (e) => {
    stopPropa(e);
    document.querySelector("#dropbox").style.opacity = 0.8;
};

const dragLeave = (e) => {
    stopPropa(e);
    document.querySelector("#dropbox").style.opacity = 0.5;
};

export const setup = (handleFile) => {
    const inputSelectFile = (e) => {
        stopPropa(e);
        const file = e.target.files[0] || null;
        if (file) handleFile(file);
    };

    const dropSelectFile = (e) => {
        stopPropa(e);
        const file = e.dataTransfer.files[0] || null;
        if (file) handleFile(file);
    };

    const dropbox = document.querySelector("#dropbox");
    dropbox.addEventListener("dragenter", dragEnter);
    dropbox.addEventListener("dragleave", dragLeave);
    dropbox.addEventListener("dragover", stopPropa);
    dropbox.addEventListener("drop", dropSelectFile);

    const uploadInput = document.querySelector("#fileinput");
    uploadInput.addEventListener("change", inputSelectFile);
};

