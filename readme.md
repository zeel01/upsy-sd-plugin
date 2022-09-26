# Upsy Desky Stream Deck Plugin

This is a [plugin](https://developer.elgato.com/documentation/) for the [Elgato Stream Deck](https://www.elgato.com/en/gaming/stream-deck) that allows you to control your sit/stand desk using an [Upsy Desky](https://github.com/tjhorner/upsy-desky) desk controller.

![Photo of the Stream Deck with the Upsy Desky plugin](example-photo.jpg)

## Installation

This plugin doesn't have a release built yet.

To install it, you need to close out of the Stream Deck software completely, then copy the folder `com.lordzeel.upsy-sd.sdPlugin` to the Stream Deck plugins folder.

### Plugins folder location
#### Windows
```
%appdata%\Elgato\StreamDeck\Plugins\
```
#### Mac
```
~/Library/Application Support/com.elgato.StreamDeck/Plugins/
```

## Actions

This plugin provides three actions that allow you to control your standing desk height.

![Screen shot of the Stream Deck application showing a profile with the Upsy Desky plugin actions](example-screenshot.png)

### Set Height

This action allows you to set the height of the desk to a specific value.

#### Properties
| Property | Description |
| --- | --- |
| Upsy Desky Address | The network address of the Upsy Desky web server for REST API. |
| Height | The height to set the desk to. |

### Go To Preset

This action sets the desk height to one of the four stored preset values (just like the desk controller).

#### Properties
| Property | Description |
| --- | --- |
| Upsy Desky Address | The network address of the Upsy Desky web server for REST API. |
| Preset | The preset to set the desk to. |

### Height Display

This action doesn't *do* anything, but it will display the current height of the desk on the button as the title.

#### Properties
| Property | Description |
| --- | --- |
| Upsy Desky Address | The network address of the Upsy Desky web server for REST API. |
| Title Prefix | Some text to display on the button before the height. |