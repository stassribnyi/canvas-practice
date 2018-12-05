export default class MenuItem {
  constructor(labelText, type, callback = null) {
    this.callback = callback;
    this.labelText = labelText;
    this.type = type;
  }
}
