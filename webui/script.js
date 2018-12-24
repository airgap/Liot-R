function grab(elem, root) {
  return typeof elem === 'string' ? (grab(root) || document).getElementById(elem) : elem;
}
function bind(elem, trigger, func) {
  elem.addEventListener(trigger, func)
}
function load(func) {
  bind(window, 'DOMContentLoaded', func)
}
