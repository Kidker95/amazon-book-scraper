import { ChangeEvent, useEffect, useState } from "react";
import "./List.css";
import { notify } from "../../../Utils/Notify";
import { scrapingService } from "../../../Services/ScrapingService";
import { BookModel } from "../../../Models/BookModel";
import { socketService } from "../../../Services/SocketService";
import { Spinner } from "../../LayoutArea/Spinner/Spinner";

export function List(): JSX.Element {

    const [text, setText] = useState<string>("");
    const [books, setBooks] = useState<BookModel[]>([]);
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        socketService.connect((message: string) => {
            setMessage(message);
        })
        return () => socketService.disconnect();
    }, [])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    }

    const scrapeBooks = async () => {
        if (!text.trim()) {
            notify.error("Search term cannot be empty.");
            return;
        }

        try {
            setIsLoading(true);
            setMessage("");
            setBooks([]);
            const books = await scrapingService.scrapBooks(text);
            setBooks(books);
            if (books.length === 0) {
                setMessage("No books found for your search.");
            }
        } catch (err: any) {
            setMessage(err.message); 
            notify.error(err.message); 
        } finally { setIsLoading(false); }
    };


    return (
        <div className="List">
            <div className="search-card">
                <div className="search-form">
                    <div className="input-group">
                        <input type="search" onChange={handleChange} value={text} className="search-input" placeholder="Enter book title..." />
                    </div>
                    <button onClick={scrapeBooks}  disabled={!text.trim()} className="search-button"> 🔎</button>
                </div>

                {isLoading && (<div className="spinner-container"><Spinner /></div>)}
            </div>

            {books.length === 0 && <div>
                <h3>{message}</h3>
            </div>}
            {books.length > 0 && (
                <div className="table-container">
                    <table className="results-table">
                        <thead>
                            <tr className="table-header">
                                <th>Name</th>
                                <th>Price</th>
                                <th>Author</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book, index) => (
                                <tr key={index} className="table-row">
                                    <td className="table-cell">{book.name}</td>
                                    <td className="table-cell">{book.price}</td>
                                    <td className="table-cell">{book.author}</td>
                                    <td className="table-cell">
                                        <img src={book.imageUrl} alt={book.name} className="book-image" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
