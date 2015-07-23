"use strict"
class Tiles {
  constructor(){
    this.list  = document.getElementsByTagName('tile');
    this.Active = null;
    this.Tiles = {};
    this.bind()
  }
  bind(){
    let that = this;
    for(var i=0; i<this.list.length; i++){
      let tile = this.list[i];
      let open = tile.querySelector('.open');
      let close = tile.querySelector('.close');
      this.Tiles[tile.id] = { element: tile, Tile: new Tile(tile) };
      open.addEventListener('click',  function(){ 
        that.select(tile) 
      })
      close.addEventListener('click', function(){
        that.deselect()
      })
    }
    let pop = document.getElementsByClassName('popup'),
        tile;
    for(let i=0; i<pop.length; i++){
      if(pop[i].tagName.toUpperCase() !== "A") {
        tile = LO.Utility.getAncestor(pop[i], 'tile');
        if(!tile || !tile.dataset.src) 
          continue;
        pop[i].style.display = 'block';
      }
      pop[i].addEventListener('click', function(){
        var src = this.dataset.src || "";
        if(!src && this.tagName !== "tile") {
 let tile = LO.Utility.getAncestor(this, 'tile');
          src = tile.dataset.src || "";
        }
                that.popup(src);
      });
    }
  }
  select(tile) {
    let that = this;
    this.Active = tile;
    for(var i=0; i<this.list.length; i++){
      let tile = this.list[i];
      if(!tile.classList) break;
      if(tile !== this.Active) {
        tile.classList.remove('active');
        tile.classList.add('inactive');
      }
    }
    this.Tiles[this.Active.id].Tile.focus();
  }
  deselect(){
    var that = this
    this.Tiles[this.Active.id].Tile.reset();
  }
  showAll(){
    for(var i=0; i<this.list.length; i++){
      let tile = this.list[i];
      if(!tile.classList) break;
      tile.classList.remove('inactive')
    } 
  }
  popup(src){
    if(!src) return false;
    if(iFrame.src && iFrame.src === src) return false;
    Main.classList.add('hide');
    iFrame.src = src;
    iFrame.classList.add('loading')
    Loading.classList.add('loading')
    Popup.classList.add('open');
  }
  popupComplete(){
    iFrame.classList.remove('loading')
    Loading.classList.remove('loading')
  }
  close(){
    iFrame.src = "about:blank";
    Popup.classList.remove('open')
    Main.classList.remove('hide')
  }
}
class Tile {
  constructor(tile){
    this.Element  = tile;
    this.Id       = tile.id;
    this.Active   = false;
    this.Scroller = document.getElementById('content_xml');
    this.ScrollTo = null;
    this.Table = null;
    this.draw();
    this.bind();
  }
  bind(){
    let that = this;
    window.addEventListener('resize', function(e){
      that.resize();
    });
    this.Element.addEventListener(Util.Event.Transition(), function(e){
      if(that.Element !== e.target) 
        return false;
      that.Table.columns.adjust().draw();
      that.Element.classList.remove('in', 'out');
      if(that.Element.classList.contains('reset')){
        that.Element.classList.remove('reset')
        tiles.showAll();
      }
    });
  }
  draw(){
    this.Table = $( 'table', this.Element ).DataTable({
      scrollY: "300px",
      scrollCollapse: true,
      lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "All"]]
    });
  }
  resize(e){
    if(!this.Active) return true;
    this.position();
  }
  coords(){
    var el = this.Element,
        _x = 0,
        _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }
  viewport(){
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    return { w: w, h: h };
  }
  position(){
    var el = this.Element,
        xy = this.coords(),
        wh = this.viewport(),
        _x = 20 - xy.left,
        _y = 60 - xy.top,
        _w = wh.w - 80,
        _h = wh.h - 120;
            el.style.width  = _w + 'px';
    el.style.height = _h + 'px';
  }
  focus(){
    var el = this.Element,
        body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
    console.log(`Show Tile ${this.Id}`)
    this.Active = true;
    this.ScrollTo = this.Scroller.scrollTop;
    this.Scroller.scrollTop = 0;
    el.classList.remove('inactive')
    el.classList.add('active', 'in')
    this.position();
    this.Table.columns.adjust().draw();
  }
  reset(){
    var el = this.Element,
        body = document.getElementsByTagName('body')[0];
    this.Active = false;
    body.style.overflow = null;
    console.log(`Reset Tile ${this.Id}`)
    el.classList.add('out', 'reset')
    el.classList.remove('inactive', 'active')
    this.Scroller.scrollTop = this.ScrollTo;
        el.style.width = null;
    el.style.height = null;
  }
}
var Util = {
  Event: {
    Transition: function(el){
      el = el || document.getElementsByTagName('body')[0];
      let transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      };
      for(let t in transitions){
        if(el.style[t] !== undefined) {
          return transitions[t];
        }
      }
    }
  }
} 
/** LiveObject */
var LO = {
		GUI: {},
	Clipboard: null,
	Create: function(type, parent, props, attr, event){
	  if(!type) return false;
	  let elem = document.createElement(type);
	  for(let key in props){
	    elem[key] = props[key];
	  }
	  for(let key in attr){
	    elem.setAttribute(key, attr[key])
	  }
	  for(let key in event){
	    elem.addEventListener(key, event[key]);
	  }
	  if(parent) parent.appendChild(elem);
	  return elem;
	},
	Data : {
		Lookup: {
			NamePath: {},
			HierarchyPosition: {},
			ObjectCode: {},
			GUID: {}
		},
		Application: {
			HierarchyPosition: 'CAFEB',
			Domain: 'http://cafebac2.dev.liveadmaker.com'
		},
		Content: {}
	},
	Node: {
			Active: {},
		Get: function LO_Node_Get(p, callback, bindTo){
			var url = LO.Data.Application.Domain + '/' + p.source + '.' + p.action,
				 method = p.method || 'GET';
			$.ajax({
				'url': url,
				'data': p.data,
				'type': method,
				success: function(data){
					if(callback && typeof callback === 'function')
						callback.call(bindTo, data)
				},
				'error': LO.ErrorHandler && typeof LO.ErrorHandler === "function" ? LO.ErrorHandler : null
			})
		}
	},
	Window: {
		Width: window.innerWidth,
		Height: window.innerHeight,
		refreshSize: function (){
			LO.Window.Width = window.innerWidth;
			LO.Window.Height = window.innerHeight;
		},
		Focused: true,
		focus: function(e){
			LO.Window.Focused = true;
		},
		blur: function(e){
			LO.Window.Focused = false;
		}
	},
	Utility: {
		Copy: function LO_Utility_Copy(node){
						var gui = {};
						var clipboard = gui.Clipboard.get();
						clipboard.set(node.id, 'text');
			LO.console.log(clipboard.get('text'))
								},
		clearChildNodes: function LO_Utility_clearChildNodes(elem){
		  if(!elem.hasChildNodes()) return false;
		  while(elem.hasChildNodes()){
		    LO.Utility.clearChildNodes(elem.lastChild);
		    elem.removeChild(elem.lastChild);
		  }
		},
		getAncestor: function LO_Utility_getAncestor(el, sel){
		  if(sel.indexOf('.') > -1){
        while((el = el.parentElement) && !el.classList.contains(sel))
        return el;
		  } else {
		    let loop = true;
        while(loop){
          if( el.tagName.toUpperCase() === sel.toUpperCase() ) {
            loop = false;
          } else {
            el = el.parentElement;
          }
        }
        return el;
		  }
		},
		getSiblings: function LO_Utility_getSibling(el, sel){
		  var kids  = el.parentElement.children;
		  var sibs  = [];
		  for( var i=0; i<kids.length; i++ ){
		    let kid = kids[i];
		    if( kid == el ) continue;
		    if(sel.indexOf('.') > -1){
          if( kid.classList.contains(sel.replace('.', '')) ) sibs.push(kid);
		    } else {
		      if( kid.tagName.toUpperCase() === sel.toUpperCase()) sibs.push(kid)
		    }
		  }
		  return sibs;
		},
		getElementIndex: function LO_Utitlity_getElementIndex(el){
		  return [].indexOf.call(el.parentNode.children, el)
		},
		querystringObject: function LO_Utility_querystringObject(query){
		  if(!query) query = document.location.search ? document.location.search.replace('?', '') : null;
		  if(!query) return false;
      var query_string = {},
          pairs = query.split("&"),
          pair;
      for( var i=0; i<pairs.length; i++ ) {
        pair = pairs[i].split("=");
        pair[0] = decodeURIComponent(pair[0]).toLowerCase();
        pair[1] = decodeURIComponent(pair[1]);
                if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = pair[1];
                  } else if (typeof query_string[pair[0]] === "string") {
          var arr = [ query_string[pair[0]], pair[1] ];
          query_string[pair[0]] = arr;
                  } else {
          query_string[pair[0]].push(pair[1]);
        }
      } 
      return query_string;
    }
	},
	alert: function LO_alert(p){
		alert(p);
	},
	console: {
		log: function LO_console_log(p){
			console.log(p)
		},
		info: function LO_console_info(p){
			console.info(p)
		},
		watch: {}
	}
};
window.addEventListener('onFocus', function(){
});