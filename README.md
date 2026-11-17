# chathub

The hub for my AI chat tools. One page lists every tool, grouped by what you do with your chats, and one Windows installer puts all of them on your PC so everything works offline.

Hosted page: https://spencerrios64.github.io/chathub/

## Install on Windows (offline)

Paste this in PowerShell, or download this repo and double-click `install.bat`:

```
powershell -ExecutionPolicy Bypass -c "iwr https://raw.githubusercontent.com/spencerrios64/chathub/main/install.ps1 -UseBasicParsing | iex"
```

It downloads every tool into `%USERPROFILE%\ChatHub`, adds a ChatHub shortcut on your desktop and opens the hub. Run it again any time to update.

## The tools

| Step | Tool | What it does |
|---|---|---|
| Collect | [chatzip](https://github.com/spencerrios64/chatzip) | AI exports into one zip, a folder per AI |
| Collect | [chatvault](https://github.com/spencerrios64/chatvault) | Local SQLite archive of Claude and ChatGPT chats (Python) |
| Clean | [chatscrub](https://github.com/spencerrios64/chatscrub) | Remove keys, emails, phones from chats |
| Clean | [chatdedupe](https://github.com/spencerrios64/chatdedupe) | Find and merge duplicate chats |
| Understand | [chatstats](https://github.com/spencerrios64/chatstats) | Usage stats per AI |
| Understand | [chatsearch](https://github.com/spencerrios64/chatsearch) | Ranked search across all chats |
| Understand | [chatgraph](https://github.com/spencerrios64/chatgraph) | Knowledge graph and Obsidian vault export |
| Understand | [chatbrief](https://github.com/spencerrios64/chatbrief) | Context pack to continue in any AI |
| Reuse | [promptbank](https://github.com/spencerrios64/promptbank) | Searchable library of prompts that worked |
| Use | [chatrelay](https://github.com/spencerrios64/chatrelay) | One chat across several AIs with failover |
| Use | [chatcompare](https://github.com/spencerrios64/chatcompare) | Same question to several AIs side by side |
| Use | [chatevals](https://github.com/spencerrios64/chatevals) | Win rates per AI and topic |
| All-in-one | [chatpipeline](https://github.com/spencerrios64/chatpipeline) | Scrub, dedupe, count and zip in one flow |
| Train | [chattrainer](https://github.com/spencerrios64/chattrainer) | Fine-tune a local LLM on your chats |

## How they fit together

Export your chats, then `chatzip` or `chatpipeline` to collect and clean them. `chatvault` keeps a permanent archive. `chatsearch`, `chatgraph`, `chatstats` and `chatbrief` help you understand and reuse them, `chatrelay`, `chatcompare` and `chatevals` help you use several AIs, and `chattrainer ai-dataset` turns the good chats into training data.

Nothing is uploaded anywhere. Browser tools run entirely on your machine, and the zip handling is built in, so they work with no internet.
