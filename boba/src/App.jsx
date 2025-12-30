import './App.css'
import {RankType} from "./models/BubbleTeaModel.ts";
import {Suspense, use, useState} from "react";
import {createBubbleTea, getAllBubbleTeas, updateBubbleTea} from "./api/boba-back.js";
import {DndContext, DragOverlay, useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';
import {Description, Dialog, DialogPanel, DialogTitle} from "@headlessui/react";

const ranks = Object.values(RankType);

const rankToNote = (rank) => {
    const mapping = {
        [RankType.S]: 5,
        [RankType.A]: 4,
        [RankType.B]: 3,
        [RankType.C]: 2,
        [RankType.D]: 1,
        [RankType.E]: 0.3,
        [RankType.F]: 0
    };
    return mapping[rank] || 0;
};

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

function DraggableCard(props) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: props.id,
    });
    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <li key={props.item.id || props.key} className="boba-card" ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <strong>{props.item.name}</strong>
            {props.item.address && <><br/><small>{props.item.address}</small></>}
        </li>
    );
}


function Items({ dataPromise, rank }) {
    const data = use(dataPromise);
    
    // Mapping entre les notes du backend (0-5) et les rangs du frontend
    const filteredData = data.filter(item => {
        if (rank === RankType.S) return item.note >= 4.5;
        if (rank === RankType.A) return item.note >= 3.5 && item.note < 4.5;
        if (rank === RankType.B) return item.note >= 2.5 && item.note < 3.5;
        if (rank === RankType.C) return item.note >= 1.5 && item.note < 2.5;
        if (rank === RankType.D) return item.note >= 0.5 && item.note < 1.5;
        if (rank === RankType.E) return item.note > 0 && item.note < 0.5;
        if (rank === RankType.F) return item.note === 0;
        return false;
    });
    
    return <ul className="boba-list">
        {filteredData.map((item, index) => (
            <DraggableCard item={item} key={index} id={item.id} />
        ))}
    </ul>;
}

function DroppableRankLine(props) {
    const {setNodeRef} = useDroppable({
        id: props.id,
    });

    return (
        <li key={props.id} className="rank-line" ref={setNodeRef}>
            <span style={{backgroundColor: colors[props.id]}}>{props.rank}</span>
            <Items dataPromise={props.dataPromise} rank={props.rank}/>
        </li>
    );
}

function ActiveCardOverlay({ activeId, dataPromise }) {
    const data = use(dataPromise);
    const activeItem = data.find(item => item.id === activeId);

    if (!activeItem) return null;

    return (
        <div className="boba-card dragging" style={{
            opacity: 0.8,
            cursor: 'grabbing',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transform: 'scale(1.05)',
        }}>
            <strong>{activeItem.name}</strong>
            {activeItem.address && <><br/><small>{activeItem.address}</small></>}
        </div>
    );
}

function App() {
    const [dataPromise, setDataPromise] = useState(() => getAllBubbleTeas());
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [activeId, setActiveId] = useState(null);

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            const bobaId = active.id;
            let rankIndex = over.id;
            if (typeof rankIndex !== 'number') {
                dataPromise.then(data => {
                    const targetBoba = data.find(b => b.id === over.id);
                    const sourceBoba = data.find(b => b.id === active.id);
                    
                    if (targetBoba && sourceBoba) {
                        const newNote = targetBoba.note;
                        
                        updateBubbleTea(bobaId, { ...sourceBoba, note: newNote })
                            .then(() => {
                                setDataPromise(getAllBubbleTeas());
                            })
                            .catch(err => console.error("Erreur d'update (drop sur carte):", err));
                    }
                });
                return;
            }
            const newRank = ranks[rankIndex];
            const newNote = rankToNote(newRank);
            dataPromise.then(data => {
                const sourceBoba = data.find(b => b.id === active.id);
                if (sourceBoba) {
                    updateBubbleTea(bobaId, { ...sourceBoba, note: newNote })
                        .then(() => {
                            setDataPromise(getAllBubbleTeas());
                        })
                        .catch(err => console.error("Erreur d'update (drop sur rang):", err));
                }
            });
        }
    }

  return (
    <div className="main-page">
      <header>
          <h1>Bubble Tea'R List</h1>
          <button onClick={() => setPopupIsOpen(true)}>+</button>
      </header>
        <Dialog open={popupIsOpen} onClose={() => setPopupIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 flex flex-col">
                    <DialogTitle className="font-bold">Add item</DialogTitle>
                    <Description>If you want to add an item that isn't in the acutal list.</Description>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const bobaData = {
                            name: newName,
                            address: newAddress,
                            note: 0
                        };
                        createBubbleTea(bobaData)
                            .then(() => {
                                setDataPromise(getAllBubbleTeas());
                                setPopupIsOpen(false);
                                setNewName("");
                                setNewAddress("");
                                window.location.reload();
                            })
                            .catch(err => console.error("Erreur de création:", err));
                    }}>
                        <label>Name
                            <input value={newName} onChange={e => setNewName(e.target.value)} type="text"/>
                        </label>
                        <label>Address
                            <input value={newAddress} onChange={e => setNewAddress(e.target.value)} type="text"/>
                        </label>
                        <div className="flex gap-4">
                            <button onClick={() => setPopupIsOpen(false)} type="button">Cancel</button>
                            <button type="submit">Add</button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <main>
                <ul className="rank-list">
                    <Suspense fallback={<li>Chargement des adresses...</li>}>
                        {ranks.map((rank, id) => (
                            id !== 0
                                ? (
                                    <DroppableRankLine id={id} key={id} rank={rank} dataPromise={dataPromise} />
                                )
                                : null
                        ))}
                    </Suspense>
                </ul>
            </main>
            <DragOverlay>
                {activeId ? (
                    <Suspense fallback={<div className="boba-card dragging">Chargement...</div>}>
                        <ActiveCardOverlay activeId={activeId} dataPromise={dataPromise} />
                    </Suspense>
                ) : null}
            </DragOverlay>
        </DndContext>
    </div>
  )
}

export default App
