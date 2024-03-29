# The UTF-8 Illustrator

![image](demo.gif)


Online tool where you can type chars (or emoji) and see what it looks like when utf-8 encoded.

[Try it out](https://davidxcheng.github.io/utf-8-illustrator/) 👀

## Learn more/everything about UTF-8, Unicode & emoji!

Shout out to some great resources about utf-8, Unicode, emoji etc:

- [Characters, Symbols and the Unicode Miracle](https://www.youtube.com/watch?v=MijmeoH9LT4) by **Computerphile**. 9 min 36 s pure YouTube gold
- [Emoji: how do you get from U+1F355 to 🍕?](https://meowni.ca/posts/emoji-emoji-emoji/) by **Monica Dinculescu**
- [JavaScript has a Unicode problem](https://mathiasbynens.be/notes/javascript-unicode) by **Mathias Bynens**
- [The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/) by **Joel Spolsky**


## Local development

For local development on `http://localhost:8000`, first run `npm install` and then:

```
npm run dev &
tsc --watch &
```

Note to self: list background tasks with `jobs` and use `kill %{jobId}` to stop a task.
