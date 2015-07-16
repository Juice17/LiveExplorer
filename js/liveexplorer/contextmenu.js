"use strict"

/* ------------------ ContextMenu ------------------ */

class ContextMenu {

	constructor(p){
    this.Defaults = p;
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

    ];      
  }

  toggleOptions(){
  }

}