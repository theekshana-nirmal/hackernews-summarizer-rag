import 'dotenv/config';
import {CheerioWebBaseLoader} from "@langchain/community/document_loaders/web/cheerio";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";
import {MemoryVectorStore} from "@langchain/classic/vectorstores/memory";
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import {createRetrievalChain} from "@langchain/classic/chains/retrieval";
import {createStuffDocumentsChain} from "@langchain/classic/chains/combine_documents";
import {ChatPromptTemplate} from "@langchain/core/prompts";


async function main() {
    // STEP 01: Load the Web Page
    const loader = new CheerioWebBaseLoader("https://news.ycombinator.com/", {selector: ".titleline"});
    const docs = await loader.load();

    console.log(docs[0].pageContent);

    // STEP 02: Split Into Chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 150, chunkOverlap: 15
    });

    const chunks = await splitter.splitDocuments(docs);
    console.log(chunks);

    // STEP 03: Create Embeddings and Store in the Vector Store
    const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "gemini-embedding-001"
    });

    const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);

    console.log("Vector store created and loaded with chunks.");
    console.log(vectorStore);

    // STEP 04: Build the Retrieval Chain
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        temperature: 0.3
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
        You are a news summarizer. Based ONLY on the context provided below,
        write a single concise paragraph summarizing the main news topics and trends.
        Do not make up any information not present in the context.
    
        Context: {context}
        Question: {input}
    `);

    const combineDocsChain = await createStuffDocumentsChain({
        llm: model,
        prompt
    });

    const ragChain = await createRetrievalChain({
        retriever: vectorStore.asRetriever({k: 10}),
        combineDocsChain
    });

    // STEP 05: Ask the Question
    const result = await ragChain.invoke({
        input: "What are the main news stories related to Artificial Intelligence?"
    });

    console.log("\n--- SUMMARY ---\n");
    console.log(result.answer);
}

main();