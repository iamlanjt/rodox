# Current Known Issues

## Formatting
- Roblox uses their own internal files for formatting, so things like `[Model](../../../stduio/model-tab.md)` I'll have to
find a way to parse
- Images are currently not parsed at all
	- (further, image format Roblox uses): 
\<img
src="/assets/studio/general/Model-Tab-Constraints-Create-Menu.png"
width="740" alt="Constraint picker indicated in Studio toolbar"\/\>
- Headers are rendered as `######` instead of their respective formatting

## Subtopics
- Roblox documentation is split into sub-topics (articles, classes, datatype, etc) and some of these sub-topics do not fit into the current
assumed data interface, causing some `undefined` bugs.

## Unreachable(?) Data
- Some data (like `code_samples`) are just references (i presume) to different resources internally