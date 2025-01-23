import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card";

const images = [
  "/img1.svg",
  "/img2.svg",
  "/img3.svg",
  "/img4.svg",
  "/img5.svg",
  "/img6.svg",
];

const generateCards = (mode) => {
  const totalImages = mode / 2; 
  const selectedImages = images.slice(0, totalImages);
  const doubleImages = selectedImages.concat(selectedImages); 
  const shuffledImages = doubleImages.sort(() => Math.random() - 0.5); 
  return shuffledImages.map((image, index) => ({
    id: index,
    image,
    matched: false,
  }));
};

function App() {
  const [cards, setCards] = useState([]);
  const [filppedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameMode, setGameMode] = useState(4); 
  const totalPairs = gameMode / 2; 

  useEffect(() => {
    const generatedCards = generateCards(gameMode); 
    setCards(generatedCards);
  }, [gameMode]); 

  const handleClick = (clickedCard) => {
    if (
      isChecking ||
      filppedCards.some((card) => card.id === clickedCard.id) ||
      clickedCard.matched
    ) {
      return;
    }

    setMoves((prevMoves) => prevMoves + 1);

    const newFillpedCards = [...filppedCards, clickedCard];
    setFlippedCards(newFillpedCards);

    if (newFillpedCards.length === 2) {
      setIsChecking(true);
      if (newFillpedCards[0].image === newFillpedCards[1].image) {
        setMatchedPairs((prevMatchedPairs) => prevMatchedPairs + 1);
        setCards((prevCards) =>
          prevCards.map((card) =>
            newFillpedCards.some((flippedCard) => flippedCard.id === card.id)
              ? { ...card, matched: true }
              : card
          )
        );
      }
      setTimeout(() => {
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-[url('/bg.svg')] bg-center">
      <div className="container m-auto h-screen flex justify-center items-center relative">
        
        {/* Settings Menu */}
        <div className="absolute top-15 right-12 bg-[#0ca59c] text-white p-6 rounded-lg shadow-lg w-48">
          <h2 className="text-lg font-bold text-center">Settings</h2>
          <select
            className="mt-4 w-full p-2 bg-[#23b7ad] text-white rounded-md border border-[#0ca59c]"
            value={gameMode}
            onChange={(e) => setGameMode(Number(e.target.value))}
          >
            <option value={4}>4 Cards</option>
            <option value={16}>16 Cards</option>
          </select>
        </div>

        {/* Game Board */}
        <div className="game-bord grid grid-cols-3 md:grid-cols-4 gap-4 p-4">
          {cards.map((card) => (
            <Card
              key={card.id}
              onClick={handleClick}
              card={card}
              isFillped={
                filppedCards.some(
                  (flippedCard) => flippedCard.id === card.id
                ) || card.matched
              }
            />
          ))}

          {matchedPairs === totalPairs && (
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-white bg-opacity-75">
              <h1 className="text-4xl font-bold text-green-600">You Win!</h1>
              <p className="text-xl mt-4">Score: {matchedPairs}</p>
              <p className="text-xl mt-2">Moves: {moves}</p>
              <button
                className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-600"
                onClick={() => {
                  setMatchedPairs(0);
                  setMoves(0);
                  setCards(generateCards(gameMode));
                }}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;