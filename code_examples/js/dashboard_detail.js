"use strict"
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
/** Hierarchy */

    var Hierarchy = function Hierarchy(p){
    
      this.Element 	= document.getElementById('hierarchy');
      this.Tree 		= document.getElementById('hierarchy_tree');
      this.Display	= document.getElementById('display')
      
      this.ContextMenu = null;
    
      this.Instance 	= {
        Tree: {},
        Slider: {}
      };
    
      this.data = {
        nodes: []
      };
    
      this.History = {
        Hash: {}
      };
      
      this.settings = {
        jstree: { 'core' : {
                'data' : {
                  'url': this.tree_data_url,
                  'data': this.tree_data_data,
                  'success': this.tree_data_success
                },
                'check_callback': true
              },
              'plugins': ['search', 'sort', 'state', 'types'],
              'expand_selected_onload': true,
              'progressive_render': true 
            }
      };
    
      this.init();
    };
    
    Hierarchy.prototype = {
    
      init: function Hierarchy_init(){
        var that = this;
    
        $(this.Element).resizable({
          handles: 'e',
          helper: 'ui-resizable-helper',
          maxWidth: 400,
          minWidth: 100,
          stop: function(e, ui){
            LT.Display.set_margin(ui.size.width);
                        that.Element.style.height = '';
          }
        });
    
        this.tree_create();
    
        this.Instance.Tree = $(this.Tree).jstree(true);
    
        $(window).on('hashchange', function(e){
          console.log(document.location.hash)
          var hash = document.location.hash.replace('#','');

          var query = LO.Utility.querystringObject(hash);
          
                              if(query.n && query.n === LT.AddressBar.Data.HierarchyPosition) return false;
          LT.Hierarchy.node_open(query.n);
        })
    
        LO.console.info('Hierarchy loaded');

        window.setTimeout( function(){
          if(!window.top || !window.top.tiles) return false;
          window.top.tiles.popupComplete();
        }, 2000);
        
        
      },
    
       tree_create: function Hierarchy_tree_create(){
        var that = this;
    
        $(this.Tree)
          .toggleClass('open', 500)		
          .jstree(this.settings.jstree)
          .on('select_node.jstree', function(e, data){
            that.tree_select_node(e, data);
          })
          .on('create_node.jstree', function(node, parent, position){
            that.tree_create_node(node, parent, position);
          })
          .on('load_node.jstree', function(node, status){
            that.tree_load_node(node, status)
          })
          .on('open_node.jstree', function(node){
            that.tree_open_node(node)
          })
          .on('copy.jstree', function(node){
            LO.Utility.Copy(node);
          })
          .on('contextmenu.jstree', function(e){
            console.info(e);
            that.ContextMenu.open({ x: e.pageX, y: e.pageY });
          })
          .on('keydown.jstree', function(e){
            that.tree_keydown(e);
          })
          .on('state_ready.jstree', function(){
            that.tree_state_ready();
          })
          .on('loaded.jstree', function(e, data){
            that.tree_loaded(e, data);
          })
      },
    
      tree_data_url: function Hierarchy_tree_data_url(node){
        return '/.assetlibrary_dashboard_treejson';
      },
    
      tree_data_data: function Hierarchy_tree_data_data(node){
                return node.id !== "#" ? { 'hpos': node.id } : { 'hpos': LO.Source, 'top': 'Y' };
      },
    
       tree_data_success: function Hierarchy_tree_data_success(data){
        data.forEach(function(item){
          var obj = {
            HierarchyPosition: item.id.toUpperCase(),
            NamePath: item.li_attr.namepath.toUpperCase(),
            ObjectCode: item.li_attr.objectcode.toUpperCase(),
            GUID: item.li_attr.guid.toUpperCase(),
            PrimaryObjectTypePosition: item.li_attr.potp.toUpperCase(),
            SecondaryObjectTypePosition: item.li_attr.sotp.toUpperCase(),
            Node: {}
          };
          LO.Data.Lookup.HierarchyPosition[obj.HierarchyPosition] = obj;
          LO.Data.Lookup.NamePath[obj.NamePath] = obj;
          LO.Data.Lookup.ObjectCode[obj.ObjectCode] = obj;
          LO.Data.Lookup.GUID[obj.GUID] = obj;
        });
      },
    
       tree_keydown: function Hierarchy_tree_keydown(e){
        console.log(e)
        switch(e.keyCode){
          case 113:
            this.Instance.Tree.edit(e.target);
            break;
        }
      },
    
      tree_loaded: function Hierarchy_tree_loaded(e, data){
        this.Instance.Tree.open_node($('li:first-child', this.Tree));
        this.Instance.Tree.select_node($('li:first-child', this.Tree));
      },
    
      tree_create_node: function Hierarchy_create_node(node, parent, position){
        LO.console.info({ text: 'create_node', node: node })
      },
    
      tree_load_node: function Hierarchy_load_node(node, status){
        var that = this;
        LO.console.info({ text: 'load_node', node: node });
      },
    
      tree_open_node: function Hierarchy_open_node(node){
        LO.console.info({ text: 'open_node', node: node })
      },
    
      tree_select_node: function Hierarchy_tree_select_node(e, data){
        var node = data.node;
        var queryObject = LO.Utility.querystringObject(document.location.hash.replace("#", ""));
        
        if(queryObject.n)
          this.History.Hash[queryObject.n] = queryObject.s;
        
        queryObject.s = this.History.Hash[node.id];
        document.location.hash = $.param(queryObject);
          
 LT.AddressBar.set(data.node);
                document.getElementById(data.node.id).scrollIntoViewIfNeeded(true);

        LO.console.info({ text: 'select_node', node: node })
      },
    
            tree_state_ready: function Hierarchy_tree_state_ready(){
                      },
    
       node_lookup: function Hierarchy_node_lookup(input, callback){
        var node = null;
    
        if(!input || typeof input !== 'string') return node;
        
        input = input.toUpperCase();
    
        if(input.indexOf('\\\\') > 0 || input.indexOf('[') > 0){
                    node = LO.Data.Lookup.NamePath[input] && LO.Data.Lookup.NamePath[input].HierarchyPosition || null;
        } else if(input.indexOf(LO.Data.Application.HierarchyPosition) === 0){
                    node = LO.Data.Lookup.HierarchyPosition[input] && LO.Data.Lookup.HierarchyPosition[input].HierarchyPosition || null;
        } else if(input.indexOf('-') > 0){
                    node = LO.Data.Lookup.GUID[input] && LO.Data.Lookup.GUID[input].HierarchyPosition || null;
        } else {
                    node = LO.Data.Lookup.ObjectCode[input] && LO.Data.Lookup.ObjectCode[input].HierarchyPosition || null;
        }
    
        var that = this;
    
        if(node && typeof node === "string") 
          return callback && typeof callback === "function" ? callback.call(that, node) : node;
    
        LO.Node.Get({ source: '', action: 'AssetLibrary_Dashboard_TreeObject', data: { id: input } }, function(response){
          if(callback && typeof callback === "function") 
            return callback.call(that, response.HierarchyPosition || null);
          return response.HierarchyPosition || null;
        }, that);
    
      },
    
      node_open: function Hierarchy_node_open(id){
        var node = this.node_lookup(id, this.node_open_complete);
      },
    
      node_open_complete: function Hierarchy_node_open_complete(node){
        if(!node) return LO.alert('\'' + node + '\' does not exist!')
    
        if(node.toUpperCase().indexOf(LO.Source.toUpperCase()) < 0) return LO.alert(`"${node}" is outside of this hierarchy.`)
        
        this.Instance.Tree.deselect_all();
        this.node_open_recurse(node);
      },
    
      node_open_recurse: function Hierarchy_node_open_recurse(node){
        var that = this;
    
         if(this.Instance.Tree.get_node(node)) {
    
           this.Instance.Tree.open_node(node, function(node){
    
             if(that.data.nodes && that.data.nodes.length > 0) {
               var n = that.data.nodes[0];
              that.data.nodes.shift();
    
              that.node_open_recurse(n);
            } else {
               that.Instance.Tree.select_node(node)
            }
    
          });
    
        } else {
    
          if(!that.data.nodes) that.data.nodes = [];
    
          that.data.nodes.unshift(node)
          this.node_open_recurse(node.substr(0, node.length-5))
    
        }
    
      },
      
      setHash: function Hierarchy_setHash(p){
        var queryObject = LO.Utility.querystringObject(document.location.hash.replace("#", ""));
        queryObject.n = p.node;
        
        document.location.hash = $.param(queryObject);
      }
      
    };

/** AddressBar */
class AddressBar{
	constructor(){
		this.Element = document.getElementById('inp_address_bar');
		this.Data = {};
		this.ContextMenu = null;
		this.draw();
		this.bind();

		Object.observe(this, function(changes){
					}, ['data']);

		console.info('AddressBar init')
	}
	bind(){
		var that = this;
		$(this.Element)
			.on('click', function(e){
							})
			.on('keypress', function(e){
				switch (e.which){
					case 13:
						LT.Hierarchy.node_open(this.value);
						e.preventDefault();
						break;
					default:
						return;
				}
			});
		this.Element.addEventListener('contextmenu', function(e){
					});
	}
	draw(){
	}
	set(node){
		var that = this;
		this.Element.value = node.li_attr.namepath;
				LT.Hierarchy.setHash({ node: node.id });
		LT.Display.Source = node.id;
		LT.Display.open();
		Object.getNotifier(this).performChange('data', function(){
			that.Data = {
				NamePath: node.li_attr.namepath,
				HierarchyPosition: node.id,
				ObjectCode: node.li_attr.objectcode,
				GUID: node.li_attr.guid,
				PrimaryObjectTypePosition: node.li_attr.potp,
				SecondaryObjectTypePosition: node.li_attr.sotp
			};
			that.node()
			return that.Data;
		});
	}

	node(){
		LT.Node = LO.Data.Lookup.HierarchyPosition[this.Data.HierarchyPosition]
			}

}
/** Display */
class Display{
	constructor(p){
    this.Container  = document.getElementById('display');
    this.Name       = document.getElementById('display_name');
    this.Content    = document.getElementById('display_content');
    this.Date       = document.getElementById('display_content_date');
    this.Error      = document.getElementById('display_content_error');
    this.Exception  = document.getElementById('display_content_exception');
    this.Frame      = document.getElementById('display_iframe');
        this.Loading    = document.getElementById('display_loading');
				this.Source = '';
				this.Request = null;
		this.draw();
	}
	draw(){
		var that = this;
	}
	set_margin(margin){
		margin = parseFloat(margin) || 0;
		this.Container.style.left = margin + "px";
	}
	show(){
		this.Container.style.display = "block";
	}
	hide(){
		this.Container.style.display = "none";
	}
	open(){
	  if(this.Request){
	    this.Request.abort();
	    this.Request = null;
	  }
	  var p = { source: this.Source, action: 'AssetLibrary_Dashboard_NodeContent', method: 'GET', data: {}};
	  	  LO.Node.Get(p, this.set, this);
	}
	loaded(){
    this.Frame.classList.remove('loading');
    this.Loading.classList.remove('loading');
	}
	set(resp){
    this.Frame.classList.add('loading');
    this.Loading.classList.add('loading');
	  let that = this,
	      data = resp[0],
	      name = data['Formatted Name'] || data['DisplayName'],
	      query = LO.Utility.querystringObject(document.location.hash.replace('#', ''))
	  this.Name.innerHTML = `${name} <a id="link_name" target="_blank" href="http://infrastructure.liveadmakerstage.com/.ObjectInspector?aObject=${data.Id}"></a>`;
	  this.Frame.src = `/.AssetLibrary_Dashboard_XMLReader?aFile_Object=${data.HierarchyPosition}#${query.s}` || 'about:blank';
	  LO.Utility.clearChildNodes(this.Date);
	  for(let key in data){
	    if(key.indexOf('Date__') < 0) continue;
	    let div = LO.Create('div');
	    LO.Create('label', div, { innerHTML: key.replace('Date__', '') });
	    LO.Create('span', div, { innerHTML: data[key] });
	    this.Date.appendChild(div);
	  }
	  let body = this.Exception.querySelector('table tbody');
	  LO.Utility.clearChildNodes(body);
	  data.Exceptions.forEach(function(exception){
	    let tr = LO.Create('tr', null, null, { "data-RequestID": exception.RequestID, "data-RemoteRequestID": exception.RemoteRequestID, "data-Iteration": exception.Iteration });
	    LO.Create('td', tr, { innerHTML: exception.LTID });
	    LO.Create('td', tr, { innerHTML: exception.DateTime });
	    LO.Create('td', tr, { innerHTML: exception.ErrorCode, title: exception.Error });
	    LO.Create('td', tr, { innerHTML: exception.AssetID || "", title: exception.AssetID || "" }, {}, {} );
	    LO.Create('td', tr, { innerHTML: "&#xf08e;" }, { style: " text-align: center; cursor: pointer; font-family: fontawesome;" }, { 
          click: function(e){ 
            var src = that.Frame.src.split('#')[0];
            that.Frame.src = `${src}#${exception.AssetID || ""}`;
          } 
        });
	    body.appendChild(tr);
	  })
	}
}
/** Node */
class Node {

	constructor(p){
		this.Data = LO.Data.Lookup.HierarchyPosition[p.id];
		LT.Node = this;
	}

	get(p, callback){
		LO.Node.Get({ source: this.Data.HierarchyPosition, action: 'TreeContent', data: { aType: p.type } }, callback);
	}
	setProperties(){
	}
	relationships(data){
		LO.console.log(data);
	}
}