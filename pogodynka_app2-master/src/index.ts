import "./style.scss";

import { INote, IWeatherData } from "./interface";
import { saveInFirestore } from "./config";
import { ApiCaller } from "./apiCaller";
import { AppFirestoreStorage } from "./AppFirestoreStorage";
import { AppStorage } from "./AppStorage";
import { UI } from "./UI";
import { Notes } from "./Notes";

const ACTIVE_CITY_KEY = "active_city";

export class Main {
  apiCaller: ApiCaller;
  appStorage: AppStorage;
  UI: UI;
  appFirestore: AppFirestoreStorage;
  Notes: Notes;
  weatherData: IWeatherData[];
  notesData: INote[];
  note: INote;
  activeNote: INote["id"] = Number(localStorage.getItem(ACTIVE_CITY_KEY));
  activeNoteData: INote;
  constructor() {
    this.apiCaller = new ApiCaller();
    this.appStorage = new AppStorage();
    this.appFirestore = new AppFirestoreStorage();
    this.UI = new UI(this);
    this.Notes = new Notes(this);
    this.weatherData = this.apiCaller.getData();
    this.notesData = this.appStorage.getData();
    // this.setActiveNote();
    this.initRefresher();
    this.bindInputEvents();
    this.UI.renderWeatherList(this.weatherData);
    this.Notes.renderWeatherList(this.notesData);
  }

  initRefresher() {
    // Refresh data every hour
    setInterval(() => {
      this.apiCaller.refreshData().then((currentData) => {
        this.weatherData = currentData;
        this.UI.renderWeatherList(this.weatherData);
      });
      if (this.activeNote) {
        this.setActiveNote();
      }
    }, 3600000);
  }

  bindInputEvents() {
    const noteForm = document.getElementById("notesForm");
    const titleButton = document.getElementById(
      "noteTitle"
    ) as HTMLButtonElement;
    const descriptionButton = document.getElementById(
      "noteDescription"
    ) as HTMLSelectElement;
    const upNoteInput = document.getElementById("noteUp") as HTMLInputElement;
    const selectInput = document.getElementById(
      "noteColor"
    ) as HTMLInputElement;

    noteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.note = {
        id: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        title: titleButton.value,
        description: descriptionButton.value,
        color: selectInput.value,
        upList: upNoteInput.checked,
        date: new Date(),
      };
      if (titleButton.value !== "" && descriptionButton.value !== "") {
        if (saveInFirestore) {
          this.appFirestore.createNote(this.note);
        } else {
          this.appStorage.saveData(this.note);
        }
        this.notesData = this.appStorage.getData();
        titleButton.value = "";
        descriptionButton.value = "";
        this.Notes.renderWeatherList(this.notesData);
      }
    });
  }

  setActiveNote() {
    const activeNote = this.notesData.find(
      (city) => city.id === this.activeNote
    );
    // if (activeNote) {
    //   this.apiCaller
    //     .getForecastData(activeNote.coord.lat, activeNote.coord.lon)
    //     .then((activeForecast) => {
    //       this.activeNoteData = activeForecast;
    //       this.UI.renderMainView(this.activeNoteData, activeNote);
    //     });
    // }
  }

  changeActiveNote(index: IWeatherData["id"]) {
    this.activeNote = index;
    localStorage.setItem(ACTIVE_CITY_KEY, String(index));
    this.setActiveNote();
  }
}

new Main();
