"use strict"

class ContextMenu {
	constructor(settings){
		this.Element = null;

		this.InContext = null;

		this.Menu = {
			ClassName: {
				Menu: 'context-menu',
				Item: 'context-menu__item',
				Link: 'context-menu__link',
				Active: 'context-menu--active'
			},
			Position: {
				x: null,
				y: null
			},
			Click: {
				x: null,
				y: null
			},
			Window: {
				Width: null,
				Height: null
			},
			Element: null,
			State: 0,
			Width: null,
			Height: null
		};

		this.getOptions(settings);

		if(!this.options.Element) return false;
		this.Element = this.options.Element;		
		this.draw();

		this.contextListener();
		this.clickListener();
		this.keyupListener();
		this.resizeListener();

	}

	draw(){
		console.log(this.options)
		this.Menu.Element = document.createElement('nav');
		this.Menu.Element.id = 'context-menu';
		this.Menu.Element.classList.add('context-menu');
		this.Menu.Element.innerHTML = `<ul class="context-menu__items">
			<li class="context-menu__item">
				<a href="#" class="context-menu__link" data-action="View"><i class="fa fa-eye"></i>Copy Path</a>
			</li>
			<li class="context-menu__item">
				<a href="#" class="context-menu__link" data-action="Edit"><i class="fa fa-edit"></i> Copy HPOS</a>
			</li>
			<li class="context-menu__item">
				<a href="#" class="context-menu__link" data-action="Delete"><i class="fa fa-times"></i> Copy ObjectCode</a>
			</li>
			<li class="context-menu__item">
				<a href="#" class="context-menu__link" data-action="Delete"><i class="fa fa-times"></i> Copy GUID</a>
			</li>
			<li class="context-menu__item">
				<a href="#" class="context-menu__link" data-action="Delete"><i class="fa fa-times"></i> Copy ObjectType</a>
			</li>
		</ul>`;

		var body = document.getElementsByTagName('body')[0];
		body.appendChild(this.Menu.Element);
	}

	getOptions(settings){
		let Defaults = { name: 'ContextMenu' };
		this.options = $.extend({}, Defaults, settings || {});
	}



  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //
  // H E L P E R    F U N C T I O N S
  //
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Function to check if we clicked inside an element with a particular class
   * name.
   * 
   * @param {Object} e The event
   * @param {String} className The class name to check against
   * @return {Boolean}
   */
  clickInsideElement( e ) {
    var el = e.srcElement || e.target;
    
    if ( el === this.Element ) {
      return el;
    } else {
      while ( el = el.parentNode ) {
        if ( el === this.Element ) {
          return el;
        }
      }
    }

    return false;
  }

  /**
   * Get's exact position of event.
   * 
   * @param {Object} e The event passed in
   * @return {Object} Returns the x and y position
   */
  getPosition(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;
    
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy
    }
  }

  

	/**
	* Listens for contextmenu events.
	*/
	contextListener() {
		let that = this;
		document.addEventListener( "contextmenu", function(e) {
			that.InContext = that.clickInsideElement( e );

			if ( that.InContext ) {
				e.preventDefault();
				that.toggleMenuOn();
				that.positionMenu(e);
			} else {
				that.InContext = null;
				that.toggleMenuOff();
			}
		});
	}

	/**
	* Listens for click events.
	*/
	clickListener() {
		let that = this;	
		document.addEventListener( "click", function(e) {
			var clickeElIsLink = that.clickInsideElement( e );

			if ( clickeElIsLink ) {
			  e.preventDefault();
			  that.menuItemListener( clickeElIsLink );
			} else {
			  var button = e.which || e.button;
			  if ( button === 1 ) {
			    that.toggleMenuOff();
			  }
			}
		});
	}

  /**
   * Listens for keyup events.
   */
  keyupListener() {
    window.onkeyup = function(e) {
      if ( e.keyCode === 27 ) {
        this.toggleMenuOff();
      }
    }
  }

  /**
   * Window resize event listener
   */
  resizeListener() {
    window.onresize = function(e) {
      this.toggleMenuOff();
    };
  }

  /**
   * Turns the custom context menu on.
   */
  toggleMenuOn() {
    if ( this.Menu.State !== 1 ) {
      this.Menu.State = 1;
      this.Menu.Element.classList.add( this.Menu.ClassName.Active );
    }
  }

  /**
   * Turns the custom context menu off.
   */
  toggleMenuOff() {
    if ( this.Menu.State !== 0 ) {
      this.Menu.State = 0;
      this.Menu.Element.classList.remove( this.Menu.ClassName.Active );
    }
  }

  /**
   * Positions the menu properly.
   * 
   * @param {Object} e The event
   */
  positionMenu(e) {
    this.clickCoords = this.getPosition(e);

    /*clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;*/

    this.Menu.Width 	= this.Menu.Element.offsetWidth + 4;
    this.Menu.Height = this.Menu.Element.offsetHeight + 4;

    LO.Window.refreshSize();

    if ( (LO.Window.Width - this.clickCoords.x) < this.Menu.Width ) {
      this.Menu.Element.style.left = LO.Window.Width - this.Menu.Width + "px";
    } else {
      this.Menu.Element.style.left = this.clickCoords.x + "px";
    }

    if ( (LO.Window.Height - this.clickCoords.y) < this.Menu.Height ) {
      this.Menu.Element.style.top = LO.Window.Height - this.Menu.Height + "px";
    } else {
      this.Menu.Element.style.top = this.clickCoords.y + "px";
    }
  }

  /**
   * Dummy action function that logs an action when a menu item link is clicked
   * 
   * @param {HTMLElement} link The link that was clicked
   */
  menuItemListener( link ) {
    console.log( "Task ID - " + this.InContext.getAttribute("data-id") + ", Task action - " + link.getAttribute("data-action"));
    this.toggleMenuOff();
  }

}

/* ------------------ ContextMenu ------------------ */

class HierarchyContextMenu extends ContextMenu {
	constructor(settings){
		super(settings)
	}

	getOptions(settings){
		let Defaults = { name: 'HierarchyContextMenu' };
		this.options = $.extend({}, Defaults, settings || {})
	}
}