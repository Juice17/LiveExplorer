# LiveExplorer
Node Webkit Hierarchy browser

## Components

### Address Bar
The address bar displays the currently selected node in the hierarchy.  It allows you to navigate to a new node by entering a node's NamePath, HierarchyPosition, ObjectCode, or GUID, then by hitting enter.  You can also Right-Click on the address bar to open a context menu where you can choose to Copy, Cut, or Paste.  For copying, you can copy the current selection or the current node's NamePath, HierarchyPosition, ObjectCode, or GUID.

###### Display
The current selected node's NamePath.

###### Entry
Enter a NamePath, HierarchyPosition, ObjectCode, or GUID and hit enter.  The HierarchyTree will be navigated to that node.  Currently navigating to a node outside of the current application is not allowed.  *Note:* Future functionality will allow navigating to nodes outside the currrent application by opening a new tab/window.

###### Context Menu
Right-click on the Address Bar will present four options
- Copy Selection (Copy the currently highlighted text)
- Cut Selection (Cut the currrently highlighted text)
- Copy (For the currently selected node)
  - NamePath
  - HierarchyPosition
  - ObjectCode
  - GUID
- Paste

### Hierarchy Tree

### Display Tabs

##### Smart
##### DataTypes
##### Relationships
##### Reverse Relationships
##### Items
##### Inheritance
##### Virtual Nodes
##### Properties
- String200
- Numeric
- ObjectFlags
- Text
- Event
