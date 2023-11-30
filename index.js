import { ShakeVideoElement } from "./classes/ShakeVideoElement.js";

//define custom element
function registerElement(){
customElements.define('shake-video-element', ShakeVideoElement);
}
export {
  ShakeVideoElement,
  registerElement
};
