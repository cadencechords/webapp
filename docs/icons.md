# Icons

The app uses **Material Symbols Rounded** (weight 400), to match the Android
app. Each icon is imported as its own SVG from `@material-symbols/svg-400`,
so only the icons in use get bundled, and no icon font is loaded.

```jsx
import Icon from '../components/Icon';

<Icon name="delete" className="w-5 h-5 text-gray-600" />
<Icon name="check_circle" filled className="w-4 h-4" />
<Icon name="close" size=18 />
```

- **Size and color come from CSS.** Use `w-*`/`h-*` classes (as with
  Heroicons) or `size` in px. Color follows `currentColor`.
- **Icons are decorative** (`aria-hidden`). Give icon-only buttons an
  `aria-label` or sr-only text.
- **Adding an icon:** find it at https://fonts.google.com/icons (Rounded
  style), then import it in `src/components/icons/registry.js`. The filled
  variant is `<name>-fill.svg`. A test fails if the app uses an icon that
  isn't registered.
- **Custom icons** in `src/icons/` (music-specific: metronome, markings,
  binder, …) stay as they are, with outlines drawn at a 2px stroke to match
  the symbols.

## Heroicons → Material Symbols

Heroicons "solid" maps to the filled variant. The recent Material Symbols
releases renamed `expand_more` to `keyboard_arrow_down` and `smartphone` to
`mobile`.

| Heroicon (v1)                     | Material Symbol                |
| --------------------------------- | ------------------------------ |
| `AdjustmentsIcon` (outline)       | `tune`                         |
| `ArrowNarrowLeftIcon` (outline)   | `arrow_back`                   |
| `ArrowNarrowRightIcon` (outline)  | `arrow_forward`                |
| `BellIcon` (outline)              | `notifications`                |
| `BellIcon` (solid)                | `notifications` (filled)       |
| `CalendarIcon` (outline)          | `calendar_month`               |
| `CalendarIcon` (solid)            | `calendar_month` (filled)      |
| `ChartBarIcon` (solid)            | `bar_chart` (filled)           |
| `ChatIcon` (outline)              | `chat`                         |
| `CheckCircleIcon` (solid)         | `check_circle` (filled)        |
| `CheckCircleIcon` (outline)       | `check_circle`                 |
| `CheckIcon` (solid)               | `check` (filled)               |
| `CheckIcon` (outline)             | `check`                        |
| `ChevronDownIcon` (outline)       | `keyboard_arrow_down`          |
| `ChevronDownIcon` (solid)         | `keyboard_arrow_down` (filled) |
| `ChevronLeftIcon` (outline)       | `chevron_left`                 |
| `ChevronRightIcon` (outline)      | `chevron_right`                |
| `CogIcon` (outline)               | `settings`                     |
| `CreditCardIcon` (solid)          | `credit_card` (filled)         |
| `DesktopComputerIcon` (outline)   | `desktop_windows`              |
| `DeviceMobileIcon` (outline)      | `mobile`                       |
| `DocumentAddIcon` (outline)       | `note_add`                     |
| `DocumentTextIcon` (outline)      | `description`                  |
| `DotsHorizontalIcon` (solid)      | `more_horiz` (filled)          |
| `DotsVerticalIcon` (outline)      | `more_vert`                    |
| `DownloadIcon` (outline)          | `download`                     |
| `EmojiHappyIcon` (solid)          | `mood` (filled)                |
| `InformationCircleIcon` (outline) | `info`                         |
| `LockClosedIcon` (solid)          | `lock` (filled)                |
| `MailIcon` (outline)              | `mail`                         |
| `MenuAlt2Icon` (outline)          | `notes`                        |
| `MenuAlt2Icon` (solid)            | `notes` (filled)               |
| `MenuIcon` (solid)                | `menu` (filled)                |
| `MinusIcon` (outline)             | `remove`                       |
| `MusicNoteIcon` (solid)           | `music_note` (filled)          |
| `PauseIcon` (solid)               | `pause_circle` (filled)        |
| `PencilIcon` (outline)            | `edit`                         |
| `PencilIcon` (solid)              | `edit` (filled)                |
| `PhotographIcon` (outline)        | `image`                        |
| `PlayIcon` (solid)                | `play_circle` (filled)         |
| `PlusCircleIcon` (outline)        | `add_circle`                   |
| `PlusCircleIcon` (solid)          | `add_circle` (filled)          |
| `PlusIcon` (outline)              | `add`                          |
| `PrinterIcon` (outline)           | `print`                        |
| `SearchIcon` (solid)              | `search` (filled)              |
| `SearchIcon` (outline)            | `search`                       |
| `SelectorIcon` (solid)            | `unfold_more` (filled)         |
| `StopIcon` (solid)                | `stop_circle` (filled)         |
| `SwitchHorizontalIcon` (outline)  | `swap_horiz`                   |
| `SwitchHorizontalIcon` (solid)    | `swap_horiz` (filled)          |
| `TrashIcon` (outline)             | `delete`                       |
| `UserCircleIcon` (outline)        | `account_circle`               |
| `UserIcon` (solid)                | `person` (filled)              |
| `UserRemoveIcon` (outline)        | `person_remove`                |
| `UsersIcon` (solid)               | `group` (filled)               |
| `XCircleIcon` (outline)           | `cancel`                       |
| `XCircleIcon` (solid)             | `cancel` (filled)              |
| `XIcon` (outline)                 | `close`                        |
| `XIcon` (solid)                   | `close` (filled)               |
