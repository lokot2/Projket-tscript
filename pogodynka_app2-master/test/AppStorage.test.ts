import { INote } from "../src/interface";
import { AppStorage } from "../src/AppStorage";
import { Notes } from "../src/Notes";
import { Main } from "../src/index";


// assertions as usual:
it("getData  from localstorage", () => {
  const appStorage = new AppStorage();
  let tab = appStorage.getData();
  expect(tab).toEqual([]);
});

it("saveData  from localstorage", () => {
  const appStorage = new AppStorage();
  const body: INote = {
    title: "Notatka",
    description: "Opis",
    id: 1,
    color: "yellow",
    date: new Date("2021-11-02"),
    upList: true,
  };
  appStorage.saveData(body);
  let tab = appStorage.getData();
  console.log(tab);
  expect(tab).toHaveLength(1);
});

// it("delete from localstorage", () => {
//   const appStorage = new AppStorage();
//   const main = new Main();
//   const notes = new Notes(main);
//   const body: INote = {
//     title: "Notatka",
//     description: "Opis",
//     id: 1,
//     color: "yellow",
//     date: new Date("2021-11-02"),
//     upList: true,
//   };
//   appStorage.saveData(body);
//   let tab = appStorage.getData();
//   expect(tab).toHaveLength(1);
//   notes.removeNote(1);
//   tab = appStorage.getData();
//   console.log(tab);
//   expect(tab).toHaveLength(0);
// });
