---
--@copyright 2024
--@license MIT
--@author Floffah

--std lib

--- Print to console
---@param ... any
function print(...) end;

--- Load a file. Doesn't actually load the file as it is already loaded. Must be a pathname already loaded by a dependency array somewhere.
---@param pathname string
function require(pathname) end;

--sources

--- Check if a source is loaded. This may return false for source files that are referenced in optional dependencies and not loaded. To load them run loadsource(pathname).
---@param pathname string
function isloaded(pathname) end;

--- Load a source file. This will load the file and run the onload function if it exists.
---@param pathname string
function loadsource(pathname) end;

--- Declare a variable in the character sheet.
--- These are used either to store calculations to display in the character sheet or to enable user input from the user.
---@param name string
---@param[opt] initialValue any
function declareVariable(name, initialValue)  end