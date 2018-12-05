export default class MenuItem {
  constructor(labelText, type, callback = null, foregroundColor = null) {
    this.foregroundColor = foregroundColor;
    this.labelText = labelText;
    this.callback = callback;
    this.type = type;
  }
}
