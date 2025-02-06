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
        this.interval = this.getAttribute( 'interval' )
        this.indicator = this.querySelector( '[data-indicator]' );
        this.buttons = this.querySelectorAll( 'button[data-control]' );
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

        if ( this.buttons )
        {
            this.mountButtons();
        }

        // make it pauseable on hover
        this.pause = false;
        if ( this.getAttribute( 'nonstop' ) === null )
        {
            this.addEventListener( 'mouseenter', this.stop );
            this.addEventListener( 'touchstart', this.stop );
            this.addEventListener( 'mouseleave', this.play );
            this.addEventListener( 'touchend', this.play );
        }

        // now run!
        this.init();
    }

    init()
    {
        // clone for the effect
        const first = this.track.firstElementChild.cloneNode( true );
        const last = this.track.lastElementChild.cloneNode( true );
        this.track.appendChild( first );
        this.track.prepend( last );

        // move to first position, to be sure…
        this.gotoFirst();

        if ( this.interval )
        {
            // run
            const runner = setInterval(
                function( self )
                {
                // but pause on hover
                    if ( ! self.pause )
                    {
                        self.move();
                    }
                },
                this.interval * 1000,
                this
            );
        }

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

    move( direction = 'next' )
    {
        direction = ( direction == 'next' ) ? 1 : -1;

        this.track.scrollBy( {
            // the offset is more a rough estimae, considering unequal item widths
            left: ( this.track.scrollWidth / this.track.children.length ) * direction,
            top: 0,
            behavior: 'smooth'
        });

        this.entryPointer += direction;
        this.setIndicator();

        // adding extra code for the IE6 of the 2020s
        if ( ! ( 'onscrollend' in window ) )
        {
            // I hate you, Safari.
            clearTimeout( window.scrollEndTimer );
            window.scrollEndTimer = setTimeout( this.checkEdge, 100 );
        }
    }

    gotoFirst()
    {
        this.entryPointer = 1;
        this.track.scroll({
            left: ( this.track.scrollWidth / this.track.children.length ),
            top: 0,
            behavior: 'instant',
        });
    }

    gotoLast()
    {
        this.entryPointer = this.track.children.length - 2;
        this.track.scroll({
            left:  ( this.track.scrollWidth / this.track.children.length ) * ( this.track.children.length - 2 ),
            top: 0,
            behavior: 'instant',
        });

    }

    checkEdge()
    {
        // on last element scroll to first
        if ( this.entryPointer > this.entryCount )
        {
            this.gotoFirst();
        }
        else if ( this.entryPointer < 1 )
        {
            this.gotoLast();
        }
    }

    mountButtons()
    {
        // set event listeneres
        let self = this;
        let entryPointer = this.entryPointer;
        this.buttons.forEach( button =>
            {
                button.addEventListener( 'click', function( e )
                {
                    let direction = e.currentTarget.dataset.control;
                    self.move( direction );
                });
            }
        );
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
            // or it's going to be the cloned slides
            if (
                key == this.entryPointer ||
                ( this.entryPointer > this.entryCount && i === 0 ) ||
                ( this.entryPointer == 0 && key === this.entryCount )
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