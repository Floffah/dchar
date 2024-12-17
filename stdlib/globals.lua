--- ## DChar Lua Standard Library
---
--- Defines all globals provided to lua scripts ran in DChar.
--- Implementations are not present here as it is provided to the engine at runtime dynamically.
--- Only the functions defined here are passed to the lua runtime. This is to prevent remote code execution and other potential vulnerabilities. Need a function? [Open an issue](https://github.com/floffah/dchar).
--- 
--- Features that will NOT be implemented:
---
--- * File I/O
--- * Network
--- * OS
--- * Threads
--- * Debugging (debug server wise, DX will be improved as necessary to deal with this loss)
--- * Any other feature that could be used to exploit the system
---
---@copyright 2024
---@license MIT
---@author Floffah

--std lib

--- Print to console
---@param ... any
function print(...) end;

--- Require a file. If the file hasn't been loaded, this will call its 'onload' function. Must be a pathname already loaded by a dependency array somewhere.
---
--- NOTE: Sources are isolated from each other, even when called via 'extends'. Variables should not be shared between sources. Only call functions from the source you want to use and keep asynchronous practices and thread-safety in mind.
---@param pathname string
---@param[opt] source string - The source from which this file belongs. If not provided, uses the current source.
function require(pathname, source) end;

--sources

--- Check if a source file is loaded. This may return false for source files that are referenced in optional dependencies and not loaded. To load them run require(pathname).
---@param pathname string
function isloaded(pathname) end;

--- Declare a variable in the character sheet.
--- These are used either to store calculations to display in the character sheet or to enable user input from the user.
---@param name string
---@param[opt] initialValue any
---@param[opt] options table
---@param[opt] options.type string One of "string", "number", "boolean", "table". Table is only allowed for user set variables. If not set, infers from initialValue or falls back to string.
---@treturn VariableRef
function declarevariable(name, initialValue, options)  end

--- Variable Reference
---@table VariableRef
---@field name string
---@field ref string
---@field type string
---@field get fun():any