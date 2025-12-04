import './App.css'
import {RankType} from "./models/BubbleTeaModel.ts";

const ranks = Object.values(RankType);

const colors = [
    'grey',
    '#AEC6CF',
    '#B7E2B1',
    '#C9E0A9',
    '#E3D99F',
    '#F5C59E',
    '#F7ABA4',
    '#F4A6A6'
];

function App() {

  return (
    <div className="main-page">
      <header>
          <h1>Bubble Tea'R List</h1>
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
