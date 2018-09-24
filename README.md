SiteColor
=========

...


## Methods

Return | Method | Description
------ | ------ | -----------
`SiteColor` | `setRed (Integer red)` | Set red value to an integer between `0` and `255`.
`SiteColor` | `setGreen (Integer green)` | Set green value to an integer between `0` and `255`.
`SiteColor` | `setBlue (Integer blue)` | Set blue value to an integer between `0` and `255`.
`SiteColor` | `setOpacity (Float opacity)` | Set opacity value to a float number between `0` and `1`.
`SiteColor` | `fillHex (String hex)` | Fill color values by hex string. For example, `#ff00aa` will result in 255 red, 0 green and 170 blue.
`SiteColor` | `fillRgb (String rgb)` | Fill color values by rgb string in the format `rgb(255, 0, 170)`.
`SiteColor` | `fillRgba (String rgba)` | Fill color values by rgba string in the format `rgb(255, 0, 170, 0.6)`.
`SiteColor` | `fill (String colorString)` | Fill color values by passing a color string in either hex, rgb or rgba format.
`SiteColor` | `darken (Float percent)` | Darkens the color. Pass `0.2` to darken the color by `20 %`.
`SiteColor` | `lighten (Float percent)` | Lightens the color. Pass `0.2` to lighten the color by `20 %`.
`SiteColor` | `blendWith (SiteColor color, Float percent)` | Merge color with another color object.
`Float` | `getLuminance ()` | Returns the luminance of the color represented as a float between `0` and `1`.
`Float` | `compareContrastTo (SiteColor color)` | Returns the contrast between the two colors. The contrast returned is represented as a float between `1` and `21` where `1` is no contrast whatsoever and `21` is full contrast (black on white).
`Array` | `toRgbArray ()` | Returns the rgb value as an array of integers in the order red, green and blue.
`String` | `toRgb ()` | Returns the color as an rgb string suitable for css.
`String` | `toRgba ()` | Returns the color as an rgba string suitable for css.
`String` | `toHex ()` | Returns the color as a hex string suitable for css.
`String` | `toString ()` | Returns a string representation of the color suitable for css.


## Examples

```js
var color = new SiteColor();

color
  .fill('#f00')
  .setOpacity(0.6)
  .toString();
> 'rgba(255, 0, 0, 0.6)'

color
  .fill('#fa1')
  .lighten(0.2)
  .toString();
> '#ffcc14'

// Compare contrast between two colors.
var front = new SiteColor();
var back = new SiteColor();

front.fill('#fff');
back.fill('rgb(0, 0, 0)');

front.compareContrastTo(back);
> 21

```
