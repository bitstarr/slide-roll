# `<slide-roll>`

Simple (non interactive) slide show. You know these things designers use to prevent bloodsheds in management meetings…

It provides basic functionality, by moving through the slides in a given interval. No separate dependencies, only modern CSS and little JavaScrip logic.

[Check out the Demo](https://bitstarr.github.io/slide-roll/demo.html)

## Usage

```html
<script type="module" src="slide-roll.js"></script>
<link rel="stylesheet" href="slide-roll.css">

<slide-roll class="slide-roll" interval="4">
    <div data-track>
        <div class="stage">
            <img
                class="image"
                src="https://picsum.photos/333/500?random=1"
                width=960
                height=540
                alt="Random Image from Unsplash"
            >
            <p>
                Fancy call to action text?
            </p>
        </div>
        <div class="stage">
            <img
                class="image"
                src="https://picsum.photos/333/500?random=2"
                width=960
                height=540
                alt="Another random Image from Unsplash"
            >
            <p>
                Have some more text?
            </p>
        </div>
        […]
    </div>
    <div data-indicator></div>
</slide-roll >
```

Basic structure and styling comes from the slide-roll CSS, which targets the `.slide-roll` class and the data attributes for the track and indicator.

Inside the slides you can do whatever you want. The slides will be the full width of the slide-roll. The height of all slides needs to be the same. Inside you can put only an image or create fancy layout with a bunch of HTML elements and use flexbox, grids or absolute positioning.

The interval can be set via the `interval` attribute and is given in seconds.

The slideshow will pause if the user hovers (mouseover) or touches the element. You can set the attribute `nonstop` to the slide-roll, to prevent pausing.

The indicator is optional. Simply remove the div from the example. You can customize the design of the indication display (look at the demo) since the default styling has a very low specificy.