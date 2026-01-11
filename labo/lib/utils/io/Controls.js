import Fullscreen from "./Fullscreen";

export default class {
  constructor(container, config) {
    this.controlsDomItem = document.createElement("div");
    this.controlsDomItem.id = "controls";
    this.controlsDomItem.style.opacity = 0;
    this.controlsDomItem.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    const { fullscreen, ranges, checkboxes } = config;

    if (ranges) {
      this.ranges = Object.keys(ranges).reduce((acc, id) => {
        const { min = 0, max = 100, value = 0, label = null } = ranges[id];
        const domDiv = document.createElement("div");
        const domRange = document.createElement("input");
        domRange.setAttribute("type", "range");
        domRange.setAttribute("id", id);
        domRange.setAttribute("min", min);
        domRange.setAttribute("max", max);
        domRange.setAttribute("value", value);
        domRange.setAttribute("name", id);
        if (label) {
          const domLabel = document.createElement("label");
          domLabel.setAttribute("for", id);
          domLabel.innerHTML = label;
          domDiv.appendChild(domLabel);
        }
        domDiv.appendChild(domRange);
        this.controlsDomItem.appendChild(domDiv);
        return { ...acc, [id]: { id, min, max, value, dom: domRange } };
      }, {});
    }

    if (checkboxes) {
      this.checkboxes = Object.keys(checkboxes).reduce((acc, id) => {
        const { checked = false, label = null } = checkboxes[id];
        const domDiv = document.createElement("div");
        domDiv.classList.add("checkbox-item");
        const domCheckbox = document.createElement("input");
        domCheckbox.setAttribute("type", "checkbox");
        domCheckbox.setAttribute("id", id);
        domCheckbox.setAttribute("name", id);
        if (checked) domCheckbox.setAttribute("checked", "checked");
        if (label) {
          const domLabel = document.createElement("label");
          domLabel.setAttribute("for", id);
          domLabel.innerHTML = label;
          domDiv.appendChild(domLabel);
        }
        domDiv.appendChild(domCheckbox);
        this.controlsDomItem.appendChild(domDiv);
        return { ...acc, [id]: { id, checked, dom: domCheckbox } };
      }, {});
    }

    if (fullscreen) {
      this.fullscreen = new Fullscreen(container);
      this.controlsDomItem.appendChild(this.fullscreen.getButton());
    }
  }

  getDomItem = () => this.controlsDomItem;

  getRanges = () => this.ranges;

  getCheckboxes = () => this.checkboxes;

  destroy() {
    if (this.fullscreen) {
      this.fullscreen.destroy();
    }
  }
}
