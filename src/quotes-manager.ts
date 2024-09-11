import * as fs from "fs";

export interface Quote {
    body: string;
    author_name: string;
    author_id: string;
}

export function getQuotes(): Quote[] {
    if (fs.existsSync("quotes.json")) {
        const file = fs.readFileSync("quotes.json");
        try { 
            return JSON.parse(file.toString());
        }
        catch (error) {
            return [];
        }
    }
    return [];
}
export function submitQuote(quote: Quote) {
    let quotes = getQuotes();
    quotes.push(quote);
    fs.writeFileSync("quotes.json", JSON.stringify(quotes));
}

export function getRandomQuote(): Quote {
    const quotes = getQuotes();
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return randomQuote;
}

export function quoteExists(quote: Quote): boolean {
    const quotes = getQuotes();
    return quotes.some((q: Quote) => q.body === quote.body);
}
