import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
    CANVAS_SIZE,
    SNAKE_START,
    APPLE_START,
    SCALE,
    SPEED,
    DIRECTIONS
} from "./constants";
import Navigation from "../../components/main/navigation/Navigation";
import Menu from "../../components/main/menu/Menu";
import RightBarGame from "../../components/main/rightBarGame/RightBarGame";
import './gamePage.css';
import axios from "axios";


const GamePage = () => {

    const canvasRef = useRef();
    const [snake, setSnake] = useState(SNAKE_START);
    const [apple, setApple] = useState(APPLE_START);
    const [dir, setDir] = useState([0, -1]);
    const [speed, setSpeed] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [update, setUpdate] = useState();

    useInterval(() => gameLoop(), speed);

    const endGame = async () => {
        setSpeed(null);
        setGameOver(true);

        const data = new FormData();
        data.append("points", snake.length-2);

        await axios.post('/games', data);
        setUpdate(Date().toLocaleString())
    };

    const moveSnake = ({ keyCode }) =>
        keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);

    const createApple = () =>
        apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

    const checkCollision = (piece, snk = snake) => {
        if (
            piece[0] * SCALE >= CANVAS_SIZE[0] ||
            piece[0] < 0 ||
            piece[1] * SCALE >= CANVAS_SIZE[1] ||
            piece[1] < 0
        )
            return true;

        for (const segment of snk) {
            if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
        }
        return false;
    };

    const checkAppleCollision = newSnake => {
        if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
            let newApple = createApple();
            while (checkCollision(newApple, newSnake)) {
                newApple = createApple();
            }
            setApple(newApple);
            return true;
        }
        return false;
    };

    const gameLoop = () => {
        const snakeCopy = JSON.parse(JSON.stringify(snake));
        const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
        snakeCopy.unshift(newSnakeHead);
        if (checkCollision(newSnakeHead)) endGame();
        if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
        setSnake(snakeCopy);
    };

    const startGame = () => {
        document.getElementById('canvas').focus();
        setSnake(SNAKE_START);
        setApple(APPLE_START);
        setDir([0, -1]);
        setSpeed(SPEED);
        setGameOver(false);
    };

    useEffect(() => {
        const context = canvasRef.current.getContext("2d");
        context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        context.fillStyle = "purple";
        snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
        context.fillStyle = "maroon";
        context.fillRect(apple[0], apple[1], 1, 1);
    }, [snake, apple, gameOver]);

    return (
        <>
            <Navigation/>
            <div className="gameWrapper">
                <Menu />
                    <div className="game">
                        <div className="black bg-white-90 f2 w-30 gameStart" onClick={startGame}>Start</div>
                        <div id="canvas" role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
                            <canvas
                                style={{ width: '100%', backgroundColor: '#E5E5E5' }}
                                ref={canvasRef}
                                width={`${CANVAS_SIZE[0]}px`}
                                height={`${CANVAS_SIZE[1]}px`}
                            />
                        </div>
                        <br/>
                        {gameOver && <div className="black bg-white-90 f3 w-30 gameOver">GAME OVER! You gained {snake.length-2} points.</div>}
                    </div>

                <RightBarGame update={update}/>
            </div>
        </>
    )
};

export default GamePage;



