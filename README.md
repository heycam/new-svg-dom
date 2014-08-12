A partial implementation of a polyfill for the [SVG DOM improvement proposal](http://dev.w3.org/SVG/proposals/improving-svg-dom/)
so that people can get a feel of it.

Usage
=====

Include `<script src="new-svg-dom.js"></script>` early on in your HTML
document.  Then, you can write inline SVG using `<graphics>` elements.

There are four options for reflecting length-typed attributes, illustrated here by how `x` is reflected on a `<rect>` element:

* "string" (the default): `SVG2RectElement.x` is a string that reflects the DOM attribute value
* "string-or-number": `SVG2RectElement.x` returns a number (px value) on getting, and can be assigned a number or a string to be parsed as a CSS length
* "number": `SVG2RectElement.x` is a number that reflects the px value
* "string-and-number": `SVG2RectElement.x` reflects the DOM attribute value as a string, and `SVG2RectElement.x_px` reflects it as a number (px value)

Set `gLengthReflection` to the desired option before loading new-svg-dom.js, for example:

```
<!DOCTYPE html>
<script>
var gLengthReflection = "string-and-number";
</script>
<script src="new-svg-dom.js"></script>
<graphics width="300" height="200">
  <rect x="10" y="20" width="30" height="40"></rect>
</graphics>
<script>
function show(val) {
  alert(val + " (" + typeof val + ")");
}
show(document.querySelector("rect").x);     // alerts "10 (string)"
show(document.querySelector("rect').x_px);  // alerts "10 (number)"
```

Limitations
===========

1. Not every proposed DOM interface is implemented.
2. Style sheets in the document are not applied to elements in the `<graphics>` subtree, although a `<style>` element placed within the `<graphics>` will work, as long as the selectors do not need to match against any ancestors of the `<graphics>`.
3. Features that require local URL references, such as `<use href="#blah">`, do not work.
4. Event listeners do not work.
5. The script only works in a recent Firefox Nightly build that has the `dom.webcomponents.enabled` pref set to `true`.
