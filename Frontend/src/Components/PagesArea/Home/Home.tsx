import "./Home.css";

export function Home(): JSX.Element {
    return (
        <div className="Home">
            <div className="about-section">
                <h2>About Me</h2>
                <p>
                    Hi, I'm Omri, a passionate full-stack developer skilled in creating modern web applications. 
                    I enjoy building clean, efficient, and user-friendly applications using React, Node.js, and other tools.
                </p>
                <h2>About The Site</h2>
                <p>
                    This site allows you to search for books on Amazon, providing real-time updates and detailed results 
                    such as the book's name, author, price, and cover image. It's built using a Node.js backend with 
                    Puppeteer for scraping and a React frontend for an interactive user experience.
                </p>
                <a href="https://github.com/Kidker95" target="_blank" rel="noopener noreferrer" className="github-link">Visit My GitHub</a>
            </div>
        </div>
    );
}
