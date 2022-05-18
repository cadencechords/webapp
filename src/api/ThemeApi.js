export default class ThemeApi {
  static createOne(newTheme) {
    let { data: themes } = this.getAll();
    let nextId = this.calculateNextId(themes.map((t) => t.id));

    let createdTheme = {
      ...newTheme,
      id: nextId,
      created_at: new Date(),
      updated_at: new Date(),
    };

    themes.push(createdTheme);

    this.setAllThemesInStorage(themes);
    return { data: createdTheme };
  }

  static setAllThemesInStorage(themes) {
    let stringified = JSON.stringify(themes);
    localStorage.setItem("themes", stringified);
  }

  static setThemeInStorage(theme) {
    let { data: themes } = this.getAll();
    themes = themes.map((t) => (t.id === theme.id ? theme : t));
    this.setAllThemesInStorage(themes);
  }

  static calculateNextId(ids) {
    let max = Math.max(...ids);
    return isFinite(max) ? max + 1 : 1;
  }

  static getAll() {
    let themes = localStorage.getItem("themes");

    if (!themes) {
      localStorage.setItem("themes", "[]");
      themes = [];
    } else {
      themes = JSON.parse(themes);
    }

    return { data: themes };
  }
}
