import './App.css'
import {RankType} from "./models/BubbleTeaModel.ts";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ranks = Object.values(RankType);

const colors = [
    'grey',
    '#AEC6CF',
    '#B7E2B1',
    '#C9E0A9',
    '#E3D99F',
    '#F5C59E',
    '#f7a4e9',
    '#F4A6A6'
];

function App() {

  return (
    <div className="main-page">
      <header>
          <div className="title-container">
          <h1>Bubble Tea'R List</h1>
          <DotLottieReact
              src="https://lottie.host/c595c486-a870-453f-b473-2d3ca958855c/dnuSf60ivC.lottie"
              loop
              autoplay
              className="lottie-animation"
          />
          </div>
          <button>+</button>
      </header>
        <main>
            <ul>
                {ranks.map((rank, id) => (
                    id !== 0
                        ? (
                            <li key={id}>
                                <span style={{backgroundColor: colors[id]}}>{rank}</span>
                            </li>
                          )
                        : null
                ))}
                <li>
                </li>
            </ul>
        </main>
    </div>
  )
}

export default App
