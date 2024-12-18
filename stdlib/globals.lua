--- ## DChar Lua Standard Library
---
--- Defines all globals provided to lua scripts ran in DChar.
--- Implementations are not present here as it is provided to the engine at runtime dynamically.
--- Only the functions defined here are passed to the lua runtime. This is to prevent remote code execution and other potential vulnerabilities. Need a function? [Open an issue](https://github.com/floffah/dchar).
---
--- Features that will NOT be implemented:
---
--- * File I/O (for now, uploading/storing files in a controlled environment is a potential future feature)
--- * Network (may allow proxying json files in the future to lower bandwidth usage)
--- * OS
--- * Threads (managed by the engine)
--- * Debugging (debug server wise, DX will be improved as necessary to deal with this loss)
--- * Any other feature that could be used to exploit the system
---
---@copyright 2024
---@license MIT
---@author Floffah

--- Print to console.
---@param ... any
function print(...)
end;

--- Require a file. If the file hasn't been loaded, this will call its 'onload' function. Must be a pathname already loaded by a dependency array somewhere.
---
--- NOTE: Sources are isolated from each other, even when called via 'extends'. Variables should not be shared between sources. Only call functions from the source you want to use and keep asynchronous practices and thread-safety in mind.
---@param pathname string
---@param[opt] source string - The source from which this file belongs. If not provided, uses the current source.
function require(pathname, source)
end;

--- Check if a source file is loaded. This may return false for source files that are referenced in optional dependencies and not loaded. To load them run require(pathname).
---@param pathname string
function isloaded(pathname)
end;

--- Declare a variable in the character sheet.
--- These are used either to store calculations to display in the character sheet or to enable user input from the user.
--- If a variable with that name already exists, it will return a reference to that instead. 
--- Declaring a variable using regular Lua syntax will not be persisted between reloads.
---@param name string
---@param[opt] initialValue any
---@param[opt] options table - Currently unused
---@treturn VariableRef
function variable(name, initialValue, options)
end

--- Variable Reference
---@table VariableRef
---@field name string
---@field ref string
---@field get fun():any
---@field set fun(value:any):nil

--- Namespace containing functions for adding fields to the character sheet create/edit wizard
editwizard = {}

--- Add a field to the character sheet create/edit wizard.
---@param id string
---@tparam FieldOptions options
function editwizard.field(id, options)
end

--- Field options
---@table FieldOptions
---@field label string - The label to display for the field
---@field[opt] description string - The description to display for the field
---@field type string - Field type, one of: "string", "textarea", "number", "boolean", "select", "multi-select"
---@field page string - The id of a page to display the field on
---@field section string - The id of a section to display the field in
---@field[opt] variable string - The variable to store the value in
---@field[opt] onchange fun(value:any):nil - Function to call when the value of the field changes
---@field[opt] default any - Default value for the field
---@field[opt] options table - Options for the field, only used for "select" and "multi-select" types
---@field[opt=false] required boolean - Whether the field is required
---@field[opt] autoGenerate fun():any - Function to generate a value for the field. Displays a button to generate the value.
---@field[opt] validate fun(value:any):string|nil - Function to validate the value of the field. Returns an error message if the value is invalid.

--- Add a page to the character sheet create/edit wizard. Does nothing if the page already exists.
---@param id string
---@param name string
function editwizard.page(id, name)
end

--- Add a section to the character sheet create/edit wizard. Does nothing if the section already exists.
---@param id string
---@param name string
---@param page string
function editwizard.section(id, name, page)
end