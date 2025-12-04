export interface BubbleTeaModel {
    Name: string;
    City: string;
    Rank: RankType;
    id: string;
    imageUrl: string;
}

export enum RankType {
    Unasigned = "Unasigned",
    S = "Boisson divine",
    A = "J'en reprends un !",
    B = "Je suis bieeeen",
    C = "Texture intéréssante",
    D = "Buvable",
    E = "Si tu recraches après, ça va",
    F = "Je le donnerais même pas à un sans abri"
}