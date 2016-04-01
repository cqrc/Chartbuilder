# Making Chartbuilder Yours

The following assumes you have a dev instance of Chartbuilder up and running at `localhost:3000`. Best to also have a gander at [Diving into Chartbuilder](https://github.com/Quartz/Chartbuilder/blob/master/docs/01-introduction.md) and [Customizing Chartbuilder](https://github.com/Quartz/Chartbuilder/blob/master/docs/02-customizing-chartbuilder.md) (though this documentation aims to clarify some of that.)

Also ICYMI: Chartbuilder uses [Stylus](http://stylus-lang.com/) for its CSS. Stylus is a lot like SASS or LESS and has supporting syntax highlight for Sublime Text (and I'm sure others). It also uses `.jsx` files, which are syntax highlighted using the Babel package in Sublime Text. I found it to be very helpful because standard JS highlighting makes it look like everything is broken.

Sections:

- [Title](#title)
- [Typography](#typography)
- [Colors](#colors)
- [Formatting](#formatting)
- [Add a logo](#add-a-logo)
- [Add a subtitle](#add-a-subtitle)
- [Deploy to gh-pages](#deploy)

# TITLE

Change the display and page title at `Chartbuilder/src/htdocs/index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <title>George's Charts - A Chartbuilder Fork</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
</head>
<body>
    <div class="header">
        <h1>George's Charts</h1>
    </div>
    <div class="chartbuilder-container">
    </div>
    <script src="js/main.js"></script>
</body>
</html>
```

`<title>` changes the page title and `<h1>` changes the displayed title.

Save.

# TYPOGRAPHY

Getting Google's webfonts to work with @import or even a link reference in `<head>` was a total nightmare, so I went with downloaded fonts. (Might have something to do with Chartbuilder converting all fonts to base64. Also might not.)

Create a directory `fonts` in `Chartbuilder/src/` and dump whatever fonts you plan to use in there. I'm using [_Open Sans_](https://www.google.com/fonts) from Google. 

Open `Chartbuilder/src/styl/fonts.styl` and call your fonts like so:

```stylus
@font-face {
font-family: 'Open Sans';
font-style: normal;
font-weight: 400;
src: url('/fonts/Open_Sans/OpenSans-Regular.ttf');
}

@font-face {
font-family: 'Open Sans Bold';
font-style: bold;
font-weight: 700;
src: url('/fonts/Open_Sans/OpenSans-Bold.ttf');
}

@font-face {
font-family: 'Open Sans Light';
font-style: normal;
font-weight: 300;
src: url('/fonts/Open_Sans/OpenSans-Light.ttf');
}
```

Keep the old references or don't. (Probably don't).
Save.

Open `Chartbuilder/src/styl/type.styl` and use your new fonts:

```stylus
// Typography

// Fonts
$font-sans = 'Open Sans', sans-serif
$font-sans-light = 'Open Sans Light', sans-serif
$font-sans-bold = 'Open Sans Bold', sans-serif
$font-serif = Georgia,'Times New Roman',Times,serif
$primary-font-family = $font-sans
$secondary-font-family = $font-serif
$monospaced-font-family = Monaco, Lucida Console, monspace
```

Save.

Apply a new font specifically:

Open `Chartbuilder/src/styl/layout.styl`

Find `h1` under `.header` and add `font-family $font-sans-bold` so it looks like this:

```stylus
.header
        background-color #333
        margin-top 0
        top 0
        position fixed
        height $header-height
        width 100%
        z-index 10000
        padding 0.5em 0 0 0.25em
        h1
            color #777
            margin 0
            line-height 1
            padding 0
            font-family $font-sans-bold
```

Save. Look, now your title bar is bold.

I don't like the way the 'light' version of Open Sans looks, so we're going to mostly remove it from the chart. That happens at `Chartbuilder/src/styl/chart-renderer.styl`. Compare [my version](https://github.com/golfecholima/Chartbuilder/blob/master/src/styl/chart-renderer.styl) with the Chartbuilder [master version](https://github.com/Quartz/Chartbuilder/blob/master/src/styl/chart-renderer.styl). (Hint: Don't worry about the missing `.svg-text-sub` that's only present if you want to [add a subtitle](#add-a-subtitle) to your Chartbuilder.)

I like the way uppercase looks for my credit and source information. Again in `Chartbuilder/src/styl/chart-renderer.styl` under `&.svg-text-credit` and `&.svg-text-source` add `text-transform uppercase` to each like so:

```stylus
  &.svg-text-credit // Customize credit text
    font-size $em_size*0.6
    fill $color-chart-meta
    text-anchor start
    text-transform uppercase
  &.svg-text-source // Customize source text
    font-size $em_size*0.6
    fill $color-chart-meta
    text-transform uppercase
```

Save.

# COLORS

Colors are all handled at `Chartbuilder/src/styl/colors.styl`. As mentioned in the documentation, Chartbuilder needs to know how many colors are being used in the chart. If you don't need more than 11 colors, perfect. Swap out hex values to your hearts content from the list under `$chart-colors =\`. Changing anything in this file before `$chart-colors =\` will affect a variety of elements in the Chartbuilder interface and on the chart itself. Everything with a `$` is a variable in Stylus, so search through the files to determine exactly what color variables are assigned to what. (Much of it can be found in the `/chart-renderer.styl` sheet mentioned earlier.)

**NOTE**: Chartbuilder relies heavily on SVG to work its magic. The CSS property `color` and many other normal CSS properties (such as `background`) do not function as expected. When you're looking at elements in your browser inspector, the color of the element will instead correspond to the `fill` property. Folks new to SVG (like me) will find [this SVG documentation](https://developer.mozilla.org/en-US/docs/Web/SVG) useful.

### Adding colors

If you must have more than the default 11 colors, here's how:

Get your list of colors finalized. Count how many colors you have. Open `Chartbuilder/src/js/config/chart-style.js` and find `numColors:`. Change the number to correspond with the counting performed earlier.

# FORMATTING

It's worth noting here that for most tweaks made not encompassed by `.styl` sheet changes, we'll often have to make 2 or more changes one for each of Chartbuilder's chart type iterations (namely, the default **xy** and the **grid** types). This will be the case for most anything that involves positioning elements around on the chart.

**XY CHART FILES**

- `Chartbuilder/src/js/charts/cb-xy`
- `Chartbuilder/src/js/components/chart-xy`

**GRID CHART FILES**

- `Chartbuilder/src/js/charts/cb-chart-grid`
- `Chartbuilder/src/js/components/chart-grid`

**NOTE**: There are general files that apply to all chart types within both `Chartbuilder/src/js/charts/` and `Chartbuilder/src/js/components/`.

### Padding

Chartbuilder doesn't come with much space around the edges. Let's add some padding. To fix the padding we're going to pull up `Chartbuilder/src/js/charts/cb-xy/xy-config.js` and `Chartbuilder/src/js/charts/cb-chart-grid/chart-grid-config.js`.

In each file find `margin:` and set the desired margins. I went for ... 

```javascript
margin: {
        top: "0.85em",
        right: "0.5em",
        bottom: "0.5em",
        left: "0.5em"
    },
```

... in `xy-config.js` and ...

```javascript
margin: {
        top: "0.9em",
        right: "0.5em",
        bottom: "0.5em",
        left: "0.5em"
    },
```

... in `chart-grid-config.js` which behaved slightly different at the top.

# ADD A LOGO

(H/T to @petulla for this one.)

Most folks are going to want their chart branded. Here we'll add a logo in the bottom left corner.

Add your logo file to `src/assets/`. Don't worry too much about size at the moment, it will get adjusted later.

Open `Chartbuilder/src/js/components/svg/ChartFooter.jsx`. There's a lot of changes here so I'll link to the [actual commit](https://github.com/golfecholima/Chartbuilder/commit/4606247b7d3931f362c037f11eb718edfea6a601). There are two important areas to note here for further tweaking:

- Lines 99-101, where the ` + 30` dictates the offset distance of the credit text from the left side of the chart.
- Lines 139-142, which dictate the size of the logo and where the logo file itself lives, should you need to change that.

Once you've made all the changes in the aforementioned commit, save.

Next, create the file `SvgImage.jsx` in `Chartbuilder/src/js/components/svg/`. Add the following contents to that file:

```babel
// Svg image elements used to annotate chart
var React = require("react");
var PropTypes = React.PropTypes;
var ChartViewActions = require("../../actions/ChartViewActions");

/**
 * An Svg <image> element with width and height
 * @instance
 * @memberof RendererWrapper
 */
var SvgImage = React.createClass({

    propTypes: {
        className: PropTypes.string,
        onUpdate: PropTypes.func,
        translate: PropTypes.array.isRequired,
        url: PropTypes.string.isRequired
    },

    render: function() {
        var imgNodes;
        
            imgNodes = (
                <svg dangerouslySetInnerHTML={{__html: "<image xlink:href='" + this.props.url +
                 "' width='" + this.props.width +
                 "' height='" + this.props.height +
                 "'/>" }} />
            )
        
        return (
            <g
                className={["svg-img", this.props.className].join(" ")}
                transform={"translate(" + this.props.translate + ")"}
            >
                {imgNodes}
            </g>
        );
    }

});

module.exports = SvgImage;
```

Save.

# ADD A SUBTITLE

Adding a subtitle involves changing 10 different files. Instead of detailing all the changes here, I've pushed a commit to GitHub that has all the modifications in one place. That commit lives [here](https://github.com/golfecholima/Chartbuilder/commit/6baf13f47952e2a09c50875031e28b14240010c3).
