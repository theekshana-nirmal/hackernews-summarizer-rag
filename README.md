# Hacker News Summarizer RAG

I built this project to learn how RAG (Retrieval-Augmented Generation) actually works. It pulls the front page of Hacker News, breaks the content into chunks, turns them into vectors, and then uses Google Gemini to write a summary of what's trending right now.

Nothing fancy here. Just a straightforward pipeline to understand the core idea, give an LLM data it has never seen before and let it answer questions about it.

## About Hacker News

[Hacker News](https://news.ycombinator.com/) is a tech-focused social news site run by Y Combinator. The front page shows top-ranked stories submitted and voted on by the community. I used it as the data source here because it updates often and is easy to scrape.

## What it does

- Scrapes the Hacker News front page
- Splits the text into smaller chunks
- Embeds each chunk into a vector using Gemini's embedding model
- Stores everything in an in-memory vector store
- Retrieves the most relevant chunks when asked a question
- Passes them to Gemini to generate a summary

## Built with

- TypeScript
- LangChain
- Google Gemini
- Cheerio

## Running it yourself

You need Node.js v18+ and a Gemini API key from https://aistudio.google.com/api-key.

1. Clone the repo and install dependencies.

```bash
npm install
```

2. Create a `.env` file in the root.

```
GOOGLE_API_KEY=your_key_here
```

3. Run it.

```bash
npx ts-node index.ts
```
