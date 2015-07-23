"use strict"
function create( type, parent, prop, attr ){
  if(!type) return false;
  let elem = document.createElement(type);
  for(let key in prop){
    elem[key] = prop[key];
  }
  for(let key in attr){
    elem.setAttribute(key, attr[key])
  }
  if(parent) parent.appendChild(elem);
  return elem;
}
function renderXML(xml){
  if (window.DOMParser) {
    var parser = new DOMParser();
    xml = parser.parseFromString(file,"text/xml");
  } else  {
    xml = new ActiveXObject("Microsoft.XMLDOM");
    xml.async=false;
    xml.loadXML(file); 
  }
  var body = document.getElementsByTagName('body')[0];
  var tree = create('div', body, { id: 'tree' }, {  })
  draw(xml, tree);
  if(window.parent && window.parent.LT.Display){
    setTimeout(function() {window.parent.LT.Display.loaded();}, 1000);
      }
}
function draw(xml, parent){
  let nodes = xml.children;
  let node, cont, outer, inner, attr, after, child, text, close, last, frag, eclass;
   for(let i=0; i<nodes.length; i++){
     node = nodes[i];
    frag = parent;
    eclass = 'e';
    if(node.parentNode.nodeName.toUpperCase() === "ASSETS") {
      frag = document.createDocumentFragment();
      eclass = 'e asset'
    }
        cont = create( 'div', frag, {}, { class: eclass } )
        outer = create( 'span', cont, { innerHTML: '<'}, { class: 'n s ns' } );
        inner = create( 'span', outer, { innerHTML: node.nodeName }, { class: 'nm' } )
        for(let i=0; i<node.attributes.length; i++){
      attr = node.attributes[i];
      create( 'span', cont, { innerHTML: attr.name }, { class: 'an' } )
      create( 'span', cont, { innerHTML: '="' }, { class: 'av' } )
      create( 'span', cont, { innerHTML: attr.value }, { class: 'av' } )
      create( 'span', cont, { innerHTML: '"' }, { class: 'av' } )
    }
    if(node.children.length === 0) {
      if(!node.innerHTML) {
        after = create( 'span', cont, { innerHTML: '/>'}, { class: 's' } );
        child = create( 'div', cont, {}, { class: 'c' } )
        continue;
      }
    }
    after = create( 'span', cont, { innerHTML: '>'}, { class: 's' } );
    child = create( 'div', cont, {}, { class: 'c' } )
    if(node.innerHTML && node.innerHTML === node.textContent){
      text  = create( 'span', child, { innerHTML: node.textContent }, { class: 't' } )
    } else if(node.children.length > 0) {
      draw(node, child)
    }
    close = create( 'span', cont, { }, { class: 'n ne' } )
    last  = create( 'span', close, { innerHTML: node.nodeName}, { class: 'nm cl' } )
     if(node.parentNode.nodeName.toUpperCase() === "ASSETS") 
      parent.appendChild(frag);
  }
}
class Hilite {
  constructor(){
    this.Container = document.getElementById("tree");
    this.Elements = {
      Search :  document.getElementById("keywords"),
      Form:     document.getElementById('form'),
      Counter:  document.getElementById("counter"),
      Nav:    document.getElementById("navigate"),
      Prev:   document.getElementById("prev"),
      Next:   document.getElementById("next"),
      Cancel: document.getElementById("cancel"),
      Result: document.getElementById("result") };
    this.Index = -1;
    this.Matches = [];
    this.Term = "";
    this.Hilitor = new Hilitor2("tree");
    this.Hilitor.setMatchType("open");
    this.bind()
  }
  bind(){
    var that = this;
    this.Elements.Form.addEventListener('submit', function(e){ 
      e.preventDefault() 
    });
    this.Elements.Prev.addEventListener("click", function(e) {
      that.navigate(-1);
      e.preventDefault();
    }, false);
    this.Elements.Next.addEventListener("click", function(e) {
      that.navigate(1);
      e.preventDefault();
    }, false);
    this.Elements.Cancel.addEventListener("click", function(e) {
      that.Elements.Search.value = "";
      that.search();
            e.preventDefault();
    }, false);
    this.Elements.Search.addEventListener("keydown", function(e){
      if(e.which === 13){
        that.search(e);
        e.preventDefault()
      }
    }, false);
    document.body.addEventListener('keydown', function(e){
      if(e.ctrlKey && !e.shiftKey) {
        if(e.which == 39) that.navigate(1)
        if(e.which == 37) that.navigate(-1)
      }
      if(e.which === 13){
        e.preventDefault()
      }
    }, false);
    window.addEventListener('hashchange', function(e){
      that.hashchange(e);
    })
  }
  search(e){
    var term = this.Elements.Search.value.toLowerCase();
    if( term == this.Term){
      this.navigate(1);
      return false;
    }
    this.Term = term;
    this.Hilitor.apply(this.Elements.Search.value);
        this.hilite();  
  }
  hilite(){
    this.Matches = this.Container.getElementsByTagName("EM");
    this.Index = -1;
        var prev = document.querySelectorAll('.asset.show');
    for( let i=0; i<prev.length; i++){
      prev[i].classList.remove('show');
    }
        if(this.Elements.Search.value){
      this.Container.classList.add('search');
      for(let i=0; i<this.Matches.length;i++){
        this.Matches[i].closest('.asset').classList.add('show');
      }
      this.Elements.Result.style.display = 'inline';
    } else {
      this.Container.classList.remove('search');
      this.Elements.Result.style.display = 'none';
    }
    if(this.Matches.length) {
      this.navigate(1)
    } else {
     this.Elements.Counter.innerHTML = `0 of 0`;
    }
  }
  navigate(offset){
    this.Index += offset;
    this.Index = this.Index % this.Matches.length;
    this.Index = this.Index === -1 ? this.Matches.length - 1 : this.Index;
        if(this.Matches[this.Index])
      this.Matches[this.Index].scrollIntoViewIfNeeded(true);
    for(var i=0; i < this.Matches.length; i++) {
      this.Matches[i].style.outline = (this.Index == i) ? "1px solid red" : "";
    }
     var currItem = isNaN(this.Index) ? 0 : this.Index + 1;
     this.Elements.Counter.innerHTML = `${currItem} of ${this.Matches.length}`;
  }
  hashchange(e){
    var hash = document.location.hash.replace('#', '')
    this.Elements.Search.value = hash;
    this.search();
  }
}
if(!String.prototype.startsWith){
	String.prototype.startsWith = function (str) {
		return !this.indexOf(str);
	}
}
var getWonderBoxEvent = document.createEvent('Event');
getWonderBoxEvent.initEvent('getWonderBoxEvent', true, true);
var getTransformEvent = document.createEvent('Event');
getTransformEvent.initEvent('getTransformEvent', true, true);
function processWonderBox() {
	var wb = document.getElementById('wonderbox');
	if (wb) {
		wb.dispatchEvent(getWonderBoxEvent);
	}
}
function processTransform() {
	var xr = document.getElementById('xslResults');
	if (xr) {
		xr.dispatchEvent(getTransformEvent);
	}
}
function findParentByClassName(ele, classname) {
	var par = ele.parentElement;
	while (par != null) {
		if (hasClass(par,classname)) {
			break;
		}
		par = par.parentElement;
	}
	return par;
}
function createNodeStructure(namespace, tag, attName, attValue, text) {
	var n = document.createElementNS(namespace, tag);
	if (attName != null && attValue != null) {
		n.setAttribute(attName, attValue);
	}
	if (text != null) {
		n.appendChild(document.createTextNode(text));
	}
	return n;
}
function hasClass(ele, classname) {
	if ((' '+ele.className+' ').indexOf(' '+classname+' ') > -1) {
		return true;
	} else {
		return false;
	}
}
function setXpath(ele) {
	var wb = document.getElementById('wonderbox');
	if (wb) {
		var path='';
		if (ele.className == 'an') {
			path = '/@'+ele.textContent;
		}
		if (ele.className == 'av') {
			var prevSib = ele.previousSibling;
			while (prevSib.className != 'an') {
				prevSib = prevSib.previousSibling;
			}
			path = '/@'+prevSib.textContent;
		} 
		if (ele.className == 'cmt') {
			path = '/comment()';
		}
		if (ele.className == 'pi') {
			path = '/processing-instruction()';
		}
		var par = findParentByClassName(ele, 'e');
		while (par != null) {
			path = '/'+ par.firstElementChild.firstElementChild.textContent + path;
			par = findParentByClassName(par, 'e');
		}
		wb.value=path;
	}
}
function styleFill(id, color) {
	document.getElementById(id).style.fill=color;
}
function toggleSlider() {
	var s=document.getElementById('slider');
	s.getAttribute('y') == 2 ? s.setAttribute('y',16) : s.setAttribute('y',2);
}
function toggleNodes(ele){
	var divE = (hasClass(ele,'e') ? ele : findParentByClassName(ele,'e'));
	//don't toggle self-closing elements
	if (!hasClass(divE.firstElementChild,'nsc')) {
		var divC = divE.getElementsByClassName('c')[0];
		if (divE.className.indexOf('hidden') > -1){
			var spanClosed = divE.getElementsByClassName('closed')[0];
			divE.removeChild(spanClosed);
			divC.style.display='';
			divE.className = divE.className.replace(' hidden','');
		}else{
			divC.style.display='none';
			divE.className += ' hidden';
			var closed = createNodeStructure('http://www.w3.org/1999/xhtml','span','class','closed','...');
			divC.parentNode.insertBefore(closed,divC);
	    }
	}
}
function hoverNodes(ele){
	if (ele != null) {
		var par = findParentByClassName(ele, 'e');
		while (par != null) {
			if (hasClass(par.firstElementChild,'h')) {
				//remove highlight
				par.firstElementChild.className = par.firstElementChild.className.replace(' h','');
				if (!hasClass(par.lastElementChild,'nsc')) {
					par.lastElementChild.className = par.lastElementChild.className.replace(' h','');
				}
			} else {
				//set highlight
				par.firstElementChild.className += ' h';
				if (!hasClass(par.lastElementChild,'nsc')) {
					par.lastElementChild.className += ' h';
				}
			}
			par = findParentByClassName(par, 'e');
		}
	}
}
function toggleOpacity(ele) {
	if (ele.style.opacity=='0') {
		ele.style.opacity='1';
		ele.style.visibility='visible'
	} else {
		ele.style.opacity='0'
		ele.style.visibility='hidden';
	}
}
function toggleDisplay(ele) {
	if (ele.style.display=='block' || ele.style.display.trim()=='') {
		ele.style.display='none';
	} else {
		ele.style.display='block'
	}
}
function mouseDownEvent(ev) {
	var ele = ev.target;
	if (ele.id == 'trannyRect' || ele.id == 'trannyPlay') {
		styleFill('trannyPlay','lime');
	}
}
function mouseUpEvent(ev) {
	var ele = ev.target;
	if (ele.id == 'trannyRect' || ele.id == 'trannyPlay') {
		styleFill('trannyPlay','green');
	}
}
function clickHandler(ev) {
	var ele = ev.target;
	if ((ele.nodeName.toUpperCase() == 'SPAN' && (hasClass(ele,'nm') || hasClass(ele,'an') || hasClass(ele,'av'))) 
			|| (ele.nodeName.toUpperCase() == 'PRE' && hasClass(ele,'cmt'))
			|| (ele.nodeName.toUpperCase() == 'DIV' && hasClass(ele,'pi'))) {
		setXpath(ele);
	} else if (ele.nodeName.toUpperCase() == 'RECT' && (ele.id == 'bannerRect' || ele.id == 'slider')) {
		toggleSlider();
		toggleOpacity(document.getElementById('banner'));
	} else if (ele.id == 'results') {
		processWonderBox();
		return false;
	} else if (ele.id == 'transform') {
		toggleOpacity(document.getElementById('tranny'));
		return false;
	} else if (ele.id == 'trannyRect' || ele.id == 'trannyPlay') {
		processTransform();
		return false;
	}		
}
function dblClickHandler(ev) {
	var ele = ev.target;
	if (ele.nodeName.toUpperCase() == 'SPAN' && (hasClass(ele,'nm') || hasClass(ele,'an') || hasClass(ele,'av'))) {
		if (findParentByClassName(ele,'nsc') == null) {
			toggleNodes(ele);
		}
	}
}
var previousEle=null;
function hoverHandler(ev) {
	var ele = ev.target;
	if (ele.nodeName.toUpperCase() == 'SPAN' && (hasClass(ele,'nm') || hasClass(ele,'t') || hasClass(ele,'an') || hasClass(ele,'av') || hasClass(ele,'s') || hasClass(ele,'n') || hasClass(ele,'nx') || hasClass(ele,'cd'))) {
		//remove previous highlights
		hoverNodes(previousEle);
		//set current highlights
		hoverNodes(ele);
		previousEle = ele;
	} else if (ele.nodeName.toUpperCase() == 'DIV' && hasClass(ele,'e') && ele.parentNode.id == 'tree') {
		//hack to fix display issue where root node stays highlighted
		hoverNodes(previousEle);
		previousEle = null;
	}
}
document.body.onmouseover=hoverHandler;
document.body.onclick=clickHandler;
document.body.ondblclick=dblClickHandler;
document.body.onmousedown=mouseDownEvent;
document.body.onmouseup=mouseUpEvent;