import "./style.scss";

import { INote } from "./interface";

import { DATA_KEY } from "./AppStorage";
import { Main } from "./index";

enum LIST_ELEMTNS {
  name = "name",
  description = "description",
  title = "title",
  date = "date",
  icon = "icon",
}

export class Notes {
  mainContext: Main;
  constructor(main: Main) {
    this.mainContext = main;
  }

  // aside UI
  removeNote(id: number) {
    const allNotes: INote[] = JSON.parse(localStorage.getItem(DATA_KEY));
    if (allNotes && id) {
      const filterdCities = allNotes.filter((v) => v.id !== id);
      localStorage.setItem(DATA_KEY, JSON.stringify(filterdCities));
      this.renderWeatherList(filterdCities, true);
    }
  }
  editBtnEl(id: number) {
    let allNotes: INote[] = JSON.parse(localStorage.getItem(DATA_KEY));
    const dialog = document.getElementById("myDialog") as HTMLDialogElement;
    const title = document.getElementById(
      "noteTitleUpdate"
    ) as HTMLInputElement;
    const description = document.getElementById(
      "noteDescriptionUpdate"
    ) as HTMLInputElement;
    const update = document.getElementById("update") as HTMLButtonElement;
    let self = this
    dialog.open = true;
    if (allNotes && id) {
      allNotes.map((v) => {
        if (v.id === id) {
          title.value = v.title;
          description.value = v.description;
        }
      });
      update.addEventListener("click", function () {
        allNotes.map((v) => {
          if (v.id === id) {
            v.title = title.value;
            v.description = description.value;
          }
        });
        localStorage.setItem(DATA_KEY, JSON.stringify([...allNotes]));
        dialog.open = false;
        self.renderWeatherList(allNotes, true);
    });
    }
  }

  populateListElement(element: HTMLElement, noteData: INote) {
    const parentId = element.id;
    document.querySelector(
      `#${parentId} #${parentId}_${LIST_ELEMTNS.name}`
    ).innerHTML = noteData.title;
    document.querySelector(
      `#${parentId} #${parentId}_${LIST_ELEMTNS.description}`
    ).innerHTML = `${noteData.description}`;
    document.querySelector(
      `#${parentId} #${parentId}_${LIST_ELEMTNS.date}`
    ).innerHTML = `${noteData.date}`;
    return element;
  }

  renderWeatherElement(noteData: INote, elementId: string) {
    const wrapper = document.getElementById("noteList");
    const element = document.createElement("li");
    element.id = elementId;
    // other elements
    const elementBtn = document.createElement("button");
    const elementBtnContainer = document.createElement("div");
    elementBtnContainer.style.backgroundColor = noteData.color;
    const elementBtnContainerChild = document.createElement("div");
    elementBtn.className = "city-list-item";
    elementBtnContainerChild.style.backgroundColor = noteData.color;
    // name
    const nameEl = document.createElement("p");
    nameEl.id = `${elementId}_${LIST_ELEMTNS.name}`;
    elementBtnContainerChild.appendChild(nameEl);
    // description
    const description = document.createElement("span");
    description.id = `${elementId}_${LIST_ELEMTNS.description}`;
    elementBtnContainerChild.appendChild(description);

    const date = document.createElement("span");
    date.id = `${elementId}_${LIST_ELEMTNS.date}`;
    elementBtnContainerChild.appendChild(date);
    // remove button
    const removeBtnEl = document.createElement("button");
    const editBtnEl = document.createElement("button");
    removeBtnEl.className = "city-list-item-removeBtn";

    removeBtnEl.addEventListener("click", (e) => this.removeNote(noteData.id));
    editBtnEl.addEventListener("click", (e) => this.editBtnEl(noteData.id));

    // activation
    elementBtn.addEventListener("click", () => {
      this.mainContext.changeActiveNote(noteData.id);
    });

    // appending
    elementBtnContainer.appendChild(elementBtnContainerChild);
    elementBtn.appendChild(elementBtnContainer);
    element.appendChild(elementBtn);
    element.appendChild(removeBtnEl);
    element.appendChild(editBtnEl);
    if (noteData.upList) {
      wrapper.prepend(element);
    } else {
      wrapper.appendChild(element);
    }

    this.populateListElement(element, noteData);
  }

  renderWeatherList(noteData: INote[], force: boolean = false) {
    if (force) {
      const wrapper = document.getElementById("noteList");
      wrapper.innerHTML = null;
    }
    noteData.forEach((data) => {
      const elementId = `listEl_${data.id}`;
      const element = document.getElementById(elementId) as HTMLElement;
      // to avoid unnecessaary re-rendering of all list, just refresh new content
      if (element) this.populateListElement(element, data);
      else this.renderWeatherElement(data, elementId);
    });
  }
}
