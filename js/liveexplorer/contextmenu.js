"use strict"

/* ------------------ ContextMenu ------------------ */

class ContextMenu {

	constructor(p){
    this.Defaults = p;
    this.Instance = p && p.Instance || null;
    this.Options  = null;
		this.Element  = null;
    this.Menu     = null;
    this.Items    = {};

    this.Options = [
      {
        name: 'sel_copy',
        options: { 
          label: 'Selection Copy', 
          click: function(e){
            document.execCommand('copy')
          }},
          items: null
      },
      {
        name: 'sel_cut',
        options: { 
          label: 'Selection Cut', 
          click: function(e){
            document.execCommand('cut')
          }},
          items: null
      }
      ,
      {
        name: 'sel_paste',
        options: { 
          label: 'Paste', 
          click: function(e){
            document.execCommand('paste')
          }},
          items: null
      }
    ];    
  }

  draw(){

    let that = this;
    
    this.Menu = new LO.GUI.Menu();

    this.Options.forEach(function(item){
      that.Items[item.name] = that.drawItem(item);
      that.Menu.append(that.Items[item.name]);
    });
  }

  drawItem(p){
    var that = this,
        item = new LO.GUI.MenuItem(p.options);

    if(p.items && p.items.length > 0) {
      let subMenu   = new LO.GUI.Menu();

      p.items.forEach(function(subitem){
        subMenu.append(that.drawItem(subitem))
      });
      item.submenu = subMenu;
    }
    return item;
  }

  open(pos){
    this.toggleOptions();
    this.Menu.popup(pos.x, pos.y);
  }

  toggleOptions(){
    var sel = window.getSelection();

    if(sel.type === "Range") {
      this.Menu.items[0].enabled = true;
      this.Menu.items[1].enabled = true;
    } else {
      this.Menu.items[0].enabled = false;
      this.Menu.items[1].enabled = false;
    }

    if(LO.Clipboard.get() && LO.Clipboard.get().length > 0){
      this.Menu.items[2].enabled = true;
    } else {
      this.Menu.items[2].enabled = false;
    }

  }



}

/* ------------------ ContextMenu_AddressBar ------------------ */

class ContextMenu_AddressBar extends ContextMenu {

	constructor(settings){

    super(settings)

    this.Options = [
      {
        name: 'sel_copy',
        options: { 
          label: 'Selection Copy', 
          click: function(e){
            document.execCommand('copy')
          }},
          items: null
      }
      ,
      {
        name: 'sel_cut',
        options: { 
          label: 'Selection Cut', 
          click: function(e){
            document.execCommand('cut')
          }},
          items: null
      }
      ,
      {
        name: 'sep_1',
        options: { 
          type: 'separator'
        },
        items: null
      }
      ,
      {
        name: 'copy',
        options: { 
          label: 'Copy' 
        },
        items: [
          {
            name: 'copy_path',
            options: { 
              label: 'NamePath', 
              click: function(e){
                LO.Clipboard.set(LE.AddressBar.Data.NamePath, 'text');
              }},
              items: null
          }
          ,
          {
            name: 'copy_hpos',
            options: { 
              label: 'HierarchyPosition', 
              click: function(e){
                LO.Clipboard.set(LE.AddressBar.Data.HierarchyPosition, 'text');
              }},
              items: null
          }
          ,
          {
            name: 'copy_oc',
            options: { 
              label: 'ObjectCode', 
              click: function(e){
                LO.Clipboard.set(LE.AddressBar.Data.ObjectCode, 'text');
              }},
              items: null
          }
          ,
          {
            name: 'copy_guid',
            options: { 
              label: 'GUID', 
              click: function(e){
                LO.Clipboard.set(LE.AddressBar.Data.GUID, 'text');
              }},
              items: null
          }
        ]
      }
      ,
      {
        name: 'sep_2',
        options: { 
          type: 'separator'
        },
        items: null
      }
      ,
      {
        name: 'sel_paste',
        options: { 
          label: 'Paste', 
          click: function(e){
            document.execCommand('paste')
          }},
          items: null
      }

    ];
	}

  toggleOptions(){
    var sel = window.getSelection();

    if(sel.type === "Range") {
      this.Menu.items[0].enabled = true;
      this.Menu.items[1].enabled = true;
    } else {
      this.Menu.items[0].enabled = false;
      this.Menu.items[1].enabled = false;
    }
    
    if(LO.Clipboard.get() && LO.Clipboard.get().length > 0){
      this.Menu.items[5].enabled = true;
    } else {
      this.Menu.items[5].enabled = false;
    }

  }

}

/* ------------------ ContextMenu_Hierarchy ------------------ */

class ContextMenu_Hierarchy extends ContextMenu {

  constructor(settings){
    super(settings)

    let that = this;

    this.node = null;
    this.prev = null;

    this.history = {};

    this.Options = [
      {
        name: 'node_new',
        options: { 
          label: 'New...', 
          click: function(e){
            alert('Not available at this time')
          }},
          items: null
      }
      ,
      {
        name: 'sep_1',
        options: { 
          type: 'separator'
        },
        items: null
      }
      ,
      {
        name: 'actions',
        options: {
          label: 'Actions'
        },
        items: [
          {
            name: 'display_subnodes',
            options: {
              label: 'Display SubNodes'
            },
            items: [{
              name: 'subnodes_1',
              options: {
                label: 'Page: 1'
              }
            }]
          },
          {
            name: 'liveserver_debug',
            options: {
              label: "LiveServer Debug",
              click: function(){
                that.Instance.node_debug({ node: that.node });
              }
            }
          }
        ]
      }
      ,
      {
        name: 'sep_2',
        options: { 
          type: 'separator'
        },
        items: null
      }
      ,      
      {
        name: 'copy',
        options: { 
          label: 'Copy' 
        },
        items: [
          {
            name: 'copy_path',
            options: { 
              label: 'NamePath', 
              click: function(e){
                that.Instance.node_copy({ node: that.node, type: "namepath" });
              }},
              items: null
          }
          ,
          {
            name: 'copy_hpos',
            options: { 
              label: 'HierarchyPosition', 
              click: function(e){
                that.Instance.node_copy({ node: that.node, type: "id" });
              }},
              items: null
          }
          ,
          {
            name: 'copy_oc',
            options: { 
              label: 'ObjectCode', 
              click: function(e){
                that.Instance.node_copy({ node: that.node, type: "objectcode" });
              }},
              items: null
          }
          ,
          {
            name: 'copy_guid',
            options: { 
              label: 'GUID', 
              click: function(e){
                that.Instance.node_copy({ node: that.node, type: "guid" });
              }},
              items: null
          }
        ]
      }

    ];      
  }

  toggleOptions(){
    this.toggleDisplaySubNodes()
  }

  toggleDisplaySubNodes(){

    if(!this.node || !this.prev || this.node.id !== this.prev.id)
      this.clearSubNodeItems();

    this.Menu.items[2].submenu.items[0].enabled = false;

    if(!this.node || this.node.children.length === 0 || !this.node.state.opened){
      this.prev = this.node;
      return false;
    }

    var child = this.Instance.Instance.Tree.get_node(this.node.children[0]),
        sibs = child && child.li_attr.siblings || 0;

    if(sibs <= this.Instance.maxItems){     
      this.prev = this.node;
      return false;
    }

    var page = child && child.li_attr.p || 1,
        pages = Math.ceil(parseInt(sibs)/this.Instance.maxItems);

    this.Menu.items[2].submenu.items[0].enabled = true;

    if(!this.node || !this.prev || this.node.id !== this.prev.id)
      this.drawSubNodeItems({ page: page, pages: pages });

    this.prev = this.node;
  }

  clearSubNodeItems(){
    let menu = this.Menu.items[2].submenu.items[0],
        subMenu = menu.submenu,
        len = subMenu.items.length,
        item;

/*    subMenu.items.forEach(function(menuItem){
      console.log(menuItem);
    })*/

    for (let i = 0; i < len; i++) {
      try{
        subMenu.removeAt(i);
      } catch(e){
        console.log(e);
      }
    };
  }

  drawSubNodeItems(p){
    let that = this,
        menu = this.Menu.items[2].submenu.items[0],
        subMenu = menu.submenu || new LO.GUI.Menu(),
        items = [],
        options = {},
        n = 2,
        item, page, text;

    for(var i=0; i<p.pages; i++){
      n = n + i;
      page = i + 1;

      text = `Page: ${page}`;

      if(page == p.page) {
        this.history[this.node.id] = i;
      }

      options = {
        name: 'subnodes_'+ page,
        type: 'checkbox',
        checked: page === p.page,
        label: text,
        click: function(){
          that.selectSubNodeItem(this);
        }
      }
      subMenu.insert(new LO.GUI.MenuItem(options), i);
    }

    menu.submenu = subMenu;
  }

  selectSubNodeItem(item){
    let menu = this.Menu.items[2].submenu.items[0].submenu,
        hist = this.history[this.node.id],
        prev = hist >=0 ? menu.items[hist] : null,
        page = parseInt(item.label.replace('Page: ', '')),
        indx = page - 1,
        text = "";

    this.history[this.node.id] = indx;

/*    console.log({
      text: "selectSubNodeItem",
      item: item,
      this: this,
      node: this.node,
      hist: this.history[this.node.id],
      items: menu.items,
      indx: indx,
      prev: menu.items[this.history[this.node.id]]
    })*/

    if(prev){
      prev.checked = prev.id === item.id;
    }

    if(prev.id === item.id) 
      return;

    this.node.startItem = page;
    this.Instance.Instance.Tree.load_node(this.node);

  }

}


/*

  drawItem(p){
    var that = this,
        item = new LO.GUI.MenuItem(p.options);

    if(p.items && p.items.length > 0) {
      let subMenu   = new LO.GUI.Menu();

      p.items.forEach(function(subitem){
        subMenu.append(that.drawItem(subitem))
      });
      item.submenu = subMenu;
    }
    return item;
  }

*/