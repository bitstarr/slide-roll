class SlideRoll extends HTMLElement
{
    static tagName = 'slide-roll';
    static track = null;
    static interval = null;

    constructor()
    {
        super();
        this.checkEdge = this.checkEdge.bind(this);
    }

    connectedCallback()
    {
        // collect some information for later
        this.track = this.querySelector( '[data-track]' );
        this.interval = this.getAttribute( 'interval' ) || 5;
        this.indicator = this.querySelector( '[data-indicator]' );
        this.entryCount = this.track.children.length;
        this.entryPointer = 1;

        if ( this.entryCount == 1 )
        {
            // nothing to do here.
            return;
        }

        if ( this.indicator )
        {
            this.mountIndicator();
        }

        // make it pauseable
        this.pause = false;
        if ( this.getAttribute( 'nonstop' ) === null )
        {
            this.addEventListener( 'mouseenter', this.stop );
            this.addEventListener( 'touchstart', this.stop );
            this.addEventListener( 'mouseleave', this.play );
            this.addEventListener( 'touchend', this.play );
        }

        // now run!
        this.runCarousel();
    }

    runCarousel()
    {
        // clone for the effect
        const first = this.track.firstElementChild.cloneNode( true );
        this.track.appendChild( first );

        // move to first position, to be sure…
        this.rewind();

        // run
        const runner = setInterval(
            function( self )
            {
            // but pause on hover
                if ( ! self.pause )
                {
                    self.move();
                    self.setIndicator();
                }
            },
            this.interval * 1000,
            this
        );

        // check if we reached the end
        this.track.addEventListener( 'scrollend', this.checkEdge );
    }

    stop()
    {
        this.pause = true;
    }

    play()
    {
        this.pause = false;
    }

    move()
    {
        this.track.scroll({
            top: 0,
            left: this.track.clientWidth * this.entryPointer,
            behavior: 'auto',
        });
        this.entryPointer++;

        // adding extra code for the IE6 of the 2020s
        if ( ! ( 'onscrollend' in window ) )
        {
            // I hate you, Safari.
            clearTimeout( window.scrollEndTimer );
            window.scrollEndTimer = setTimeout( this.checkEdge, 100 );
        }
    }

    rewind()
    {
        this.entryPointer = 1;
        this.track.scroll({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    }

    checkEdge()
    {
        // on last element scroll to first
        if ( this.entryPointer > this.entryCount )
        {
            this.rewind();
        }
    }

    mountIndicator()
    {
        for ( let i = 0; i < this.entryCount; i++ ) {
            const item = document.createElement( 'span' );
            this.indicator.appendChild( item );
        }
        this.indicator.firstChild.dataset.active = true;
    }

    setIndicator()
    {
        if ( !this.indicator )
        {
            return;
        }

        const items = this.indicator.children;
        for ( var i = 0; i < items.length; i++ )
        {
            const item = items[i];
            const key = i + 1;
            delete item.dataset.active;

            // set active if key and pointer match
            // or it's going to be the cloned slide
            if (
                key == this.entryPointer ||
                ( this.entryPointer > this.entryCount && i === 0 )
            )
            {
                item.dataset.active = true;
            }
        }
    }
}

if ( 'customElements' in window ) {
    customElements.define( SlideRoll.tagName, SlideRoll );
}